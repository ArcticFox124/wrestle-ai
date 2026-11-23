'use client';

import React, { useState } from 'react';
import { MatchEvent, TargetWrestler, FolkstyleEventType, WrestlerColor } from '@/types/wrestling';
import { 
  Play, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  Plus, 
  Trash2, 
  Tag 
} from 'lucide-react';

interface EventLogProps {
  events: MatchEvent[];
  currentTimeSeconds: number;
  onSeek: (timestamp: number) => void;
  targetWrestler: TargetWrestler;
  onAddEvent?: (newEvent: MatchEvent) => void;
  onDeleteEvent?: (id: string) => void;
}

export const EventLog: React.FC<EventLogProps> = ({
  events,
  currentTimeSeconds,
  onSeek,
  targetWrestler,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [isTaggingOpen, setIsTaggingOpen] = useState<boolean>(false);

  // Quick-tag form state
  const [tagWrestler, setTagWrestler] = useState<WrestlerColor>('red');
  const [tagType, setTagType] = useState<FolkstyleEventType>('takedown');
  const [tagMoveName, setTagMoveName] = useState<string>('Single Leg Takedown (+3)');
  const [tagPeriod, setTagPeriod] = useState<1 | 2 | 3 | 'OT'>(1);
  const [tagDescription, setTagDescription] = useState<string>('');

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const filteredEvents = events.filter((ev) => {
    if (targetWrestler !== 'both' && ev.wrestler !== 'neutral') {
      if (ev.wrestler !== targetWrestler) return false;
    }
    if (filter === 'all') return true;
    if (filter === 'takedown') return ev.type === 'takedown' || ev.type === 'shot_attempt';
    if (filter === 'mat') return ev.type === 'escape' || ev.type === 'reversal' || ev.type === 'near_fall';
    if (filter === 'scramble') return ev.type === 'scramble' || ev.type === 'counter_attack';
    return true;
  });

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddEvent) return;

    let pointsRed = 0;
    let pointsGreen = 0;
    const pts = tagType === 'takedown' ? 3 : tagType === 'escape' ? 1 : tagType === 'reversal' ? 2 : tagType === 'near_fall' ? 3 : 0;
    if (tagWrestler === 'red') pointsRed = pts;
    if (tagWrestler === 'green') pointsGreen = pts;

    const newEv: MatchEvent = {
      id: `custom-ev-${Date.now()}`,
      timestamp: currentTimeSeconds,
      period: tagPeriod,
      wrestler: tagWrestler,
      type: tagType,
      moveName: tagMoveName,
      points: { red: pointsRed, green: pointsGreen },
      runningScore: { red: 0, green: 0 }, // recalculated in parent
      description: tagDescription || `Coach tag at ${formatTime(currentTimeSeconds)}: ${tagMoveName}`,
      critique: {
        positiveCues: ['Coach-tagged verified moment'],
        flawsDetected: [],
        biomechanicalNote: 'Review video playback at this timecode.',
      },
    };

    onAddEvent(newEv);
    setIsTaggingOpen(false);
    setTagDescription('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header & Filter Controls */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-white">Match Sequence Log</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/40 font-semibold">
            {filteredEvents.length} actions
          </span>
        </div>

        {/* Action Buttons: Tag Move */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTaggingOpen(!isTaggingOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-sm transition-all"
            title="Add or mark move at current video time"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tag at {formatTime(currentTimeSeconds)}</span>
          </button>
        </div>
      </div>

      {/* Quick Tagging Drawer */}
      {isTaggingOpen && (
        <form onSubmit={handleCreateTag} className="p-3 bg-indigo-950/30 border-b border-indigo-900/50 space-y-2.5 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Tag Move at {formatTime(currentTimeSeconds)}
            </span>
            <button
              type="button"
              onClick={() => setIsTaggingOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Wrestler</label>
              <select
                value={tagWrestler}
                onChange={(e) => setTagWrestler(e.target.value as WrestlerColor)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white"
              >
                <option value="red">Red Ankle</option>
                <option value="green">Green Ankle</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Move Type</label>
              <select
                value={tagType}
                onChange={(e) => {
                  const t = e.target.value as FolkstyleEventType;
                  setTagType(t);
                  if (t === 'takedown') setTagMoveName('Single Leg Takedown (+3)');
                  if (t === 'escape') setTagMoveName('Standup & Escape (+1)');
                  if (t === 'reversal') setTagMoveName('Switch Reversal (+2)');
                  if (t === 'near_fall') setTagMoveName('Far-Side Cradle (3-Pt Near Fall)');
                  if (t === 'scramble') setTagMoveName('Scramble / Stalemate');
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white"
              >
                <option value="takedown">Takedown (+3)</option>
                <option value="escape">Escape (+1)</option>
                <option value="reversal">Reversal (+2)</option>
                <option value="near_fall">Near Fall (+2/+3)</option>
                <option value="scramble">Scramble</option>
                <option value="shot_attempt">Shot Attempt</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Period</label>
              <select
                value={tagPeriod}
                onChange={(e) => setTagPeriod(Number(e.target.value) as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white"
              >
                <option value={1}>Period 1</option>
                <option value={2}>Period 2</option>
                <option value={3}>Period 3</option>
                <option value="OT">Overtime</option>
              </select>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={tagMoveName}
              onChange={(e) => setTagMoveName(e.target.value)}
              placeholder="Move name (e.g. High Crotch to Double)"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white text-xs"
            />
          </div>

          <div>
            <input
              type="text"
              value={tagDescription}
              onChange={(e) => setTagDescription(e.target.value)}
              placeholder="Technique notes (optional)"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white text-xs"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs"
            >
              Save Tag
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="px-3 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-1 text-[11px]">
        <button
          onClick={() => setFilter('all')}
          className={`px-2 py-0.5 rounded-md transition-all ${
            filter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('takedown')}
          className={`px-2 py-0.5 rounded-md transition-all ${
            filter === 'takedown' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Shots & TDs
        </button>
        <button
          onClick={() => setFilter('mat')}
          className={`px-2 py-0.5 rounded-md transition-all ${
            filter === 'mat' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Escapes & Turns
        </button>
        <button
          onClick={() => setFilter('scramble')}
          className={`px-2 py-0.5 rounded-md transition-all ${
            filter === 'scramble' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Scrambles
        </button>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[500px]">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No events match the selected filter.
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isNearCurrent =
              Math.abs(currentTimeSeconds - ev.timestamp) <= 3;
            const isExpanded = expandedEventId === ev.id;

            const wrestlerBadge =
              ev.wrestler === 'red'
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : ev.wrestler === 'green'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700';

            return (
              <div
                key={ev.id}
                className={`border rounded-xl transition-all ${
                  isNearCurrent
                    ? 'border-indigo-500 bg-indigo-950/20 shadow-md ring-1 ring-indigo-500/40'
                    : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/80'
                }`}
              >
                {/* Event Card Header */}
                <div className="p-3 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {/* Timestamp Button */}
                    <button
                      onClick={() => onSeek(ev.timestamp)}
                      className="px-2 py-1 rounded-md bg-slate-800 hover:bg-indigo-600 text-indigo-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-1 group shrink-0"
                      title="Jump video to this move"
                    >
                      <Play className="w-2.5 h-2.5 fill-current transition-transform group-hover:scale-110" />
                      {formatTime(ev.timestamp)}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-white">
                          {ev.moveName}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase border ${wrestlerBadge}`}
                        >
                          {ev.wrestler === 'neutral' ? 'Neutral' : `${ev.wrestler} Ankle`}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Period {ev.period}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {ev.description}
                      </p>
                    </div>
                  </div>

                  {/* Score & Toggle */}
                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="text-[11px] font-mono font-bold bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                        <span className="text-red-400">{ev.runningScore.red}</span>
                        <span className="text-slate-500 mx-1">-</span>
                        <span className="text-emerald-400">{ev.runningScore.green}</span>
                      </div>
                      {onDeleteEvent && (
                        <button
                          onClick={() => onDeleteEvent(ev.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete this event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {ev.critique && (
                      <button
                        onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 font-semibold"
                      >
                        {isExpanded ? (
                          <>
                            <span>Hide Notes</span>
                            <ChevronUp className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            <span>Film Breakdown</span>
                            <ChevronDown className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Film Critique Drawer */}
                {isExpanded && ev.critique && (
                  <div className="border-t border-slate-800/80 bg-slate-900/90 p-3 rounded-b-xl text-xs space-y-2">
                    {ev.critique.positiveCues.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] mb-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Technical Positives</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px] pl-1">
                          {ev.critique.positiveCues.map((cue, idx) => (
                            <li key={idx}>{cue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {ev.critique.flawsDetected.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] mb-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Correction Needed</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px] pl-1">
                          {ev.critique.flawsDetected.map((flaw, idx) => (
                            <li key={idx}>{flaw}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {ev.critique.biomechanicalNote && (
                      <div className="bg-indigo-950/40 border border-indigo-900/50 p-2 rounded-lg flex items-start gap-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-indigo-200">
                          <span className="font-bold text-white">Coach’s Cue: </span>
                          {ev.critique.biomechanicalNote}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
