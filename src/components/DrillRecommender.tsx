'use client';

import React, { useState } from 'react';
import { DrillRecommendation, TargetWrestler, WrestlerColor } from '@/types/wrestling';
import { Dumbbell, Repeat, CheckCircle, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface DrillRecommenderProps {
  redDrills: DrillRecommendation[];
  greenDrills: DrillRecommendation[];
  selectedTarget: TargetWrestler;
  redName: string;
  greenName: string;
}

export const DrillRecommender: React.FC<DrillRecommenderProps> = ({
  redDrills,
  greenDrills,
  selectedTarget,
  redName,
  greenName,
}) => {
  const [activeTab, setActiveTab] = useState<WrestlerColor>(
    selectedTarget === 'green' ? 'green' : 'red'
  );

  const currentDrills = activeTab === 'red' ? redDrills : greenDrills;
  const currentWrestlerName = activeTab === 'red' ? redName : greenName;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            Prescribed Folkstyle Practice Drills
          </h2>
          <p className="text-xs text-slate-400">
            Tailored mat drills generated directly from match errors & missed finishes
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
              Red Drills
            </button>
            <button
              onClick={() => setActiveTab('green')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'green'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-emerald-400/70 hover:text-emerald-300'
              }`}
            >
              Green Drills
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {currentDrills.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No specific drills generated for this segment.
          </div>
        ) : (
          currentDrills.map((drill) => (
            <div
              key={drill.id}
              className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-white">{drill.name}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                      {drill.targetSkill}
                    </span>
                  </div>
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-medium">
                    <span className="font-semibold text-rose-300">Fixes Match Flaw:</span> {drill.targetedMistake}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono font-bold bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 inline-block">
                    {drill.recommendedSets}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-2 leading-relaxed bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/50">
                {drill.description}
              </p>

              <div className="flex items-center gap-2 text-xs bg-emerald-950/30 border border-emerald-900/40 px-3 py-1.5 rounded-lg text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-white">Coach Key: </strong>
                  {drill.keyCoachingPoint}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
