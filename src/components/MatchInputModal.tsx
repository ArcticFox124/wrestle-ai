'use client';

import React, { useState } from 'react';
import { TargetWrestler, MatchAnalysisResult } from '@/types/wrestling';
import { DEMO_MATCH_NCAA, DEMO_MATCH_HIGH_SCHOOL } from '@/lib/demoData';
import { 
  X, 
  Youtube, 
  Upload, 
  Sparkles, 
  Video, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Flame,
  Key
} from 'lucide-react';

interface MatchInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: MatchAnalysisResult, videoSourceUrl?: string, isUpload?: boolean) => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [localApiKey, setLocalApiKey] = useState<string>(apiKey);

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
        }, 600);
        return;
      }

      // If YouTube or Upload
      const videoSource = activeTab === 'youtube' ? youtubeUrl : selectedFile ? selectedFile.name : '';
      if (activeTab === 'youtube' && !youtubeUrl) {
        setErrorMsg('Please enter a valid YouTube video URL.');
        setIsLoading(false);
        return;
      }

      if (activeTab === 'upload' && !selectedFile) {
        setErrorMsg('Please select a video file (.mp4, .mov, .webm) to analyze.');
        setIsLoading(false);
        return;
      }

      // If no API key is provided, we can fallback to demo data with custom title
      if (!localApiKey && !apiKey) {
        // Return demo data with user's video reference so they can test the UI immediately
        const mockResult: MatchAnalysisResult = {
          ...DEMO_MATCH_NCAA,
          title: activeTab === 'youtube' ? `YouTube Match: ${youtubeUrl}` : `Uploaded Video: ${selectedFile?.name}`,
          sourceType: activeTab,
          videoUrl: activeTab === 'youtube' ? youtubeUrl : undefined,
          analyzedTarget: targetWrestler,
        };

        let fileUrl: string | undefined = undefined;
        if (activeTab === 'upload' && selectedFile) {
          fileUrl = URL.createObjectURL(selectedFile);
        }

        setTimeout(() => {
          setIsLoading(false);
          onAnalysisComplete(mockResult, fileUrl, activeTab === 'upload');
          onClose();
        }, 1000);
        return;
      }

      // Call API
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceType: activeTab,
          videoUrl: activeTab === 'youtube' ? youtubeUrl : undefined,
          targetWrestler,
          apiKey: localApiKey || apiKey,
          matchNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed.');
      }

      let fileUrl: string | undefined = undefined;
      if (activeTab === 'upload' && selectedFile) {
        fileUrl = URL.createObjectURL(selectedFile);
      }

      setIsLoading(false);
      onAnalysisComplete(data.data, fileUrl, activeTab === 'upload');
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error running match analysis.');
      setIsLoading(false);
    }
  };

  const handleSelectDemoMatch = (preset: 'ncaa' | 'hs') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAnalysisComplete(preset === 'ncaa' ? DEMO_MATCH_NCAA : DEMO_MATCH_HIGH_SCHOOL);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Flame className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Analyze Wrestling Match</h2>
              <p className="text-xs text-slate-400">
                Submit a video to generate Folkstyle move breakdowns & technique film
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
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
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
              <span>YouTube Link</span>
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
              <span>Video File Upload</span>
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
              <p className="text-[11px] text-slate-500">
                Supports standard matches, dual meets, tournament finals, and highlights.
              </p>
            </div>
          )}

          {/* Tab 2: Direct Video File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <label className="block text-xs font-bold text-slate-300">
                Upload Match Video File (.mp4, .mov, .webm)
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
                    {selectedFile ? selectedFile.name : 'Click to select or drag video here'}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB selected`
                      : 'High School & Collegiate match recordings'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Tab 3: Pre-Analyzed Matches */}
          {activeTab === 'demo' && (
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                Instant Interactive Demos (Zero Setup Required)
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
                    Underhook Fireman’s dump, low ankle picks, and far-side cradle near falls.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Target Wrestler Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Target Wrestler for Coaching Critique
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
                Green Wrestler Only
              </button>
            </div>
          </div>

          {/* Optional API Key Input */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                Google Gemini API Key (Optional for Custom AI Analysis)
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-indigo-400 hover:underline font-semibold"
              >
                Get Free Key ↗
              </a>
            </div>
            <input
              type="password"
              value={localApiKey}
              onChange={(e) => {
                setLocalApiKey(e.target.value);
                onSaveApiKey(e.target.value);
              }}
              placeholder="AIzaSy... (leave blank to use built-in Folkstyle film analyzer)"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

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
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Folkstyle Match...</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4" />
                <span>Launch Film Breakdown</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
