'use client';

import React, { useState, useEffect } from 'react';
import { MatchAnalysisResult, TargetWrestler } from '@/types/wrestling';
import { DEMO_MATCH_NCAA } from '@/lib/demoData';
import { Navbar } from '@/components/Navbar';
import { Scoreboard } from '@/components/Scoreboard';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { VideoFilePlayer } from '@/components/VideoFilePlayer';
import { TimelineScrubber } from '@/components/TimelineScrubber';
import { EventLog } from '@/components/EventLog';
import { TechniqueFeedback } from '@/components/TechniqueFeedback';
import { DrillRecommender } from '@/components/DrillRecommender';
import { StatsDashboard } from '@/components/StatsDashboard';
import { MatchInputModal } from '@/components/MatchInputModal';
import { ExportReportModal } from '@/components/ExportReportModal';
import { 
  PlaySquare, 
  Activity, 
  Dumbbell, 
  BarChart3, 
  Sparkles, 
  UploadCloud, 
  FileCheck 
} from 'lucide-react';

export default function Home() {
  const [matchData, setMatchData] = useState<MatchAnalysisResult>(DEMO_MATCH_NCAA);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [targetWrestler, setTargetWrestler] = useState<TargetWrestler>('both');
  
  const [videoFileUrl, setVideoFileUrl] = useState<string | null>(null);
  const [isUploadVideo, setIsUploadVideo] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'events' | 'technique' | 'drills' | 'stats'>('events');

  // Modals
  const [isInputModalOpen, setIsInputModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    // Load saved API key from localStorage if available
    const savedKey = localStorage.getItem('matvision_gemini_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('matvision_gemini_key', newKey);
  };

  const handleSeek = (seconds: number) => {
    setSeekTime(seconds);
    setCurrentTime(seconds);
  };

  const handleAnalysisComplete = (
    result: MatchAnalysisResult,
    fileUrl?: string,
    isUpload?: boolean
  ) => {
    setMatchData(result);
    setTargetWrestler(result.analyzedTarget || 'both');
    setCurrentTime(0);
    setSeekTime(0);

    if (isUpload && fileUrl) {
      setVideoFileUrl(fileUrl);
      setIsUploadVideo(true);
    } else {
      setIsUploadVideo(false);
      setVideoFileUrl(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        onOpenNewMatch={() => setIsInputModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenSettings={() => setIsInputModalOpen(true)}
        targetWrestler={targetWrestler}
        onSelectTargetWrestler={setTargetWrestler}
        hasApiKey={Boolean(apiKey)}
        matchTitle={matchData.title}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-4">
        {/* Match Header Info Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 rounded-2xl px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                {matchData.weightClass || 'Folkstyle Division'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{matchData.dateAnalyzed}</span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-white mt-0.5">
              {matchData.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInputModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all active:scale-95"
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
              <span>Change Match Video</span>
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Scouting Sheet</span>
            </button>
          </div>
        </div>

        {/* Dynamic Folkstyle Scoreboard */}
        <Scoreboard matchData={matchData} currentTimeSeconds={currentTime} />

        {/* Dual Pane Film Room */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Video Player & Timeline (Col 7) */}
          <div className="lg:col-span-7 space-y-3">
            {isUploadVideo && videoFileUrl ? (
              <VideoFilePlayer
                videoFileUrl={videoFileUrl}
                onTimeUpdate={setCurrentTime}
                seekTime={seekTime}
                onSeekComplete={() => setSeekTime(null)}
              />
            ) : (
              <YouTubePlayer
                videoUrl={matchData.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
                onTimeUpdate={setCurrentTime}
                seekTime={seekTime}
                onSeekComplete={() => setSeekTime(null)}
              />
            )}

            {/* Interactive Timeline Scrubber */}
            <TimelineScrubber
              durationSeconds={matchData.durationSeconds || 420}
              currentTimeSeconds={currentTime}
              events={matchData.events}
              onSeek={handleSeek}
            />

            {/* Match Overview Callout */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
              <span className="font-bold text-white block mb-1">
                Match Summary & Tactical Context:
              </span>
              <p className="leading-relaxed">{matchData.overallMatchSummary}</p>
            </div>
          </div>

          {/* Right Column: Tabbed Coaching & Analysis Suite (Col 5) */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            {/* Tab Navigation */}
            <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  activeTab === 'events'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PlaySquare className="w-3.5 h-3.5" />
                <span>Film Log</span>
              </button>
              <button
                onClick={() => setActiveTab('technique')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  activeTab === 'technique'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Technique</span>
              </button>
              <button
                onClick={() => setActiveTab('drills')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  activeTab === 'drills'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Drills</span>
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  activeTab === 'stats'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Stats</span>
              </button>
            </div>

            {/* Active Tab View */}
            <div className="min-h-[460px]">
              {activeTab === 'events' && (
                <EventLog
                  events={matchData.events}
                  currentTimeSeconds={currentTime}
                  onSeek={handleSeek}
                  targetWrestler={targetWrestler}
                />
              )}

              {activeTab === 'technique' && (
                <TechniqueFeedback
                  redBreakdown={matchData.wrestlers.red}
                  greenBreakdown={matchData.wrestlers.green}
                  selectedTarget={targetWrestler}
                />
              )}

              {activeTab === 'drills' && (
                <DrillRecommender
                  redDrills={matchData.wrestlers.red.drills}
                  greenDrills={matchData.wrestlers.green.drills}
                  selectedTarget={targetWrestler}
                  redName={matchData.wrestlers.red.name}
                  greenName={matchData.wrestlers.green.name}
                />
              )}

              {activeTab === 'stats' && (
                <StatsDashboard matchData={matchData} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Input Modal */}
      <MatchInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onAnalysisComplete={handleAnalysisComplete}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        matchData={matchData}
        selectedTarget={targetWrestler}
      />
    </div>
  );
}
