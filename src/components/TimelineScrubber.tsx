'use client';

import React from 'react';
import { MatchEvent } from '@/types/wrestling';
import { Award, ShieldAlert, Zap, Repeat, ArrowUpRight, Flame } from 'lucide-react';

interface TimelineScrubberProps {
  durationSeconds: number;
  currentTimeSeconds: number;
  events: MatchEvent[];
  onSeek: (seconds: number) => void;
  selectedEventId?: string | null;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  durationSeconds,
  currentTimeSeconds,
  events,
  onSeek,
  selectedEventId,
}) => {
  const safeDuration = Math.max(1, durationSeconds);
  const progressPercent = Math.min(100, (currentTimeSeconds / safeDuration) * 100);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const getEventBadgeColor = (ev: MatchEvent) => {
    switch (ev.type) {
      case 'takedown':
        return ev.wrestler === 'red' ? 'bg-red-500 text-white border-red-300' : 'bg-emerald-500 text-white border-emerald-300';
      case 'escape':
        return 'bg-blue-500 text-white border-blue-300';
      case 'reversal':
        return 'bg-purple-600 text-white border-purple-300';
      case 'near_fall':
        return 'bg-amber-500 text-white border-amber-300';
      case 'scramble':
        return 'bg-amber-600 text-white border-amber-300';
      default:
        return 'bg-slate-600 text-white border-slate-400';
    }
  };

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(Math.floor(ratio * safeDuration));
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg my-3">
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-indigo-400 font-bold">{formatTime(currentTimeSeconds)}</span>
          <span className="text-slate-600">/</span>
          <span className="font-mono text-slate-400">{formatTime(safeDuration)}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Red TD
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Green TD
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> Escape
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Near Fall
          </span>
        </div>
      </div>

      {/* Scrub Track */}
      <div
        onClick={handleBarClick}
        className="relative w-full h-5 bg-slate-950 rounded-lg cursor-pointer group flex items-center border border-slate-800"
      >
        {/* Progress Fill */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-indigo-600/70 rounded-lg transition-all pointer-events-none"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Current Playhead */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-6 bg-white rounded-md shadow-md border-2 border-indigo-600 pointer-events-none transition-all z-20"
          style={{ left: `calc(${progressPercent}% - 7px)` }}
        />

        {/* Event Pins */}
        {events.map((ev) => {
          const pinPercent = (ev.timestamp / safeDuration) * 100;
          const isSelected = selectedEventId === ev.id;
          return (
            <button
              key={ev.id}
              onClick={(e) => {
                e.stopPropagation();
                onSeek(ev.timestamp);
              }}
              title={`${formatTime(ev.timestamp)}: ${ev.moveName}`}
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border shadow-sm transition-transform hover:scale-150 z-10 flex items-center justify-center ${getEventBadgeColor(
                ev
              )} ${isSelected ? 'ring-2 ring-white scale-125' : ''}`}
              style={{ left: `calc(${pinPercent}% - 8px)` }}
            >
              <span className="text-[8px] font-black leading-none">
                {ev.type === 'takedown' ? 'T' : ev.type === 'escape' ? 'E' : ev.type === 'near_fall' ? 'N' : 'R'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
