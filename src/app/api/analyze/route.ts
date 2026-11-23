import { NextRequest, NextResponse } from 'next/server';
import { MatchAnalysisResult, TargetWrestler } from '@/types/wrestling';
import { DEMO_MATCH_NCAA } from '@/lib/demoData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sourceType,
      videoUrl,
      targetWrestler = 'both',
      apiKey,
      matchNotes,
    } = body;

    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

    // If no API key is provided and it's demo or test, return demo data
    if (!effectiveApiKey) {
      if (sourceType === 'demo' || !videoUrl) {
        return NextResponse.json({
          success: true,
          data: DEMO_MATCH_NCAA,
          source: 'demo',
        });
      }
      return NextResponse.json(
        {
          error:
            'A Gemini API Key is required to run live AI video analysis. You can enter your free Google Gemini API key in the settings, or view our interactive pre-analyzed Folkstyle matches.',
          code: 'MISSING_API_KEY',
        },
        { status: 400 }
      );
    }

    // Call Gemini Multimodal API
    // Gemini 1.5 Flash / 2.0 Flash is state of the art for video understanding
    const prompt = `
You are an expert Olympic & NCAA Division 1 Folkstyle Wrestling Head Coach and Video Analyst.
Analyze this Folkstyle wrestling match for moves, points, technical flaws, and coaching recommendations.

Folkstyle Wrestling Rules:
- Takedown: 3 points (College NCAA) or 2 points (High School)
- Escape: 1 point
- Reversal: 2 points
- Near Fall: 2, 3, or 4 points
- Riding Time: Tracks control on top
- Target focus: ${targetWrestler === 'both' ? 'Both wrestlers (Red and Green)' : `${targetWrestler.toUpperCase()} wrestler`}
- Additional user match notes: ${matchNotes || 'None'}

Please return a valid JSON object matching this schema strictly without markdown wraps:
{
  "id": "match-${Date.now()}",
  "title": "Match Title",
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
  "overallMatchSummary": "2-3 sentences overview of match flow, pace, and decisive technical factor",
  "events": [
    {
      "id": "ev-1",
      "timestamp": 35,
      "period": 1,
      "wrestler": "red",
      "type": "takedown",
      "moveName": "Single Leg to Double Finish",
      "points": { "red": 3, "green": 0 },
      "runningScore": { "red": 3, "green": 0 },
      "description": "Red shoots high crotch, turns corner for takedown",
      "critique": {
        "positiveCues": ["Fast corner turn"],
        "flawsDetected": ["Green did not match head position"],
        "biomechanicalNote": "Hips stayed under shoulders"
      }
    }
  ],
  "wrestlers": {
    "red": {
      "wrestler": "red",
      "name": "Red Wrestler",
      "overallRating": 85,
      "summary": "Technical overview",
      "stanceAndPositioning": {
        "score": 85,
        "headPosition": "evaluation",
        "levelChange": "evaluation",
        "footworkPace": "evaluation",
        "strengths": ["string"],
        "weaknesses": ["string"]
      },
      "neutralOffense": {
        "score": 85,
        "shotsAttempted": 4,
        "shotsScored": 2,
        "primaryAttacks": ["Sweep Single"],
        "shotMechanicsFeedback": "feedback",
        "finishEfficiency": "50%"
      },
      "neutralDefense": {
        "score": 85,
        "takedownDefensePercent": 75,
        "sprawlReactionTime": "0.3s",
        "frontHeadlockRecovery": "good",
        "vulnerabilities": ["string"]
      },
      "topRidingTurns": {
        "score": 80,
        "ridingTimeSeconds": 90,
        "breakdownEffectiveness": "good",
        "turnAttempts": ["Cradle"],
        "turnSuccessRate": "50%"
      },
      "bottomEscapesReversals": {
        "score": 85,
        "escapeTimeAverage": "14s",
        "firstStepExplosion": "fast",
        "handFightingUnderPressure": "good",
        "escapesScored": 1,
        "reversalsScored": 0
      },
      "keyTakeaways": ["key advice 1", "key advice 2"],
      "drills": [
        {
          "id": "drill-1",
          "name": "Drill Name",
          "targetSkill": "Skill",
          "targetedMistake": "Flaw to fix",
          "description": "How to perform drill",
          "recommendedSets": "3 sets x 5 reps",
          "keyCoachingPoint": "Coaching cue"
        }
      ]
    },
    "green": {
      "wrestler": "green",
      "name": "Green Wrestler",
      "overallRating": 80,
      "summary": "Technical overview",
      "stanceAndPositioning": {
        "score": 80,
        "headPosition": "evaluation",
        "levelChange": "evaluation",
        "footworkPace": "evaluation",
        "strengths": ["string"],
        "weaknesses": ["string"]
      },
      "neutralOffense": {
        "score": 80,
        "shotsAttempted": 3,
        "shotsScored": 1,
        "primaryAttacks": ["Double Leg"],
        "shotMechanicsFeedback": "feedback",
        "finishEfficiency": "33%"
      },
      "neutralDefense": {
        "score": 75,
        "takedownDefensePercent": 50,
        "sprawlReactionTime": "0.4s",
        "frontHeadlockRecovery": "average",
        "vulnerabilities": ["string"]
      },
      "topRidingTurns": {
        "score": 75,
        "ridingTimeSeconds": 20,
        "breakdownEffectiveness": "loose waist",
        "turnAttempts": [],
        "turnSuccessRate": "0%"
      },
      "bottomEscapesReversals": {
        "score": 80,
        "escapeTimeAverage": "18s",
        "firstStepExplosion": "average",
        "handFightingUnderPressure": "fair",
        "escapesScored": 1,
        "reversalsScored": 0
      },
      "keyTakeaways": ["key advice 1", "key advice 2"],
      "drills": [
        {
          "id": "drill-g1",
          "name": "Drill Name",
          "targetSkill": "Skill",
          "targetedMistake": "Flaw to fix",
          "description": "How to perform drill",
          "recommendedSets": "3 sets x 5 reps",
          "keyCoachingPoint": "Coaching cue"
        }
      ]
    }
  }
}
`;

    // Make request to Gemini 1.5 Flash / 2.0 Flash
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveApiKey}`;
    
    const requestPayload = {
      contents: [
        {
          parts: [
            {
              text: `${prompt}\n\nMatch Video URL / Target Information: ${videoUrl || 'Direct Video'}`
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    };

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API Error:', errText);
      return NextResponse.json(
        { error: `Gemini API returned status ${geminiRes.status}: ${errText}` },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('No analysis text generated by Gemini.');
    }

    const parsedData: MatchAnalysisResult = JSON.parse(candidateText);

    return NextResponse.json({
      success: true,
      data: parsedData,
      source: 'gemini'
    });
  } catch (error: any) {
    console.error('Error analyzing match:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze match.' },
      { status: 500 }
    );
  }
}
