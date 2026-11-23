'use client';

import React from 'react';
import { TargetWrestler } from '@/types/wrestling';
import { 
  Flame, 
  Settings, 
  Upload, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Key 
} from 'lucide-react';

interface NavbarProps {
  onOpenNewMatch: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  targetWrestler: TargetWrestler;
  onSelectTargetWrestler: (target: TargetWrestler) => void;
  hasApiKey: boolean;
  matchTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewMatch,
  onOpenExport,
  onOpenSettings,
  targetWrestler,
  onSelectTargetWrestler,
  hasApiKey,
  matchTitle
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-red-600 to-indigo-600 shadow-lg shadow-red-500/20 text-white font-black text-xl">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">MatVision</span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-red-600/30 text-red-400 border border-red-500/40 rounded-md">
                Folkstyle AI
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>v2.2.0 (Zero Key Mode)</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block truncate max-w-xs">
              {matchTitle || 'Film Room & Coaching Analytics'}
            </p>
          </div>
        </div>

        {/* Target Wrestler Selector */}
        <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => onSelectTargetWrestler('both')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              targetWrestler === 'both'
                ? 'bg-slate-800 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dual Match View
          </button>
          <button
            onClick={() => onSelectTargetWrestler('red')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              targetWrestler === 'red'
                ? 'bg-red-600 text-white shadow-sm font-bold'
                : 'text-red-400/70 hover:text-red-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            Red Wrestler
          </button>
          <button
            onClick={() => onSelectTargetWrestler('green')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              targetWrestler === 'green'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-emerald-400/70 hover:text-emerald-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Green Wrestler
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewMatch}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Analyze Match</span>
          </button>

          <button
            onClick={onOpenExport}
            className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition-all active:scale-95"
            title="Export Coach Scouting Report"
          >
            <FileText className="w-3.5 h-3.5 text-slate-300" />
            <span>Report</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
            title="API Settings"
          >
            <div className="relative">
              <Key className="w-4 h-4" />
              {hasApiKey && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
