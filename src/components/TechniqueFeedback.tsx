'use client';

import React, { useState } from 'react';
import { WrestlerTechniqueBreakdown, WrestlerColor, TargetWrestler } from '@/types/wrestling';
import { 
  Shield, 
  Target, 
  Activity, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface TechniqueFeedbackProps {
  redBreakdown: WrestlerTechniqueBreakdown;
  greenBreakdown: WrestlerTechniqueBreakdown;
  selectedTarget: TargetWrestler;
}

export const TechniqueFeedback: React.FC<TechniqueFeedbackProps> = ({
  redBreakdown,
  greenBreakdown,
  selectedTarget,
}) => {
  const [activeTab, setActiveTab] = useState<WrestlerColor>(
    selectedTarget === 'green' ? 'green' : 'red'
  );

  const currentWrestler = activeTab === 'red' ? redBreakdown : greenBreakdown;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    if (score >= 80) return 'text-indigo-400 border-indigo-500/40 bg-indigo-950/40';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      {/* Wrestler Switch Tab (if viewing dual or customizable) */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Biomechanical & Tactical Technique Card
          </h2>
          <p className="text-xs text-slate-400">
            Folkstyle technical grade, execution flaws, and coaching feedback
          </p>
        </div>

        {selectedTarget === 'both' && (
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('red')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'red'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-red-400/70 hover:text-red-300'
              }`}
            >
              Red: {redBreakdown.name.split(' ')[0]}
            </button>
            <button
              onClick={() => setActiveTab('green')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'green'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-emerald-400/70 hover:text-emerald-300'
              }`}
            >
              Green: {greenBreakdown.name.split(' ')[0]}
            </button>
          </div>
        )}
      </div>

      {/* Wrestler Header Card */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {activeTab.toUpperCase()} ANKLE EVALUATION
          </span>
          <h3 className="text-base font-extrabold text-white">{currentWrestler.name}</h3>
          <p className="text-xs text-slate-300 mt-0.5 max-w-xl">{currentWrestler.summary}</p>
        </div>
        <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border ${getScoreColor(currentWrestler.overallRating)}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider">Skill Rating</span>
          <span className="text-2xl font-black">{currentWrestler.overallRating}</span>
          <span className="text-[9px] text-slate-400">out of 100</span>
        </div>
      </div>

      {/* 4-Pillar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* Pillar 1: Stance & Motion */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs text-white">Stance, Motion & Setups</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreColor(currentWrestler.stanceAndPositioning.score)}`}>
              {currentWrestler.stanceAndPositioning.score} / 100
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <p><strong className="text-slate-100">Head Position:</strong> {currentWrestler.stanceAndPositioning.headPosition}</p>
            <p><strong className="text-slate-100">Level Change:</strong> {currentWrestler.stanceAndPositioning.levelChange}</p>
            <p><strong className="text-slate-100">Mat Pace:</strong> {currentWrestler.stanceAndPositioning.footworkPace}</p>
          </div>
        </div>

        {/* Pillar 2: Neutral Offense */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs text-white">Neutral Attack & Finishes</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreColor(currentWrestler.neutralOffense.score)}`}>
              {currentWrestler.neutralOffense.score} / 100
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <p><strong className="text-slate-100">Shots:</strong> {currentWrestler.neutralOffense.shotsScored} scored / {currentWrestler.neutralOffense.shotsAttempted} attempted ({currentWrestler.neutralOffense.finishEfficiency})</p>
            <p><strong className="text-slate-100">Primary Attacks:</strong> {currentWrestler.neutralOffense.primaryAttacks.join(', ')}</p>
            <p><strong className="text-slate-100">Mechanics:</strong> {currentWrestler.neutralOffense.shotMechanicsFeedback}</p>
          </div>
        </div>

        {/* Pillar 3: Neutral Defense */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-xs text-white">Takedown Defense & Countering</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreColor(currentWrestler.neutralDefense.score)}`}>
              {currentWrestler.neutralDefense.score} / 100
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <p><strong className="text-slate-100">TD Defense Rate:</strong> {currentWrestler.neutralDefense.takedownDefensePercent}%</p>
            <p><strong className="text-slate-100">Sprawl Speed:</strong> {currentWrestler.neutralDefense.sprawlReactionTime}</p>
            <div className="text-[11px] text-amber-300/90 flex items-start gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Vulnerability: {currentWrestler.neutralDefense.vulnerabilities.join('; ')}</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: Mat Wrestling (Top & Bottom) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs text-white">Top Riding & Bottom Escapes</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreColor(currentWrestler.topRidingTurns.score)}`}>
              {currentWrestler.topRidingTurns.score} / 100
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <p><strong className="text-slate-100">Top Riding:</strong> {currentWrestler.topRidingTurns.breakdownEffectiveness}</p>
            <p><strong className="text-slate-100">Bottom Explosion:</strong> {currentWrestler.bottomEscapesReversals.firstStepExplosion}</p>
            <p><strong className="text-slate-100">Avg Escape Time:</strong> {currentWrestler.bottomEscapesReversals.escapeTimeAverage}</p>
          </div>
        </div>
      </div>

      {/* Key Coaching Takeaways */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-900/40 rounded-xl p-3">
        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
          Primary Coaching Priorities
        </span>
        <ul className="space-y-1 text-xs text-slate-200 list-disc list-inside">
          {currentWrestler.keyTakeaways.map((tip, idx) => (
            <li key={idx} className="leading-relaxed">{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
