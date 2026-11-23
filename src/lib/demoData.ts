import { MatchAnalysisResult } from '../types/wrestling';

export const DEMO_MATCH_NCAA: MatchAnalysisResult = {
  id: 'demo-ncaa-165-finals',
  title: 'NCAA Division I Finals - 165 lbs (Folkstyle Championship)',
  sourceType: 'demo',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder or standard preview
  analyzedTarget: 'both',
  weightClass: '165 lbs',
  dateAnalyzed: '2026-11-22',
  durationSeconds: 420, // 7 min regulation
  finalScore: {
    red: 8,
    green: 4,
    winner: 'red',
  },
  ridingTime: {
    redSeconds: 142,
    greenSeconds: 28,
    ridingTimeAdvantageWinner: 'red',
  },
  overallMatchSummary: 
    'High-paced collegiate Folkstyle bout dominated by Red’s superior hand-fighting and re-attack timing. Red capitalized on Green’s square stance in Period 1 for a 3-point takedown, maintained strong spiral ride breakdowns in Period 2, and sealed the victory with a counter-attack scramble in Period 3.',
  events: [
    {
      id: 'ev-1',
      timestamp: 24,
      period: 1,
      wrestler: 'red',
      type: 'shot_attempt',
      moveName: 'Collar Tie Snap to Low Single',
      points: { red: 0, green: 0 },
      runningScore: { red: 0, green: 0 },
      description: 'Red snaps Green down vigorously, changes levels, and attacks Green’s right ankle. Green sprawls hard.',
      critique: {
        positiveCues: ['Explosive level change', 'Heavy snap down created space'],
        flawsDetected: ['Head dropped to outside of hip, allowing Green to whizzer and square up'],
        biomechanicalNote: 'Keep forehead glued to inner thigh to prevent the defensive whizzer shelf.'
      }
    },
    {
      id: 'ev-2',
      timestamp: 48,
      period: 1,
      wrestler: 'red',
      type: 'takedown',
      moveName: 'High Crotch to Double Leg Finish (+3)',
      points: { red: 3, green: 0 },
      runningScore: { red: 3, green: 0 },
      description: 'Red posts Green’s left shoulder, shoots deep high crotch, turns the corner smoothly, and runs through the double leg for 3 points.',
      critique: {
        positiveCues: ['Corner turn was instant (no stalling on knees)', 'Hips stayed underneath shoulders'],
        flawsDetected: ['Green failed to match head position, reaching with both hands instead of posting'],
        biomechanicalNote: 'Textbook corner turn: drove off the outside foot while keeping chest inflated.'
      }
    },
    {
      id: 'ev-3',
      timestamp: 75,
      period: 1,
      wrestler: 'green',
      type: 'escape',
      moveName: 'Inside Standup with Wrist Peel (+1)',
      points: { red: 0, green: 1 },
      runningScore: { red: 3, green: 1 },
      description: 'Green responds on the restart: explodes with inside leg up, controls Red’s two hands on one wrist, cuts out for 1 point.',
      critique: {
        positiveCues: ['Immediate whistle reaction', 'Strong two-on-one wrist peel before turning in'],
        flawsDetected: ['Red was late clamping the tight waist; let Green’s hips separate'],
        biomechanicalNote: 'Hips cleared out first before cutting the angle back toward the center of the mat.'
      }
    },
    {
      id: 'ev-4',
      timestamp: 135,
      period: 2,
      wrestler: 'red',
      type: 'escape',
      moveName: 'Changeover Sit-out to Standup (+1)',
      points: { red: 1, green: 0 },
      runningScore: { red: 4, green: 1 },
      description: 'Red starts bottom, fakes standup, sits out and rotates back to feet, turning to face for 1 point.',
      critique: {
        positiveCues: ['High elbow back pressure created space', 'Did not stop moving until separation'],
        flawsDetected: ['Briefly exposed back during turn-in; a quicker top wrestler could cradle here'],
        biomechanicalNote: 'Kept head up while rotating; avoided collapsing onto the stomach.'
      }
    },
    {
      id: 'ev-5',
      timestamp: 168,
      period: 2,
      wrestler: 'green',
      type: 'takedown',
      moveName: 'Sweep Single Leg (+3)',
      points: { red: 0, green: 3 },
      runningScore: { red: 4, green: 4 },
      description: 'Green fakes an underhook, circles left, sweeps to Red’s lead leg, elevates to the shelf, and trips the rear ankle for 3 points.',
      critique: {
        positiveCues: ['Patient setup with circling motion', 'Clean shelf elevation onto thigh'],
        flawsDetected: ['Red reached forward without sprawling back hips; chest over toes'],
        biomechanicalNote: 'Green maintained head in chest posture during the shelf trip finish.'
      }
    },
    {
      id: 'ev-6',
      timestamp: 210,
      period: 2,
      wrestler: 'red',
      type: 'reversal',
      moveName: 'Granby Roll Reversal (+2)',
      points: { red: 2, green: 0 },
      runningScore: { red: 6, green: 4 },
      description: 'Green rides tight waist. Red hits an inside shoulder roll (Granby roll), catches Green out of position, and comes out on top for 2 points.',
      critique: {
        positiveCues: ['Tucked head tight to chest', 'Rotated across shoulders, not neck', 'Caught Green riding too high'],
        flawsDetected: ['Green rode too far forward past Red’s hips with hips too loose'],
        biomechanicalNote: 'Momentum transfer from shoulder roll allowed clean top positioning.'
      }
    },
    {
      id: 'ev-7',
      timestamp: 330,
      period: 3,
      wrestler: 'neutral',
      type: 'scramble',
      moveName: 'Ankle Scramble / Stalemate',
      points: { red: 0, green: 0 },
      runningScore: { red: 6, green: 4 },
      description: 'Scramble ensued as Green attacked low single; both wrestlers locked ankles in 50/50 position. Referee called stalemate.',
      critique: {
        positiveCues: ['Both maintained strong hip elevation in the scramble'],
        flawsDetected: ['Green had chance to kick out ankle earlier instead of waiting for stalemate'],
        biomechanicalNote: 'Red locked legs defensively to neutralize Green’s elevation.'
      }
    },
    {
      id: 'ev-8',
      timestamp: 388,
      period: 3,
      wrestler: 'red',
      type: 'counter_attack',
      moveName: 'Sprawl Go-Behind Counter (+2)',
      points: { red: 2, green: 0 },
      runningScore: { red: 8, green: 4 },
      description: 'Green launched desperate double leg with 15 seconds remaining. Red sprawled violently, stuffed the head, spun around for 2 points.',
      critique: {
        positiveCues: ['Heavy hips straight into Green’s upper back', 'Stuffed head down directly between knees'],
        flawsDetected: ['Green shot from too far out without an off-balance setup'],
        biomechanicalNote: 'Hips went back 4 feet instantly; total neutralization of shot momentum.'
      }
    }
  ],
  wrestlers: {
    red: {
      wrestler: 'red',
      name: 'Carter Vance (Red)',
      overallRating: 89,
      summary: 'Aggressive, technically disciplined Folkstyle wrestler with exceptional re-attack instincts, heavy hand-fighting, and punishing top control.',
      stanceAndPositioning: {
        score: 91,
        headPosition: 'Disciplined inside forehead contact, consistently lower than opponent.',
        levelChange: 'Explosive, drops hips without bending over at the waist.',
        footworkPace: 'Continuous circular motion, cuts off the edge of the mat effectively.',
        strengths: ['Great head-hands defense', 'Low center of gravity', 'Never stays in a square stance'],
        weaknesses: ['Occasionally reaches too early with lead hand when tired in Period 3']
      },
      neutralOffense: {
        score: 87,
        shotsAttempted: 5,
        shotsScored: 3,
        primaryAttacks: ['High Crotch', 'Collar Snap to Low Single', 'Go-Behind Counter'],
        shotMechanicsFeedback: 'Crisp corner turns on high crotch; needs to avoid dropping head to the outside on low single finishes.',
        finishEfficiency: '60% conversion rate on neutral attacks.'
      },
      neutralDefense: {
        score: 93,
        takedownDefensePercent: 80,
        sprawlReactionTime: '0.28 seconds (Elite collegiate pace)',
        frontHeadlockRecovery: 'High pressure spin-around go-behinds',
        vulnerabilities: ['Vulnerable to fast sweep singles when over-committing to collar ties']
      },
      topRidingTurns: {
        score: 88,
        ridingTimeSeconds: 142,
        breakdownEffectiveness: 'Heavy spiral ride with claw hook broke opponent to belly twice.',
        turnAttempts: ['Near-side Cradle', 'Cross-face Tilt'],
        turnSuccessRate: 'Controlled opponent for over 2 minutes; 1 near-fall attempt.'
      },
      bottomEscapesReversals: {
        score: 86,
        escapeTimeAverage: '12 seconds',
        firstStepExplosion: 'Good inside knee jump on whistle',
        handFightingUnderPressure: 'Relentless wrist peel, utilized dynamic Granby roll reversal.',
        escapesScored: 1,
        reversalsScored: 1
      },
      keyTakeaways: [
        'Protect lead leg from sweep singles when engaging collar tie.',
        'When shooting low single, keep head inside to nullify whizzers.',
        'Riding time dominance (+2:22) proved decisive in pace control.'
      ],
      drills: [
        {
          id: 'drill-r1',
          name: 'Collar Tie Re-Attack & Corner Turn',
          targetSkill: 'High Crotch Finishes',
          targetedMistake: 'Stopping on knees during shot transition',
          description: 'Partner offers collar tie resistance. Athlete snaps, levels changes, blasts high crotch, turns the corner without knee pause, finishes double.',
          recommendedSets: '4 sets x 8 reps per side',
          keyCoachingPoint: 'Keep eyes on the ceiling and drive off the trail foot to finish through the hips.'
        },
        {
          id: 'drill-r2',
          name: 'Sweep Single Defense & Whizzer Kick',
          targetSkill: 'Takedown Defense',
          targetedMistake: 'Conceding sweep singles on circular movement',
          description: 'Partner shoots sweep single. Defender instantly limp-legs or kicks through whizzer, squares hips, and executes front headlock go-behind.',
          recommendedSets: '3 sets x 3 minutes situational wrestling',
          keyCoachingPoint: 'Drive hard downward hip pressure before attempting to circle behind.'
        }
      ]
    },
    green: {
      wrestler: 'green',
      name: 'Tyler Jensen (Green)',
      overallRating: 81,
      summary: 'Dynamic and explosive attacker with dangerous sweep singles, but struggles with bottom riding time defense and rushed third-period shots.',
      stanceAndPositioning: {
        score: 80,
        headPosition: 'Frequently allows opponent to dictate inside head position.',
        levelChange: 'Good on attack initiation, but stands tall when fatigued.',
        footworkPace: 'Good linear bursts; needs better circular cutting.',
        strengths: ['Lightning fast sweep single shot', 'Good whistle explosion on bottom standup'],
        weaknesses: ['Stands tall when tired', 'Reaches with both hands when defending high crotches']
      },
      neutralOffense: {
        score: 83,
        shotsAttempted: 4,
        shotsScored: 1,
        primaryAttacks: ['Sweep Single Leg', 'Double Leg Attempt'],
        shotMechanicsFeedback: 'The period 2 sweep single was flawless with shelf elevation; third-period double leg was rushed without an angle.',
        finishEfficiency: '25% conversion rate on neutral attacks.'
      },
      neutralDefense: {
        score: 76,
        takedownDefensePercent: 40,
        sprawlReactionTime: '0.41 seconds (Needs improvement)',
        frontHeadlockRecovery: 'Tends to get stuck under opponent’s chest',
        vulnerabilities: ['Reaches instead of sprawling hips back', 'Susceptible to heavy snap-downs']
      },
      topRidingTurns: {
        score: 72,
        ridingTimeSeconds: 28,
        breakdownEffectiveness: 'Loose waist control allowed Red to hit Granby reversal.',
        turnAttempts: ['Far ankle breakdown'],
        turnSuccessRate: '0 turns scored; lost control to Granby roll.'
      },
      bottomEscapesReversals: {
        score: 84,
        escapeTimeAverage: '16 seconds',
        firstStepExplosion: 'Excellent standup speed in Period 1',
        handFightingUnderPressure: 'Fought hands well, but got broken down flat twice in Period 2.',
        escapesScored: 1,
        reversalsScored: 0
      },
      keyTakeaways: [
        'Must develop secondary defense: Sprawl hips first instead of reaching hands down.',
        'Tighten top ride: Keep chest on upper back and never ride too high over hips.',
        'Set up third-period attacks: Avoid shooting from outside without moving opponent’s feet.'
      ],
      drills: [
        {
          id: 'drill-g1',
          name: 'Short Offense & Sprawl Reaction Reaction Drills',
          targetSkill: 'Neutral Defense against High Crotch',
          targetedMistake: 'Reaching hands forward instead of kicking legs back',
          description: 'Partner initiates high crotch shot at varied cadences. Defender fires hips 4 feet back, plants hands on shoulders, circles away.',
          recommendedSets: '5 sets x 10 explosive reps',
          keyCoachingPoint: 'Do not drop hands below knees; your hips and head are your first line of defense.'
        },
        {
          id: 'drill-g2',
          name: 'Top Ride Anti-Granby Retention Drill',
          targetSkill: 'Top Mat Control',
          targetedMistake: 'Getting reversed by Granby rolls',
          description: 'Bottom wrestler attempts Granby rolls from referee’s position. Top wrestler focuses on staying back on hips, blocking the shoulder roll, and driving forward.',
          recommendedSets: '4 rounds x 2 minutes live bottom/top situational',
          keyCoachingPoint: 'Keep weight back on bottom wrestler’s thighs; do not climb up the spine.'
        }
      ]
    }
  }
};

