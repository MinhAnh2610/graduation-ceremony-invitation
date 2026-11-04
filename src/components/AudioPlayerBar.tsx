import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  Tv,
  Radio,
  Sliders
} from 'lucide-react';

interface AudioPlayerBarProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  accentColor?: string;
  onJumpToDrop?: () => void;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  isPlaying,
  setIsPlaying,
  accentColor = '#00f0ff'
}) => {
  const [playerReady, setPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(32);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);

  const VIDEO_ID = 'jK2aIUmmdP4';
  const START_SECOND = 32;

  // Initialize YouTube Player API
  useEffect(() => {
    // If API script is not yet present, inject it
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        playerRef.current = new window.YT.Player('yt-hidden-player', {
          height: '180',
          width: '320',
          videoId: VIDEO_ID,
          playerVars: {
            autoplay: 0,
            start: START_SECOND,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            loop: 1,
            playlist: VIDEO_ID,
            enablejsapi: 1
          },
          events: {
            onReady: (event: any) => {
              setPlayerReady(true);
              event.target.setVolume(volume);
              event.target.seekTo(START_SECOND, true);
            },
            onStateChange: (event: any) => {
              if (window.YT && window.YT.PlayerState) {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  setIsPlaying(true);
                } else if (
                  event.data === window.YT.PlayerState.PAUSED ||
                  event.data === window.YT.PlayerState.ENDED
                ) {
                  setIsPlaying(false);
                }
              }
            }
          }
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Poll current playback time when playing
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const t = Math.floor(playerRef.current.getCurrentTime());
            if (!isNaN(t)) setCurrentTime(t);
          } catch {
            // Ignore cross-origin transient states
          }
        }
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setHasInteracted(true);
    if (!playerRef.current) {
      setIsPlaying(!isPlaying);
      return;
    }

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        if (playerRef.current.isMuted && playerRef.current.isMuted()) {
          playerRef.current.unMute();
          setIsMuted(false);
        }
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying(!isPlaying);
    }
  };

  const jumpToDrop = () => {
    setHasInteracted(true);
    setCurrentTime(START_SECOND);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(START_SECOND, true);
        if (!isPlaying) {
          playerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch {
        // Fallback
      }
    } else {
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(newVal);
        if (newVal === 0) {
          playerRef.current.mute();
          setIsMuted(true);
        } else if (isMuted) {
          playerRef.current.unMute();
          setIsMuted(false);
        }
      } catch {
        // ignore
      }
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch {
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* Hidden YouTube Iframe for Audio Playback */}
      <div className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
        <div id="yt-hidden-player" />
      </div>

      {/* Floating Bottom Audio Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40">
        <div className="glass-panel-glow rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center justify-between gap-3 sm:gap-4 border border-cyan-500/30">
          {/* Left: Track Info & Waveform indicator */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                isPlaying ? 'bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-400/50 scale-105' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Radio className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-none">
                  Different Heaven & EH!DE - My Heart
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-950/80 text-orange-400 border border-orange-500/40 shrink-0 font-medium">
                  Anthem
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span className="font-mono text-cyan-400">{formatTime(currentTime)}</span>
                <span>/</span>
                <span className="text-orange-300">Drop starts at 0:32</span>
              </div>
            </div>
          </div>

          {/* Center: Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Jump to Drop 0:32 button */}
            <button
              onClick={jumpToDrop}
              className="px-2.5 py-1.5 text-xs font-medium text-cyan-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-cyan-500/20 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
              title="Jump directly to second 32 (The Drop)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Drop 0:32</span>
            </button>

            {/* Play / Pause Primary Button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 flex items-center justify-center shadow-lg shadow-cyan-500/25 transition-all cursor-pointer shrink-0 font-bold"
              aria-label={isPlaying ? 'Pause music' : 'Play ceremony song'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-slate-950 fill-current" />
              ) : (
                <Play className="w-5 h-5 text-slate-950 fill-current ml-0.5" />
              )}
            </button>
          </div>

          {/* Right: Volume & Video Modal Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Volume slider for desktop */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-slate-300" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-16 h-1.5 accent-cyan-400 bg-slate-700 rounded-lg cursor-pointer"
                aria-label="Volume slider"
              />
            </div>

            {/* Video Popout Button */}
            <button
              onClick={() => setShowVideoModal(true)}
              className="p-2 text-slate-400 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Watch full YouTube music video"
            >
              <Tv className="w-4 h-4" />
            </button>

            {/* External link to original YouTube link */}
            <a
              href="https://www.youtube.com/watch?v=jK2aIUmmdP4&list=RDjK2aIUmmdP4&start_radio=1"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Open video on YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Video Modal if user wants to watch YouTube player directly */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 w-full max-w-3xl shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  Ceremony Anthem Video
                </h3>
                <p className="text-xs text-orange-400">
                  Different Heaven & EH!DE - My Heart [NCS Release] (0:32 Drop)
                </p>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?start=${START_SECOND}&autoplay=1&rel=0`}
                title="Different Heaven & EH!DE - My Heart"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Selected for celebration drop excitement.</span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-cyan-400 hover:underline"
              >
                Back to Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
