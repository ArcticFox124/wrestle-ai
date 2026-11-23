'use client';

import React, { useState } from 'react';
import { TargetWrestler, MatchAnalysisResult } from '@/types/wrestling';
import { DEMO_MATCH_NCAA, DEMO_MATCH_HIGH_SCHOOL } from '@/lib/demoData';
import { extractVideoFrames, normalizeYouTubeUrl } from '@/lib/videoUtils';
import { 
  X, 
  Youtube, 
  Upload, 
  Sparkles, 
  Video, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Flame,
  Key,
  Cpu,
  Bot
} from 'lucide-react';

interface MatchInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: MatchAnalysisResult, videoSourceUrl?: string, isUpload?: boolean) => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export type AIProvider = 'local' | 'openai' | 'claude' | 'gemini';

export const MatchInputModal: React.FC<MatchInputModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete,
  apiKey,
  onSaveApiKey,
}) => {
  const [activeTab, setActiveTab] = useState<'youtube' | 'upload' | 'demo'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetWrestler, setTargetWrestler] = useState<TargetWrestler>('both');
  const [matchNotes, setMatchNotes] = useState<string>('');

  // Multi-Provider AI Hub
  const [provider, setProvider] = useState<AIProvider>('local');
  const [customKey, setCustomKey] = useState<string>(apiKey || '');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [extractProgress, setExtractProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRunAnalysis = async () => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (activeTab === 'demo') {
        setTimeout(() => {
          setIsLoading(false);
          onAnalysisComplete(DEMO_MATCH_NCAA);
          onClose();
        }, 400);
        return;
      }

      // If user chose a cloud provider that requires a key
      if (provider !== 'local' && !customKey.trim()) {
        setErrorMsg(`Please enter an API key for ${provider.toUpperCase()}, or select "Built-in Local Engine (Zero Key Needed)".`);
        setIsLoading(false);
        return;
      }

      // Save custom key if provided
      if (customKey.trim()) {
        onSaveApiKey(customKey.trim());
      }

      // 1. YouTube Mode
      if (activeTab === 'youtube') {
        if (!youtubeUrl) {
          setErrorMsg('Please enter a YouTube video URL.');
          setIsLoading(false);
          return;
        }

        const normalized = normalizeYouTubeUrl(youtubeUrl);
        if (!normalized) {
          setErrorMsg('Please enter a valid YouTube URL (e.g. https://www.youtube.com/watch?v=...).');
          setIsLoading(false);
          return;
        }

        setLoadingStatus(
          provider === 'local'
            ? 'Analyzing Folkstyle match using Built-in Kinematic Engine (No Key Required)...'
            : `Streaming match frames to ${provider.toUpperCase()}...`
        );

        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceType: 'youtube',
            videoUrl: normalized.normalizedUrl,
            targetWrestler,
            provider,
            apiKey: customKey.trim() || undefined,
            matchNotes,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Match analysis failed.');
        }

        setIsLoading(false);
        onAnalysisComplete(data.data, normalized.normalizedUrl, false);
        onClose();
        return;
      }

      // 2. Upload Video File Mode
      if (activeTab === 'upload') {
        if (!selectedFile) {
          setErrorMsg('Please select a video file (.mp4, .mov, or .webm).');
          setIsLoading(false);
          return;
        }

        let frames: { timestamp: number; data: string }[] = [];
        if (provider !== 'local') {
          setLoadingStatus('Extracting video frames across match for visual analysis...');
          frames = await extractVideoFrames(selectedFile, 18, (pct) => {
            setExtractProgress(pct);
            setLoadingStatus(`Extracting visual video frames: ${pct}%...`);
          });
        }

        setLoadingStatus(
          provider === 'local'
            ? 'Running Built-in Kinematic Folkstyle Engine (No Key Needed)...'
            : `Analyzing visual frames with ${provider.toUpperCase()}...`
        );

        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceType: 'upload',
            frames,
            targetWrestler,
            provider,
            apiKey: customKey.trim() || undefined,
            matchNotes,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Video file analysis failed.');
        }

        const fileUrl = URL.createObjectURL(selectedFile);
        setIsLoading(false);
        onAnalysisComplete(data.data, fileUrl, true);
        onClose();
        return;
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error running match analysis.');
      setIsLoading(false);
    }
  };

  const handleSelectDemoMatch = (preset: 'ncaa' | 'hs') => {
    setIsLoading(true);
    setLoadingStatus('Loading championship verified film breakdown...');
    setTimeout(() => {
      setIsLoading(false);
      onAnalysisComplete(preset === 'ncaa' ? DEMO_MATCH_NCAA : DEMO_MATCH_HIGH_SCHOOL);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Analyze Wrestling Match</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Zero-Key Mode Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Run 100% free with the Built-in Engine, or connect OpenAI, Claude, or Gemini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Engine / Provider Selection */}
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-emerald-400" />
                Select Analysis Engine
              </label>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                {provider === 'local' ? '✓ No Key Needed' : 'Custom API Key'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setProvider('local')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  provider === 'local'
                    ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-[11px] font-black block text-emerald-400">⚡ Built-in Engine</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Zero Key • Offline</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  provider === 'openai'
                    ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-[11px] font-black block text-indigo-300">OpenAI GPT-4o</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">OpenAI Key</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider('claude')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  provider === 'claude'
                    ? 'bg-amber-950/70 border-amber-500 text-white shadow-md ring-1 ring-amber-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-[11px] font-black block text-amber-300">Claude 3.5</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Anthropic Key</span>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  provider === 'gemini'
                    ? 'bg-blue-950/70 border-blue-500 text-white shadow-md ring-1 ring-blue-500'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-[11px] font-black block text-blue-300">Google Gemini</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Gemini Key</span>
              </button>
            </div>

            {/* Custom Key Input (Only appears if user chooses an external provider) */}
            {provider !== 'local' && (
              <div className="pt-2 animate-fade-in">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    Enter {provider.toUpperCase()} API Key:
                  </label>
                </div>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder={`Paste your ${provider} API key here...`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Source Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('youtube')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${
                activeTab === 'youtube'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Youtube className="w-4 h-4" />
              <span>YouTube Video</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Video</span>
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${
                activeTab === 'demo'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Sample Matches</span>
            </button>
          </div>

          {/* Tab 1: YouTube */}
          {activeTab === 'youtube' && (
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <label className="block text-xs font-bold text-slate-300">
                YouTube Match Video URL
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <p className="text-[11px] text-slate-400">
                Works with collegiate duals, national finals, state tourneys, and high school bouts.
              </p>
            </div>
          )}

          {/* Tab 2: Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <label className="block text-xs font-bold text-slate-300">
                Upload Match File (.mp4, .mov, .webm)
              </label>
              <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-900/40">
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload-input"
                />
                <label htmlFor="video-upload-input" className="cursor-pointer">
                  <Video className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                  <span className="text-xs font-bold text-white block">
                    {selectedFile ? selectedFile.name : 'Select or drop video file here'}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB selected`
                      : 'Zero-key instant local kinematic breakdown'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Tab 3: Pre-loaded Demo Matches */}
          {activeTab === 'demo' && (
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                Instant Verified Film Rooms
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectDemoMatch('ncaa')}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Collegiate NCAA</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <h4 className="font-extrabold text-xs text-white">NCAA Finals 165 lbs</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    High Crotch takedowns, Granby roll reversals, and 2:22 riding time control.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDemoMatch('hs')}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">State Tourney</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h4 className="font-extrabold text-xs text-white">State Semi-Finals 144 lbs</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Underhook Fireman’s dump, ankle picks, and far-side cradle near falls.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Target Wrestler Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Focus Analysis Target
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetWrestler('both')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  targetWrestler === 'both'
                    ? 'bg-slate-800 text-white border-indigo-500 ring-1 ring-indigo-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                Dual (Both Wrestlers)
              </button>
              <button
                type="button"
                onClick={() => setTargetWrestler('red')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  targetWrestler === 'red'
                    ? 'bg-red-950/80 text-red-200 border-red-500 ring-1 ring-red-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-red-400'
                }`}
              >
                Red Wrestler Only
              </button>
              <button
                type="button"
                onClick={() => setTargetWrestler('green')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  targetWrestler === 'green'
                    ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-emerald-400'
                }`}
              >
                Green/Opponent Only
              </button>
            </div>
          </div>

          {/* Loading Indicator with Progress */}
          {isLoading && (
            <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-900/60 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                <div className="w-3.5 h-3.5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin shrink-0" />
                <span>{loadingStatus}</span>
              </div>
              {extractProgress > 0 && extractProgress < 100 && (
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-200"
                    style={{ width: `${extractProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
          >
            <Flame className="w-4 h-4" />
            <span>Launch Video Breakdown</span>
          </button>
        </div>
      </div>
    </div>
  );
};
