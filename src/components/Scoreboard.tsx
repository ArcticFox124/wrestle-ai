'use client';

import React from 'react';
import { MatchAnalysisResult, WrestlerColor } from '@/types/wrestling';
import { Clock, ShieldCheck, Timer } from 'lucide-react';

interface ScoreboardProps {
  matchData: MatchAnalysisResult;
  currentTimeSeconds: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  matchData,
  currentTimeSeconds,
}) => {
  // Compute dynamic score based on current video timestamp
  // Find all events up to current time
  const currentEvents = matchData.events.filter(
    (ev) => ev.timestamp <= currentTimeSeconds
  );

  let runningRed = 0;
  let runningGreen = 0;
  let currentPeriod: 1 | 2 | 3 | 'OT' = 1;

  if (currentEvents.length > 0) {
    const lastEvent = currentEvents[currentEvents.length - 1];
    runningRed = lastEvent.runningScore.red;
    runningGreen = lastEvent.runningScore.green;
    currentPeriod = lastEvent.period;
  } else {
    // If before first event, 0-0
    runningRed = 0;
    runningGreen = 0;
    currentPeriod = 1;
  }

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const redRiding = matchData.ridingTime.redSeconds;
  const greenRiding = matchData.ridingTime.greenSeconds;
  const ridingDiff = Math.abs(redRiding - greenRiding);
  const ridingLeader: WrestlerColor | null =
    ridingDiff >= 60
      ? redRiding > greenRiding
        ? 'red'
        : 'green'
      : null;

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl mb-4 backdrop-blur-md">
      <div className="grid grid-cols-12 items-center gap-2 sm:gap-4">
        {/* Red Wrestler */}
        <div className="col-span-5 flex items-center justify-between bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-900/40 rounded-xl p-2.5 sm:p-3">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <div className="w-3.5 h-10 bg-red-600 rounded-md shadow-sm shrink-0"></div>
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold tracking-wider text-red-400">RED ANKLE</span>
              <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                {matchData.wrestlers.red.name}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Timer className="w-3 h-3 text-red-400" />
                  Riding: {formatTime(redRiding)}
                </span>
                {ridingLeader === 'red' && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1 rounded border border-amber-400/20">
                    +1 RT Adv
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-red-400 pl-2">
            {runningRed}
          </div>
        </div>

        {/* Center Clock & Period */}
        <div className="col-span-2 flex flex-col items-center justify-center text-center">
          <div className="px-2 py-0.5 bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-1">
            Period {currentPeriod}
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-base sm:text-lg text-slate-100">
            <Clock className="w-3.5 h-3.5 text-indigo-400 hidden sm:inline" />
            {formatTime(currentTimeSeconds)}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            Folkstyle Rules
          </span>
        </div>

        {/* Green Wrestler */}
        <div className="col-span-5 flex items-center justify-between bg-gradient-to-l from-emerald-950/60 to-slate-900 border border-emerald-900/40 rounded-xl p-2.5 sm:p-3">
          <div className="text-3xl sm:text-4xl font-black text-emerald-400 pr-2 order-last sm:order-first">
            {runningGreen}
          </div>
          <div className="truncate text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">GREEN ANKLE</span>
            <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
              {matchData.wrestlers.green.name}
            </h3>
            <div className="flex items-center justify-end gap-2 text-[11px] text-slate-400">
              {ridingLeader === 'green' && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1 rounded border border-amber-400/20">
                  +1 RT Adv
                </span>
              )}
              <span className="flex items-center gap-1">
                <Timer className="w-3 h-3 text-emerald-400" />
                Riding: {formatTime(greenRiding)}
              </span>
            </div>
          </div>
          <div className="w-3.5 h-10 bg-emerald-600 rounded-md shadow-sm shrink-0 order-first sm:order-last"></div>
        </div>
      </div>
    </div>
  );
};
