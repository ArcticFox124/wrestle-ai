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
      provider = 'local', // 'local' | 'gemini' | 'openai' | 'claude'
      apiKey,
      matchNotes,
      durationSeconds = 420,
    } = body;

    // STEP 1: Verify YouTube video authenticity & content if YouTube source
    let verifiedVideoTitle = '';
    if (sourceType === 'youtube' && videoUrl) {
      try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
          videoUrl
        )}&format=json`;
        const oembedRes = await fetch(oembedUrl);

        if (!oembedRes.ok) {
          return NextResponse.json({
            success: true,
            data: {
              id: `rejected-${Date.now()}`,
              title: 'Inaccessible YouTube Video',
              sourceType: 'youtube',
              videoUrl,
              analyzedTarget: targetWrestler,
              dateAnalyzed: new Date().toISOString().split('T')[0],
              durationSeconds: 0,
              cannotAnalyze: true,
              rejectionReason:
                'I cannot analyze this video: The YouTube video could not be loaded. It is either private, age-restricted, deleted, or blocks automated embedding.',
              finalScore: { red: 0, green: 0, winner: 'tie' },
              ridingTime: { redSeconds: 0, greenSeconds: 0 },
              overallMatchSummary: 'Video stream inaccessible.',
              events: [],
              wrestlers: createEmptyWrestlers(),
            },
          });
        }

        const oembedData = await oembedRes.json();
        verifiedVideoTitle = oembedData.title || '';

        // Check if the title has any wrestling / combat sports keywords
        const lowerTitle = verifiedVideoTitle.toLowerCase();
        const wrestlingKeywords = [
          'wrestl', 'folkstyle', 'ncaa', 'singlet', 'takedown', 'bout', 'mat',
          'finals', 'state', 'championship', 'grappl', 'pin', 'dual', 'cradle',
          'weight', 'lbs', 'vs', 'round', 'meet', 'division', 'semifinal'
        ];

        const hasKeyword = wrestlingKeywords.some((kw) => lowerTitle.includes(kw));

        // If clearly not wrestling (e.g. music video, gaming, cooking)
        if (!hasKeyword && matchNotes?.toLowerCase().indexOf('wrestling') === -1) {
          return NextResponse.json({
            success: true,
            data: {
              id: `rejected-${Date.now()}`,
              title: verifiedVideoTitle,
              sourceType: 'youtube',
              videoUrl,
              analyzedTarget: targetWrestler,
              dateAnalyzed: new Date().toISOString().split('T')[0],
              durationSeconds: 0,
              cannotAnalyze: true,
              rejectionReason: `I cannot analyze this video: It does not appear to be a wrestling match. Video title: "${verifiedVideoTitle}". Please provide a wrestling bout.`,
              finalScore: { red: 0, green: 0, winner: 'tie' },
              ridingTime: { redSeconds: 0, greenSeconds: 0 },
              overallMatchSummary: `Rejected: Detected "${verifiedVideoTitle}" which does not contain Folkstyle wrestling keywords.`,
              events: [],
              wrestlers: createEmptyWrestlers(),
            },
          });
        }
      } catch (err) {
        // oembed network warning - proceed with caution
      }
    }

    // STEP 2: Demo Mode
    if (sourceType === 'demo' && !videoUrl) {
      return NextResponse.json({
        success: true,
        data: DEMO_MATCH_NCAA,
        source: 'demo',
      });
    }

    // STEP 3: Local Engine (Zero Key Mode)
    // Honest: Does not invent fake events when it cannot inspect raw pixels
    if (provider === 'local' || !apiKey) {
      const localResult = analyzeMatchLocally({
        sourceType,
        videoUrl,
        durationSeconds,
        targetWrestler,
        matchNotes,
        frames,
        videoTitle: verifiedVideoTitle,
      });

      return NextResponse.json({
        success: true,
        data: localResult,
        source: 'local-engine',
      });
    }

    const effectiveApiKey = apiKey.trim();

    // STEP 4: Cloud Multimodal Analysis (OpenAI, Claude, Gemini, OpenRouter, Grok)
    // Explicit anti-pretending instructions: Tell the model to REJECT if it cannot see real action!
    const promptText = getPrompt(targetWrestler, matchNotes, sourceType, videoUrl, verifiedVideoTitle);

    // 4A: OpenAI GPT-4o
    if (provider === 'openai') {
      const contentParts: any[] = [{ type: 'text', text: promptText }];
      if (frames && frames.length > 0) {
        frames.slice(0, 16).forEach((f: any) => {
          contentParts.push({
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${f.data}` },
          });
        });
      }

      const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: contentParts }],
          response_format: { type: 'json_object' },
          temperature: 0.05,
        }),
      });

      if (!openAiRes.ok) {
        const err = await openAiRes.text();
        return NextResponse.json({ error: `OpenAI Error: ${err}` }, { status: openAiRes.status });
      }

      const openAiData = await openAiRes.json();
      const rawJson = openAiData.choices?.[0]?.message?.content;
      return NextResponse.json({
        success: true,
        data: JSON.parse(rawJson),
        source: 'openai',
      });
    }

    // 4B: OpenRouter (Supports all open/free/paid vision models with one key)
    if (provider === 'openrouter') {
      const contentParts: any[] = [{ type: 'text', text: promptText }];
      if (frames && frames.length > 0) {
        frames.slice(0, 16).forEach((f: any) => {
          contentParts.push({
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${f.data}` },
          });
        });
      }

      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveApiKey}`,
          'HTTP-Referer': 'https://wrestle-ai.vercel.app',
          'X-Title': 'MatVision AI',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-exp:free', // top fast free vision model, or falls back gracefully
          messages: [{ role: 'user', content: contentParts }],
          response_format: { type: 'json_object' },
          temperature: 0.05,
        }),
      });

      if (!openRouterRes.ok) {
        const err = await openRouterRes.text();
        return NextResponse.json({ error: `OpenRouter Error: ${err}` }, { status: openRouterRes.status });
      }

      const openRouterData = await openRouterRes.json();
      const rawJson = openRouterData.choices?.[0]?.message?.content;
      const cleanJson = cleanMarkdownJson(rawJson);
      return NextResponse.json({
        success: true,
        data: JSON.parse(cleanJson),
        source: 'openrouter',
      });
    }

    // 4C: xAI Grok (Grok 2 Vision)
    if (provider === 'grok') {
      const contentParts: any[] = [{ type: 'text', text: promptText }];
      if (frames && frames.length > 0) {
        frames.slice(0, 16).forEach((f: any) => {
          contentParts.push({
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${f.data}` },
          });
        });
      }

      const grokRes = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveApiKey}`,
        },
        body: JSON.stringify({
          model: 'grok-2-vision-1212',
          messages: [{ role: 'user', content: contentParts }],
          temperature: 0.05,
        }),
      });

      if (!grokRes.ok) {
        const err = await grokRes.text();
        return NextResponse.json({ error: `Grok API Error: ${err}` }, { status: grokRes.status });
      }

      const grokData = await grokRes.json();
      const rawJson = grokData.choices?.[0]?.message?.content;
      const cleanJson = cleanMarkdownJson(rawJson);
      return NextResponse.json({
        success: true,
        data: JSON.parse(cleanJson),
        source: 'grok',
      });
    }

    // 4B: Anthropic Claude
    if (provider === 'claude') {
      const claudeContent: any[] = [];
      if (frames && frames.length > 0) {
        frames.slice(0, 16).forEach((f: any) => {
          claudeContent.push({
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: f.data },
          });
        });
      }
      claudeContent.push({
        type: 'text',
        text: `${promptText}\n\nIMPORTANT: Return ONLY raw JSON object.`,
      });

      const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': effectiveApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 3500,
          temperature: 0.05,
          messages: [{ role: 'user', content: claudeContent }],
        }),
      });

      if (!claudeRes.ok) {
        const err = await claudeRes.text();
        return NextResponse.json({ error: `Claude Error: ${err}` }, { status: claudeRes.status });
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

    // 4C: Google Gemini
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveApiKey}`;
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
        generationConfig: { responseMimeType: 'application/json', temperature: 0.05 },
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
      { error: error.message || 'Failed to process match.' },
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

function createEmptyWrestlers() {
  return {
    red: {
      wrestler: 'red' as const,
      name: 'Red Wrestler',
      overallRating: 0,
      summary: 'No data',
      stanceAndPositioning: { score: 0, headPosition: 'N/A', levelChange: 'N/A', footworkPace: 'N/A', strengths: [], weaknesses: [] },
      neutralOffense: { score: 0, shotsAttempted: 0, shotsScored: 0, primaryAttacks: [], shotMechanicsFeedback: 'N/A', finishEfficiency: '0%' },
      neutralDefense: { score: 0, takedownDefensePercent: 0, sprawlReactionTime: 'N/A', frontHeadlockRecovery: 'N/A', vulnerabilities: [] },
      topRidingTurns: { score: 0, ridingTimeSeconds: 0, breakdownEffectiveness: 'N/A', turnAttempts: [], turnSuccessRate: '0%' },
      bottomEscapesReversals: { score: 0, escapeTimeAverage: 'N/A', firstStepExplosion: 'N/A', handFightingUnderPressure: 'N/A', escapesScored: 0, reversalsScored: 0 },
      keyTakeaways: [],
      drills: []
    },
    green: {
      wrestler: 'green' as const,
      name: 'Green/Opponent Wrestler',
      overallRating: 0,
      summary: 'No data',
      stanceAndPositioning: { score: 0, headPosition: 'N/A', levelChange: 'N/A', footworkPace: 'N/A', strengths: [], weaknesses: [] },
      neutralOffense: { score: 0, shotsAttempted: 0, shotsScored: 0, primaryAttacks: [], shotMechanicsFeedback: 'N/A', finishEfficiency: '0%' },
      neutralDefense: { score: 0, takedownDefensePercent: 0, sprawlReactionTime: 'N/A', frontHeadlockRecovery: 'N/A', vulnerabilities: [] },
      topRidingTurns: { score: 0, ridingTimeSeconds: 0, breakdownEffectiveness: 'N/A', turnAttempts: [], turnSuccessRate: '0%' },
      bottomEscapesReversals: { score: 0, escapeTimeAverage: 'N/A', firstStepExplosion: 'N/A', handFightingUnderPressure: 'N/A', escapesScored: 0, reversalsScored: 0 },
      keyTakeaways: [],
      drills: []
    }
  };
}

function getPrompt(
  targetWrestler: string,
  matchNotes: string,
  sourceType: string,
  videoUrl?: string,
  videoTitle?: string
): string {
  return `
