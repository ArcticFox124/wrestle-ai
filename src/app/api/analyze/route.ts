import { NextRequest, NextResponse } from 'next/server';
import { MatchAnalysisResult, TargetWrestler } from '@/types/wrestling';
import { DEMO_MATCH_NCAA } from '@/lib/demoData';
import { analyzeMatchLocally } from '@/lib/localVisionEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sourceType = 'upload',
      videoUrl,
      frames = [],
      targetWrestler = 'both',
      provider = 'local', // 'local' | 'gemini' | 'openai' | 'claude' | 'groq'
      apiKey,
      matchNotes,
      durationSeconds = 420,
    } = body;

    // 1. ZERO-KEY LOCAL ENGINE (Default & Offline)
    // Runs 100% free with no keys, no timeouts, and zero external cloud reliance!
    if (provider === 'local' || !apiKey) {
      if (sourceType === 'demo' && !videoUrl) {
        return NextResponse.json({
          success: true,
          data: DEMO_MATCH_NCAA,
          source: 'demo',
        });
      }

      const localResult = analyzeMatchLocally({
        sourceType,
        videoUrl,
        durationSeconds,
        targetWrestler,
        matchNotes,
        frames,
      });

      return NextResponse.json({
        success: true,
        data: localResult,
        source: 'local-engine',
        message: 'Analyzed using Built-in Folkstyle Kinematic Engine (Zero Key Mode)',
      });
    }

    const effectiveApiKey = apiKey.trim();

    // 2. OPENAI GPT-4o INTEGRATION
    if (provider === 'openai') {
      const openAiUrl = 'https://api.openai.com/v1/chat/completions';
      const promptText = getPrompt(targetWrestler, matchNotes, sourceType, videoUrl);

      const contentParts: any[] = [{ type: 'text', text: promptText }];
      if (frames && frames.length > 0) {
        frames.slice(0, 15).forEach((f: any) => {
          contentParts.push({
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${f.data}` },
          });
        });
      }

      const openAiRes = await fetch(openAiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: contentParts }],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
      });

      if (!openAiRes.ok) {
        const err = await openAiRes.text();
        return NextResponse.json({ error: `OpenAI API Error: ${err}` }, { status: openAiRes.status });
      }

      const openAiData = await openAiRes.json();
      const rawJson = openAiData.choices?.[0]?.message?.content;
      return NextResponse.json({
        success: true,
        data: JSON.parse(rawJson),
        source: 'openai',
      });
    }

    // 3. ANTHROPIC CLAUDE 3.5 SONNET INTEGRATION
    if (provider === 'claude') {
      const claudeUrl = 'https://api.anthropic.com/v1/messages';
      const promptText = getPrompt(targetWrestler, matchNotes, sourceType, videoUrl);

      const claudeContent: any[] = [];
      if (frames && frames.length > 0) {
        frames.slice(0, 15).forEach((f: any) => {
          claudeContent.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: f.data,
            },
          });
        });
      }
      claudeContent.push({
        type: 'text',
        text: `${promptText}\n\nIMPORTANT: Respond with ONLY the raw JSON object, no preamble.`,
      });

      const claudeRes = await fetch(claudeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': effectiveApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 3500,
          temperature: 0.1,
          messages: [{ role: 'user', content: claudeContent }],
        }),
      });

      if (!claudeRes.ok) {
        const err = await claudeRes.text();
        return NextResponse.json({ error: `Claude API Error: ${err}` }, { status: claudeRes.status });
      }

      const claudeData = await claudeRes.json();
      const rawText = claudeData.content?.[0]?.text;
      const cleanJson = cleanMarkdownJson(rawText);
      return NextResponse.json({
        success: true,
        data: JSON.parse(cleanJson),
        source: 'claude',
      });
    }

    // 4. GOOGLE GEMINI 1.5 / 2.0 FLASH INTEGRATION
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveApiKey}`;
    const promptText = getPrompt(targetWrestler, matchNotes, sourceType, videoUrl);

    const parts: any[] = [];
    if (sourceType === 'youtube' && videoUrl) {
      parts.push({
        fileData: { mimeType: 'video/mp4', fileUri: videoUrl },
      });
    } else if (frames && frames.length > 0) {
      frames.slice(0, 20).forEach((frame: any) => {
        parts.push({
          inlineData: { mimeType: 'image/jpeg', data: frame.data },
        });
      });
    }
    parts.push({ text: promptText });

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json(
        { error: `Gemini API returned status ${geminiRes.status}: ${errText}` },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();
    const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanJson = cleanMarkdownJson(candidateText);

    return NextResponse.json({
      success: true,
      data: JSON.parse(cleanJson),
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze match.' },
      { status: 500 }
    );
  }
}

function cleanMarkdownJson(text: string): string {
  let cleaned = (text || '').trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned;
}

function getPrompt(
  targetWrestler: string,
  matchNotes: string,
  sourceType: string,
  videoUrl?: string
): string {
  return `
CRITICAL INSTRUCTION - ZERO HALLUCINATION POLICY:
You are an Olympic and NCAA Division I Folkstyle Wrestling Coach and Head Video Analyst.
You are analyzing the provided video frames of this wrestling match.

DO NOT INVENT MOVES.
If a period is scoreless or consists of hand-fighting without a takedown, report ONLY what you actually see.
If the video does not show a wrestling match, do NOT make up wrestling events.

STEP 1: VISUAL EVIDENCE
- Visually identify the wrestlers by their singlets or ankle bands (Red vs Blue/Green/Black).
- If names are visible on screen or broadcast graphics, use them. Otherwise name them "Red Wrestler" and "Green/Opponent Wrestler".
- Target analysis focus: ${targetWrestler === 'both' ? 'Both wrestlers (Head-to-Head)' : `${targetWrestler.toUpperCase()} wrestler`}.
- Extra context from user: ${matchNotes || 'None'}

STEP 2: STRICT FOLKSTYLE SCORING RULES
- TAKEDOWN (+3 pts NCAA / +2 pts HS): Control established behind hips or breaking down base.
- ESCAPE (+1 pt): Defensive wrestler breaks all contact and faces opponent.
- REVERSAL (+2 pts): Bottom wrestler comes directly out and takes top control.
- NEAR FALL (+2, +3, +4 pts): Wrestler held past 45 degrees near mat.
- RIDING TIME: Count total seconds of top control.
- Citing exact video timestamps: Every event MUST have an exact timestamp (in seconds from start of video).

Output MUST be a single raw JSON object strictly adhering to this schema with NO markdown code-blocks:
{
  "id": "match-${Date.now()}",
  "title": "Folkstyle Match Analysis",
  "sourceType": "${sourceType}",
  "videoUrl": "${videoUrl || ''}",
  "analyzedTarget": "${targetWrestler}",
  "dateAnalyzed": "${new Date().toISOString().split('T')[0]}",
  "durationSeconds": 420,
  "finalScore": { "red": 0, "green": 0, "winner": "red" },
  "ridingTime": { "redSeconds": 0, "greenSeconds": 0, "ridingTimeAdvantageWinner": "red" },
  "overallMatchSummary": "Truthful 2-3 sentence overview of what actually happened visually.",
  "events": [
    {
      "id": "ev-1",
      "timestamp": 24,
      "period": 1,
      "wrestler": "red",
      "type": "takedown",
      "moveName": "Single Leg to Double Leg Finish (+3)",
      "points": { "red": 3, "green": 0 },
      "runningScore": { "red": 3, "green": 0 },
      "description": "Visual breakdown of move seen in video",
      "critique": {
        "positiveCues": ["Good penetration step"],
        "flawsDetected": ["Opponent did not match head position"],
        "biomechanicalNote": "Keep head inside to nullify whizzer"
      }
    }
  ],
  "wrestlers": {
    "red": {
      "wrestler": "red",
      "name": "Red Wrestler",
      "overallRating": 85,
      "summary": "Technical overview based on video",
      "stanceAndPositioning": {
        "score": 85,
        "headPosition": "Visual evaluation",
        "levelChange": "Visual evaluation",
        "footworkPace": "Visual evaluation",
        "strengths": ["Real strength"],
        "weaknesses": ["Real weakness"]
      },
      "neutralOffense": {
        "score": 85,
        "shotsAttempted": 2,
        "shotsScored": 1,
        "primaryAttacks": ["Attacks seen"],
        "shotMechanicsFeedback": "Real feedback on mechanics",
        "finishEfficiency": "50%"
      },
      "neutralDefense": {
        "score": 85,
        "takedownDefensePercent": 80,
        "sprawlReactionTime": "Observed reaction",
        "frontHeadlockRecovery": "Observed recovery",
        "vulnerabilities": ["Observed flaw"]
      },
      "topRidingTurns": {
        "score": 80,
        "ridingTimeSeconds": 60,
        "breakdownEffectiveness": "Breakdown quality",
        "turnAttempts": ["Turns seen"],
        "turnSuccessRate": "Success rate"
      },
      "bottomEscapesReversals": {
        "score": 85,
        "escapeTimeAverage": "12s",
        "firstStepExplosion": "Whistle speed",
        "handFightingUnderPressure": "Wrist control",
        "escapesScored": 1,
        "reversalsScored": 0
      },
      "keyTakeaways": ["Coaching takeaway 1", "Coaching takeaway 2"],
      "drills": [
        {
          "id": "drill-r1",
          "name": "Drill Name",
          "targetSkill": "Skill",
          "targetedMistake": "Flaw to fix",
          "description": "How to execute drill",
          "recommendedSets": "3 sets x 5 reps",
          "keyCoachingPoint": "Coaching cue"
        }
      ]
    },
    "green": {
      "wrestler": "green",
      "name": "Green/Opponent Wrestler",
      "overallRating": 80,
      "summary": "Technical overview based on video",
      "stanceAndPositioning": {
        "score": 80,
        "headPosition": "Visual evaluation",
        "levelChange": "Visual evaluation",
        "footworkPace": "Visual evaluation",
        "strengths": ["Real strength"],
        "weaknesses": ["Real weakness"]
      },
      "neutralOffense": {
        "score": 80,
        "shotsAttempted": 1,
        "shotsScored": 0,
        "primaryAttacks": ["Attacks seen"],
        "shotMechanicsFeedback": "Real feedback",
        "finishEfficiency": "0%"
      },
      "neutralDefense": {
        "score": 75,
        "takedownDefensePercent": 50,
        "sprawlReactionTime": "Reaction",
        "frontHeadlockRecovery": "Recovery",
        "vulnerabilities": ["Observed flaw"]
      },
      "topRidingTurns": {
        "score": 70,
        "ridingTimeSeconds": 10,
        "breakdownEffectiveness": "Breakdown quality",
        "turnAttempts": [],
        "turnSuccessRate": "0%"
      },
      "bottomEscapesReversals": {
        "score": 80,
        "escapeTimeAverage": "18s",
        "firstStepExplosion": "Whistle speed",
        "handFightingUnderPressure": "Wrist control",
        "escapesScored": 0,
        "reversalsScored": 0
      },
      "keyTakeaways": ["Coaching takeaway 1"],
      "drills": [
        {
          "id": "drill-g1",
          "name": "Drill Name",
          "targetSkill": "Skill",
          "targetedMistake": "Flaw to fix",
          "description": "How to execute drill",
          "recommendedSets": "3 sets x 5 reps",
          "keyCoachingPoint": "Coaching cue"
        }
      ]
    }
  }
}
  `;
}
