'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, Volume2, VolumeX } from 'lucide-react';

interface YouTubePlayerProps {
  videoUrl: string;
  onTimeUpdate: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  seekTime?: number | null;
  onSeekComplete?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function extractYouTubeId(url: string): string {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : url;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoUrl,
  onTimeUpdate,
  onDurationChange,
  seekTime,
  onSeekComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const videoId = extractYouTubeId(videoUrl);

  useEffect(() => {
    // Load YouTube Iframe API script if not already present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player('youtube-player-frame', {
        videoId: videoId || 'dQw4w9WgXcQ',
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            const duration = event.target.getDuration();
            if (onDurationChange && duration) {
              onDurationChange(duration);
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1
            if (event.data === 1) {
              setIsPlaying(true);
              startPoll();
            } else {
              setIsPlaying(false);
              stopPoll();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      stopPoll();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [videoId]);

  // Handle external seek requests (e.g. user clicked timeline or event)
  useEffect(() => {
    if (seekTime !== null && seekTime !== undefined && playerRef.current && isReady) {
      try {
        playerRef.current.seekTo(seekTime, true);
        playerRef.current.playVideo();
        if (onSeekComplete) {
          onSeekComplete();
        }
      } catch (err) {
        console.error('Seek error:', err);
      }
    }
  }, [seekTime, isReady]);

  const startPoll = () => {
    stopPoll();
    timerRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const time = playerRef.current.getCurrentTime();
        onTimeUpdate(Math.floor(time));
      }
    }, 300);
  };

  const stopPoll = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const changeRate = (rate: number) => {
    if (!playerRef.current) return;
    playerRef.current.setPlaybackRate(rate);
    setPlaybackRate(rate);
  };

  const rewind5 = () => {
    if (!playerRef.current) return;
    const cur = playerRef.current.getCurrentTime() || 0;
    playerRef.current.seekTo(Math.max(0, cur - 5), true);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  return (
    <div className="flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* 16:9 Video Canvas */}
      <div className="relative w-full pb-[56.25%] bg-black">
        <div id="youtube-player-frame" className="absolute top-0 left-0 w-full h-full" />
      </div>

      {/* Video Bar Controls */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>
          <button
            onClick={rewind5}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1"
            title="Rewind 5s (Instant Replay)"
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

        {/* Slow Motion Controls for Film Breakdown */}
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