CRITICAL INSTRUCTION - HONESTY & ZERO HALLUCINATION POLICY:
You are an Olympic and NCAA Division I Folkstyle Wrestling Coach and Head Video Analyst.
You are inspecting the real video frames of this submission.

DO NOT PRETEND OR FABRICATE RESULTS.
If the video does NOT show a clear Folkstyle wrestling match (e.g. it is a music video, vlog, gaming clip, or the camera is too far / obstructed / blurry to see moves):
YOU MUST SET "cannotAnalyze": true AND EXPLAIN HONESTLY IN "rejectionReason" WHY THIS VIDEO CANNOT BE ANALYZED.

Title of video: "${videoTitle || 'Wrestling Match'}"
Target focus: ${targetWrestler === 'both' ? 'Both wrestlers (Head-to-Head)' : `${targetWrestler.toUpperCase()} wrestler`}
User Notes: ${matchNotes || 'None'}

If this IS a visible Folkstyle wrestling match:
- Only report moves you visually observe.
- Takedowns (+3 pts NCAA / +2 pts HS) require control behind the hips or breaking opponent down.
- Escapes (+1 pt) require breaking all contact and facing opponent.
- Reversals (+2 pts) require bottom wrestler coming directly out and getting top control.
- If there are zero takedowns in a period, report zero takedowns.

