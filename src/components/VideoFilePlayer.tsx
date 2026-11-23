'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Volume2, VolumeX } from 'lucide-react';

interface VideoFilePlayerProps {
  videoFileUrl: string;
  onTimeUpdate: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  seekTime?: number | null;
  onSeekComplete?: () => void;
}

export const VideoFilePlayer: React.FC<VideoFilePlayerProps> = ({
  videoFileUrl,
  onTimeUpdate,
  onDurationChange,
  seekTime,
  onSeekComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (seekTime !== null && seekTime !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekTime;
      videoRef.current.play();
      setIsPlaying(true);
      if (onSeekComplete) {
        onSeekComplete();
      }
    }
  }, [seekTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(Math.floor(videoRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && onDurationChange) {
      onDurationChange(Math.floor(videoRef.current.duration));
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const changeRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const rewind5 = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div className="relative w-full pb-[56.25%] bg-black">
        <video
          ref={videoRef}
          src={videoFileUrl}
          className="absolute top-0 left-0 w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
        />
      </div>

      <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>
          <button
            onClick={rewind5}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">5s</span>
          </button>
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
            <FastForward className="w-3 h-3 text-indigo-400" />
            Speed:
          </span>
          {[0.5, 0.75, 1, 1.25].map((rate) => (
            <button
              key={rate}
              onClick={() => changeRate(rate)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                playbackRate === rate
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {rate === 0.5 ? 'Slow (0.5x)' : `${rate}x`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
