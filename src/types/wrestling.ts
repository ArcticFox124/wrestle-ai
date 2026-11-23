export type WrestlerColor = 'red' | 'green';
export type TargetWrestler = 'red' | 'green' | 'both';

export type FolkstyleEventType = 
  | 'takedown'
  | 'escape'
  | 'reversal'
  | 'near_fall'
  | 'stalling'
  | 'scramble'
  | 'shot_attempt'
  | 'counter_attack'
  | 'caution'
  | 'penalty';

export interface TechniqueCritique {
  positiveCues: string[];
  flawsDetected: string[];
  biomechanicalNote: string;
}

export interface MatchEvent {
  id: string;
  timestamp: number; // in seconds
  period: 1 | 2 | 3 | 'OT';
  wrestler: WrestlerColor | 'neutral';
  type: FolkstyleEventType;
  moveName: string;
  points: {
    red: number;
    green: number;
  };
  runningScore: {
    red: number;
    green: number;
  };
  description: string;
  critique?: TechniqueCritique;
}

export interface DrillRecommendation {
  id: string;
  name: string;
  targetSkill: string;
  targetedMistake: string;
  description: string;
  recommendedSets: string;
  keyCoachingPoint: string;
}

export interface WrestlerTechniqueBreakdown {
  wrestler: WrestlerColor;
  name: string;
  overallRating: number; // 1-100
  summary: string;
  stanceAndPositioning: {
    score: number;
    headPosition: string;
    levelChange: string;
    footworkPace: string;
    strengths: string[];
    weaknesses: string[];
  };
  neutralOffense: {
    score: number;
    shotsAttempted: number;
    shotsScored: number;
    primaryAttacks: string[];
    shotMechanicsFeedback: string;
    finishEfficiency: string;
  };
  neutralDefense: {
    score: number;
    takedownDefensePercent: number;
    sprawlReactionTime: string;
    frontHeadlockRecovery: string;
    vulnerabilities: string[];
  };
  topRidingTurns: {
    score: number;
    ridingTimeSeconds: number;
    breakdownEffectiveness: string;
    turnAttempts: string[];
    turnSuccessRate: string;
  };
  bottomEscapesReversals: {
    score: number;
    escapeTimeAverage: string;
    firstStepExplosion: string;
    handFightingUnderPressure: string;
    escapesScored: number;
    reversalsScored: number;
  };
  keyTakeaways: string[];
  drills: DrillRecommendation[];
}

export interface MatchAnalysisResult {
  id: string;
  title: string;
  sourceType: 'youtube' | 'upload' | 'demo';
  videoUrl?: string;
  analyzedTarget: TargetWrestler;
  weightClass?: string;
  dateAnalyzed: string;
  durationSeconds: number;
  cannotAnalyze?: boolean;
  rejectionReason?: string;
  finalScore: {
    red: number;
    green: number;
    winner: WrestlerColor | 'tie';
  };
  ridingTime: {
    redSeconds: number;
    greenSeconds: number;
    ridingTimeAdvantageWinner?: WrestlerColor;
  };
  events: MatchEvent[];
  wrestlers: {
    red: WrestlerTechniqueBreakdown;
    green: WrestlerTechniqueBreakdown;
  };
  overallMatchSummary: string;
}
