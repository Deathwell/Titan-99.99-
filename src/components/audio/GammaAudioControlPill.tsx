import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  ChevronDown,
  Play,
  Pause,
  Disc3,
  Sparkles
} from 'lucide-react';
import { gammaAudioEngine } from '../../lib/gammaAudioEngine';
import { soundEngine } from '../../lib/audio';

export const GammaAudioControlPill: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(gammaAudioEngine.getIsPlaying());
  const [volume, setVolume] = useState<number>(gammaAudioEngine.getVolume());
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = gammaAudioEngine.subscribe(playing => {
      setIsPlaying(playing);
    });
    return () => unsub();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nowPlaying = gammaAudioEngine.toggle();
    if (nowPlaying) {
      soundEngine.playClick(900);
    } else {
      soundEngine.playClick(600);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    gammaAudioEngine.setVolume(newVol);
  };

  return (
    <div className="relative font-sans select-none" ref={dropdownRef}>
      {/* HUD Pill Button */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all ${
            isPlaying
              ? 'bg-amber-950/70 border-amber-400 text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.4)] animate-pulse-slow'
              : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
          }`}
          title="Play/Pause Hans Zimmer Cornfield Chase (40Hz Gamma)"
        >
          {isPlaying ? (
            <>
              {/* Animated Live Equalizer Waveform Bars */}
              <div className="flex items-end gap-0.5 h-3 w-3">
                <span className="w-0.5 bg-amber-400 rounded-full animate-wave-1" />
                <span className="w-0.5 bg-yellow-200 rounded-full animate-wave-2" />
                <span className="w-0.5 bg-amber-400 rounded-full animate-wave-3" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-wider flex items-center gap-1">
                <Disc3 className="h-3 w-3 text-amber-400 animate-spin" />
                <span>CORNFIELD CHASE</span>
              </span>
            </>
          ) : (
            <>
              <Disc3 className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-[11px] tracking-wider">CORNFIELD CHASE</span>
            </>
          )}
        </button>

        {/* Dropdown Options Trigger */}
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className={`p-1 rounded-lg border transition-all ${
            isOpen
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white'
          }`}
          title="Configure Cornfield Chase Volume"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/15 bg-[#090b12]/98 p-4 shadow-2xl backdrop-blur-2xl z-50 space-y-3.5 text-xs text-white animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2">
              <Disc3 className="h-4 w-4 text-amber-400" />
              <span className="font-mono font-bold text-xs tracking-wider text-white">
                CORNFIELD CHASE // 40Hz
              </span>
            </div>
            <span className="text-[9px] font-mono text-amber-400 px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-500/30 font-bold">
              {isPlaying ? 'PLAYING' : 'PAUSED'}
            </span>
          </div>

          {/* Quick Play/Pause Big Button */}
          <button
            onClick={handleToggle}
            className={`w-full py-2.5 px-3 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isPlaying
                ? 'bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300'
                : 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg shadow-amber-900/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Pause Soundtrack</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Play Cornfield Chase (Instant)</span>
              </>
            )}
          </button>

          {/* Volume Control */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1">
                {volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-amber-400" />}
                <span>Soundtrack Volume:</span>
              </span>
              <span className="text-white font-bold">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.9"
              step="0.02"
              value={volume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
          </div>

          {/* Scientific Info Note */}
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[10px] text-zinc-400 font-sans leading-relaxed">
            <span className="text-amber-300 font-bold font-mono block mb-0.5">🪐 Authentic Hans Zimmer Master:</span>
            Streams the real London Temple Church pipe organ & orchestra with embedded 40.0 Hz sub-bass focus frequencies.
          </div>
        </div>
      )}
    </div>
  );
};
