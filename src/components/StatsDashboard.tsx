'use client';

import React from 'react';
import { MatchAnalysisResult } from '@/types/wrestling';
import { BarChart3, Timer, Zap, Shield, Trophy } from 'lucide-react';

interface StatsDashboardProps {
  matchData: MatchAnalysisResult;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ matchData }) => {
  const red = matchData.wrestlers.red;
  const green = matchData.wrestlers.green;

  const formatSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}m ${rem < 10 ? '0' : ''}${rem}s`;
  };

  // Calculate points by period
  const p1Red = matchData.events
    .filter((e) => e.period === 1)
    .reduce((sum, e) => sum + e.points.red, 0);
  const p1Green = matchData.events
    .filter((e) => e.period === 1)
    .reduce((sum, e) => sum + e.points.green, 0);

  const p2Red = matchData.events
    .filter((e) => e.period === 2)
    .reduce((sum, e) => sum + e.points.red, 0);
  const p2Green = matchData.events
    .filter((e) => e.period === 2)
    .reduce((sum, e) => sum + e.points.green, 0);

  const p3Red = matchData.events
    .filter((e) => e.period === 3 || e.period === 'OT')
    .reduce((sum, e) => sum + e.points.red, 0);
  const p3Green = matchData.events
    .filter((e) => e.period === 3 || e.period === 'OT')
    .reduce((sum, e) => sum + e.points.green, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          Folkstyle Match Analytics & Head-to-Head Comparison
        </h2>
        <p className="text-xs text-slate-400">
          Shot accuracy, control time, points by period, and tactical performance
        </p>
      </div>

      {/* Primary Comparison Bars */}
      <div className="space-y-3">
        {/* Metric 1: Final Score */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-red-400">{red.name}: {matchData.finalScore.red} pts</span>
            <span className="text-slate-400">Total Match Points</span>
            <span className="text-emerald-400">{matchData.finalScore.green} pts : {green.name}</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-red-500 h-full transition-all"
              style={{
                width: `${
                  (matchData.finalScore.red /
                    Math.max(1, matchData.finalScore.red + matchData.finalScore.green)) *
                  100
                }%`,
              }}
            />
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{
                width: `${
                  (matchData.finalScore.green /
                    Math.max(1, matchData.finalScore.red + matchData.finalScore.green)) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Metric 2: Neutral Shots Scored vs Attempted */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-red-400">
              {red.neutralOffense.shotsScored}/{red.neutralOffense.shotsAttempted} ({red.neutralOffense.finishEfficiency})
            </span>
            <span className="text-slate-400">Shot Conversion Rate</span>
            <span className="text-emerald-400">
              {green.neutralOffense.shotsScored}/{green.neutralOffense.shotsAttempted} ({green.neutralOffense.finishEfficiency})
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900 p-2 rounded-lg border border-red-950/80 text-center">
              <span className="text-[10px] text-slate-400 block">Red Primary</span>
              <span className="font-semibold text-slate-200">{red.neutralOffense.primaryAttacks.join(', ') || 'N/A'}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-emerald-950/80 text-center">
              <span className="text-[10px] text-slate-400 block">Green Primary</span>
              <span className="font-semibold text-slate-200">{green.neutralOffense.primaryAttacks.join(', ') || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Riding Time (Mat Control) */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-red-400">{formatSeconds(matchData.ridingTime.redSeconds)}</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              Riding Time (Mat Control)
            </span>
            <span className="text-emerald-400">{formatSeconds(matchData.ridingTime.greenSeconds)}</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-red-500 h-full transition-all"
              style={{
                width: `${
                  (matchData.ridingTime.redSeconds /
                    Math.max(1, matchData.ridingTime.redSeconds + matchData.ridingTime.greenSeconds)) *
                  100
                }%`,
              }}
            />
            <div
              className="bg-emerald-500 h-full transition-all"
              style={{
                width: `${
                  (matchData.ridingTime.greenSeconds /
                    Math.max(1, matchData.ridingTime.redSeconds + matchData.ridingTime.greenSeconds)) *
                  100
                }%`,
              }}
            />
          </div>
          {matchData.ridingTime.ridingTimeAdvantageWinner && (
            <p className="text-[10px] text-amber-300 font-semibold text-center mt-2">
              ★ {matchData.ridingTime.ridingTimeAdvantageWinner.toUpperCase()} earned +1 Riding Time Point (1:00+ Advantage)
            </p>
          )}
        </div>

        {/* Metric 4: Points by Period */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-xs font-bold text-slate-300 block mb-2 text-center">
            Scoring by Period Progression
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-bold">1st Period</span>
              <div className="font-black text-sm mt-0.5">
                <span className="text-red-400">{p1Red}</span>
                <span className="text-slate-500 mx-1">-</span>
                <span className="text-emerald-400">{p1Green}</span>
              </div>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-bold">2nd Period</span>
              <div className="font-black text-sm mt-0.5">
                <span className="text-red-400">{p2Red}</span>
                <span className="text-slate-500 mx-1">-</span>
                <span className="text-emerald-400">{p2Green}</span>
              </div>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-bold">3rd Period / OT</span>
              <div className="font-black text-sm mt-0.5">
                <span className="text-red-400">{p3Red}</span>
                <span className="text-slate-500 mx-1">-</span>
                <span className="text-emerald-400">{p3Green}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