export const DEMO_MATCH_HIGH_SCHOOL: MatchAnalysisResult = {
  id: 'demo-hs-144-states',
  title: 'State Championship Semi-Finals - 144 lbs (Folkstyle)',
  sourceType: 'demo',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  analyzedTarget: 'red',
  weightClass: '144 lbs',
  dateAnalyzed: '2026-11-22',
  durationSeconds: 360,
  finalScore: {
    red: 10,
    green: 2,
    winner: 'red',
  },
  ridingTime: {
    redSeconds: 195,
    greenSeconds: 15,
    ridingTimeAdvantageWinner: 'red',
  },
  overallMatchSummary: 
    'Dominant masterclass in top Folkstyle wrestling. Red executed two first-period takedowns (Fireman’s carry and Ankle pick) followed by a 3-point Near Fall using a textbook far-side cradle in Period 2.',
  events: [
    {
      id: 'hs-ev-1',
      timestamp: 18,
      period: 1,
      wrestler: 'red',
      type: 'takedown',
      moveName: 'Underhook to Fireman’s Carry (+3)',
      points: { red: 3, green: 0 },
      runningScore: { red: 3, green: 0 },
      description: 'Red digs a deep right underhook, pulls Green forward, drops to knees and dumps over the shoulder for 3 points.',
      critique: {
        positiveCues: ['Deep shoulder bite on underhook', 'Elevated hips through the dump'],
        flawsDetected: ['Could have transitioned directly into cradle pin combo'],
        biomechanicalNote: 'Explosive hip pivot under the center of mass.'
      }
    },
    {
      id: 'hs-ev-2',
      timestamp: 42,
      period: 1,
      wrestler: 'green',
      type: 'escape',
      moveName: 'Quadpod to Standup (+1)',
      points: { red: 0, green: 1 },
      runningScore: { red: 3, green: 1 },
      description: 'Green builds up to quadpod base, peels fingers, steps forward for 1 point.',
      critique: {
        positiveCues: ['Patient base rebuilding'],
        flawsDetected: ['Red failed to chop the far arm to break the quadpod'],
        biomechanicalNote: 'Legs walked wide to maintain stability under top pressure.'
      }
    },
    {
      id: 'hs-ev-3',
      timestamp: 78,
      period: 1,
      wrestler: 'red',
      type: 'takedown',
      moveName: 'Fake Snap to Low Ankle Pick (+3)',
      points: { red: 3, green: 0 },
      runningScore: { red: 6, green: 1 },
      description: 'Red snaps collar tie, Green steps forward with heavy left foot. Red snatches ankle and drives through chest.',
      critique: {
        positiveCues: ['Flawless timing on opponent’s forward step', 'Drove head into chest while securing heel'],
        flawsDetected: ['None - textbook execution'],
        biomechanicalNote: 'Perfect physics: stopped the heel, pushed the upper chest back.'
      }
    },
    {
      id: 'hs-ev-4',
      timestamp: 145,
      period: 2,
      wrestler: 'red',
      type: 'near_fall',
      moveName: 'Far-Side Cradle (3-Point Near Fall)',
      points: { red: 3, green: 0 },
      runningScore: { red: 9, green: 1 },
      description: 'From top referee’s position, Red locks far-side cradle around knee and neck, rolls Green to back, holds for 4 count.',
      critique: {
        positiveCues: ['Knee in the ribs to maintain leverage', 'Chest-to-chest compression'],
        flawsDetected: ['Could have scooped bottom leg for full fall'],
        biomechanicalNote: 'Locked wrists securely; squeezed knees together to prevent bridge.'
      }
    },
    {
      id: 'hs-ev-5',
      timestamp: 210,
      period: 3,
      wrestler: 'red',
      type: 'escape',
      moveName: 'Whistle Standup (+1)',
      points: { red: 1, green: 0 },
      runningScore: { red: 10, green: 1 },
      description: 'Red explodes instantly off referee’s whistle, clears hips, circles to center.',
      critique: {
        positiveCues: ['Reaction time under 0.2s', 'Elbows tight'],
        flawsDetected: ['None'],
        biomechanicalNote: 'Hips out immediately.'
      }
    }
  ],
  wrestlers: {
    red: {
      wrestler: 'red',
      name: 'Mason Cole (Red)',
      overallRating: 94,
      summary: 'High-level technician with devastating cradles and precise timing on neutral shots. Controlled pace from start to finish.',
      stanceAndPositioning: {
        score: 95,
        headPosition: 'Unbreakable forehead and chin positioning.',
        levelChange: 'Smooth, subtle, never telegraphs attacks.',
        footworkPace: 'Dominates mat center, circles effectively.',
        strengths: ['Unmatched underhook offense', 'Devastating top cradles', 'Elite whistle reaction'],
        weaknesses: ['Occasionally relaxes when holding a multi-point lead']
      },
      neutralOffense: {
        score: 92,
        shotsAttempted: 3,
        shotsScored: 2,
        primaryAttacks: ['Underhook Fireman’s Carry', 'Low Ankle Pick'],
        shotMechanicsFeedback: 'Patience and setup quality are college-ready.',
        finishEfficiency: '66% takedown rate.'
      },
      neutralDefense: {
        score: 96,
        takedownDefensePercent: 100,
        sprawlReactionTime: '0.24 seconds',
        frontHeadlockRecovery: 'Sprawls and captures wrist control immediately',
        vulnerabilities: ['None observed in this match']
      },
      topRidingTurns: {
        score: 95,
        ridingTimeSeconds: 195,
        breakdownEffectiveness: 'Tight waist and near wrist control kept opponent pinned down.',
        turnAttempts: ['Far-side Cradle', 'Cross-face Near Fall'],
        turnSuccessRate: 'Scored 3-point Near Fall.'
      },
      bottomEscapesReversals: {
        score: 91,
        escapeTimeAverage: '7 seconds',
        firstStepExplosion: 'Near instant on whistle',
        handFightingUnderPressure: 'Zero hesitation; stood up cleanly.',
        escapesScored: 1,
        reversalsScored: 0
      },
      keyTakeaways: [
        'Keep foot on the gas: When securing a cradle, scoop the near leg to lock in the pin.',
        'Quadpod breakdown: Remember to chop the far arm earlier on top.',
        'Outstanding technical discipline and pacing throughout.'
      ],
      drills: [
        {
          id: 'drill-m1',
          name: 'Far-Side Cradle Pin Finishing Sequences',
          targetSkill: 'Top Mat Pinning Combination',
          targetedMistake: 'Allowing bottom wrestler to bridge out of cradle before the fall',
          description: 'Lock cradle, dig knee into ribs, use top foot to hook bottom wrestler’s far leg, pulling heels to butt until referee slaps the mat.',
          recommendedSets: '4 sets x 5 pin finishes against live resisting partner',
          keyCoachingPoint: 'Drive your chin directly into partner’s ribcage for maximum pressure.'
        }
      ]
    },
    green: {
      wrestler: 'green',
      name: 'Lucas Diaz (Green)',
      overallRating: 75,
      summary: 'Tough, resilient wrestler who fights hard from quadpod base, but surrendered early takedowns to collar snap setups and got trapped in a cradle.',
      stanceAndPositioning: {
        score: 74,
        headPosition: 'Over-relies on collar tie without defending level change.',
        levelChange: 'Slow to react to low attacks.',
        footworkPace: 'Gets pulled forward easily.',
        strengths: ['Tough quadpod defense', 'Active scrambling'],
        weaknesses: ['Reaches into underhooks', 'Leaves head exposed to cradles']
      },
      neutralOffense: {
        score: 72,
        shotsAttempted: 1,
        shotsScored: 0,
        primaryAttacks: ['Double Leg'],
        shotMechanicsFeedback: 'Stuffed on lone shot attempt.',
        finishEfficiency: '0% conversion'
      },
      neutralDefense: {
        score: 70,
        takedownDefensePercent: 33,
        sprawlReactionTime: '0.45 seconds',
        frontHeadlockRecovery: 'Struggles with heavy hands',
        vulnerabilities: ['Susceptible to ankle picks when stepping forward']
      },
      topRidingTurns: {
        score: 68,
        ridingTimeSeconds: 15,
        breakdownEffectiveness: 'Unable to hold Red down.',
        turnAttempts: [],
        turnSuccessRate: '0%'
      },
      bottomEscapesReversals: {
        score: 76,
        escapeTimeAverage: '24 seconds',
        firstStepExplosion: 'Built up to quadpod well once',
        handFightingUnderPressure: 'Got locked into cradle on belly.',
        escapesScored: 1,
        reversalsScored: 0
      },
      keyTakeaways: [
        'Do not step forward with straight legs against collar tie fakes.',
        'When on bottom, keep head up off the mat to prevent far-side cradles.',
        'Build attacks with angle setups instead of pushing straight forward.'
      ],
      drills: [
        {
          id: 'drill-l1',
          name: 'Anti-Cradle Head Elevation & Hip Heist',
          targetSkill: 'Bottom Defense',
          targetedMistake: 'Tucking head down towards knees on bottom',
          description: 'Top wrestler attempts to lock hands around head and knee. Bottom wrestler actively pushes head up, fights hands, and kicks leg back.',
          recommendedSets: '5 rounds x 2 minutes positional sparring',
          keyCoachingPoint: 'If your head goes down, your back goes to the mat. Keep neck rigid.'
        }
      ]
    }
  }
};
