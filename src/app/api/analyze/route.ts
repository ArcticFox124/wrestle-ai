import { NextRequest, NextResponse } from 'next/server';
import { MatchAnalysisResult, TargetWrestler } from '@/types/wrestling';
import { DEMO_MATCH_NCAA } from '@/lib/demoData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sourceType,
      videoUrl,
      frames, // Array of { timestamp: number, data: string } from uploaded video
      targetWrestler = 'both',
      apiKey,
      matchNotes,
    } = body;

    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

    // If demo mode or no API key, return verified NCAA championship demo match
    if (sourceType === 'demo' || (!effectiveApiKey && !videoUrl && !frames?.length)) {
      return NextResponse.json({
        success: true,
        data: DEMO_MATCH_NCAA,
        source: 'demo',
      });
    }

    if (!effectiveApiKey) {
      return NextResponse.json(
        {
          error:
            'A Gemini API Key is required to run live AI video analysis. Enter your free Google Gemini API key in the app settings, or explore our pre-analyzed Folkstyle matches.',
          code: 'MISSING_API_KEY',
        },
        { status: 400 }
      );
    }

    // Build the strict Anti-Hallucination Folkstyle Prompt
    const strictPrompt = `
CRITICAL INSTRUCTION - ZERO HALLUCINATION POLICY:
You are an Olympic and NCAA Division I Folkstyle Wrestling Coach and Head Video Analyst.
You are watching and analyzing the ACTUAL visual video frames of the provided match.

DO NOT INVENT, GUESS, OR ASSUME MOVES.
If a period is scoreless or consists of hand-fighting without a takedown, report ONLY what you actually see.
If the video does not show a wrestling match (e.g. music video, vlog, game), DO NOT make up wrestling events. State clearly in "overallMatchSummary" what the video actually depicts.

STEP 1: VISUAL EVIDENCE
- Visually identify the wrestlers by their singlets or ankle bands (e.g., Red Singlet / Red Ankle Band vs Blue/Green/Black Singlet).
- If names are visible on screen or on the broadcast scoreboard, use their actual names. Otherwise, name them "Red Wrestler" and "Green/Opponent Wrestler".
- Target analysis focus: ${
      targetWrestler === 'both'
        ? 'Both wrestlers (Head-to-Head)'
        : `${targetWrestler.toUpperCase()} wrestler`
    }.
- Extra context from user: ${matchNotes || 'None'}

STEP 2: STRICT FOLKSTYLE SCORING RULES
- TAKEDOWN (+3 pts in modern NCAA, +2 pts in HS): Clear control established from neutral to the mat, behind opponent hips or breaking down base.
- ESCAPE (+1 pt): Defensive wrestler breaks all contact and faces opponent.
- REVERSAL (+2 pts): Bottom wrestler comes directly out and takes top control.
- NEAR FALL (+2, +3, +4 pts): Wrestler held past 45-degree angle near the mat (2-4 count, or 5 count for 4 pts).
- RIDING TIME: Count total seconds of top control.
- Citing exact video timestamps: Every event MUST have an exact timestamp (in seconds from start of video) corresponding to when the move happened in the video footage.

Output MUST be a single raw JSON object strictly adhering to this schema with NO markdown code-blocks:
{
  "id": "match-${Date.now()}",
  "title": "Folkstyle Match Analysis",
  "sourceType": "${sourceType}",
  "videoUrl": "${videoUrl || ''}",
  "analyzedTarget": "${targetWrestler}",
  "dateAnalyzed": "${new Date().toISOString().split('T')[0]}",
  "durationSeconds": 420,
  "finalScore": {
    "red": 0,
    "green": 0,
    "winner": "red"
  },
  "ridingTime": {
    "redSeconds": 0,
    "greenSeconds": 0,
    "ridingTimeAdvantageWinner": "red"
  },
  "overallMatchSummary": "Truthful 2-3 sentence overview of what actually happened visually in this match.",
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
        "positiveCues": ["Good penetration step", "Hips drove through"],
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

    // Construct parts array for Gemini Multimodal input
    const parts: any[] = [];

    if (sourceType === 'youtube' && videoUrl) {
      // Pass the public YouTube URL directly into Gemini's video understanding fileData
      parts.push({
        fileData: {
          mimeType: 'video/mp4',
          fileUri: videoUrl,
        },
      });
    } else if (frames && Array.isArray(frames) && frames.length > 0) {
      // Pass the actual visual frames extracted from the user's uploaded video
      // Limit to 24 frames maximum to stay within comfortable payload limits
      const sampled = frames.slice(0, 24);
      for (const frame of sampled) {
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: frame.data,
          },
        });
      }
    }

    // Append the prompt instructions
    parts.push({
      text: strictPrompt,
    });

    // Call Gemini API (using gemini-1.5-flash with video understanding)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveApiKey}`;

    const requestPayload = {
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1, // Low temperature for high factual accuracy and zero hallucination
      },
    };

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API Error:', errText);

      // Helpful error messages if YouTube streaming is blocked or restricted
      if (errText.includes('PERMISSION_DENIED') || errText.includes('API_KEY_INVALID')) {
        return NextResponse.json(
          { error: 'Invalid Google Gemini API Key. Please verify your key at https://aistudio.google.com/app/apikey.' },
          { status: 401 }
        );
      }

      if (sourceType === 'youtube' && (errText.includes('fileUri') || errText.includes('video'))) {
        return NextResponse.json(
          {
            error:
              'Gemini could not stream this specific YouTube video (it may be age-restricted, geoblocked, or private). You can download the match and upload the video file directly for 100% accurate frame analysis!',
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        { error: `Gemini API returned status ${geminiRes.status}: ${errText}` },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Gemini did not return an analysis response.');
    }

    // Clean JSON response (strip markdown wrappers if present)
    let cleanedText = candidateText.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    const parsedData: MatchAnalysisResult = JSON.parse(cleanedText);

    return NextResponse.json({
      success: true,
      data: parsedData,
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