Output MUST be a single raw JSON object matching this schema strictly:
{
  "id": "match-${Date.now()}",
  "title": "${videoTitle || 'Folkstyle Match Analysis'}",
  "sourceType": "${sourceType}",
  "videoUrl": "${videoUrl || ''}",
  "analyzedTarget": "${targetWrestler}",
  "dateAnalyzed": "${new Date().toISOString().split('T')[0]}",
  "durationSeconds": 420,
  "cannotAnalyze": false,
  "rejectionReason": "",
  "finalScore": { "red": 0, "green": 0, "winner": "red" },
  "ridingTime": { "redSeconds": 0, "greenSeconds": 0, "ridingTimeAdvantageWinner": "red" },
  "overallMatchSummary": "Truthful summary of what actually happened.",
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
      "summary": "Technical overview",
      "stanceAndPositioning": { "score": 85, "headPosition": "eval", "levelChange": "eval", "footworkPace": "eval", "strengths": ["s1"], "weaknesses": ["w1"] },
      "neutralOffense": { "score": 85, "shotsAttempted": 2, "shotsScored": 1, "primaryAttacks": ["Single"], "shotMechanicsFeedback": "feedback", "finishEfficiency": "50%" },
      "neutralDefense": { "score": 85, "takedownDefensePercent": 80, "sprawlReactionTime": "fast", "frontHeadlockRecovery": "good", "vulnerabilities": ["v1"] },
      "topRidingTurns": { "score": 80, "ridingTimeSeconds": 60, "breakdownEffectiveness": "good", "turnAttempts": [], "turnSuccessRate": "0%" },
      "bottomEscapesReversals": { "score": 85, "escapeTimeAverage": "12s", "firstStepExplosion": "good", "handFightingUnderPressure": "good", "escapesScored": 1, "reversalsScored": 0 },
      "keyTakeaways": ["t1"],
      "drills": [{ "id": "d1", "name": "Drill", "targetSkill": "Skill", "targetedMistake": "Flaw", "description": "Desc", "recommendedSets": "3x5", "keyCoachingPoint": "Cue" }]
    },
    "green": {
      "wrestler": "green",
      "name": "Green Wrestler",
      "overallRating": 80,
      "summary": "Technical overview",
      "stanceAndPositioning": { "score": 80, "headPosition": "eval", "levelChange": "eval", "footworkPace": "eval", "strengths": ["s1"], "weaknesses": ["w1"] },
      "neutralOffense": { "score": 80, "shotsAttempted": 1, "shotsScored": 0, "primaryAttacks": [], "shotMechanicsFeedback": "feedback", "finishEfficiency": "0%" },
      "neutralDefense": { "score": 75, "takedownDefensePercent": 50, "sprawlReactionTime": "avg", "frontHeadlockRecovery": "avg", "vulnerabilities": ["v1"] },
      "topRidingTurns": { "score": 70, "ridingTimeSeconds": 10, "breakdownEffectiveness": "loose", "turnAttempts": [], "turnSuccessRate": "0%" },
      "bottomEscapesReversals": { "score": 80, "escapeTimeAverage": "18s", "firstStepExplosion": "avg", "handFightingUnderPressure": "fair", "escapesScored": 0, "reversalsScored": 0 },
      "keyTakeaways": ["t1"],
      "drills": [{ "id": "dg1", "name": "Drill", "targetSkill": "Skill", "targetedMistake": "Flaw", "description": "Desc", "recommendedSets": "3x5", "keyCoachingPoint": "Cue" }]
    }
  }
}
`;
}
