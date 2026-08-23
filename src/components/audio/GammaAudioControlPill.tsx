import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sliders,
  ChevronDown
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

  // Close popover on outside click
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
      <div className="flex items-center gap-1">
        {/* Sleek Minimalist Music Button */}
        <button
          onClick={handleToggle}
          className={`flex items-center justify-center h-8 w-8 rounded-xl border transition-all ${
            isPlaying
              ? 'bg-amber-950/80 border-amber-400/80 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.35)] hover:border-amber-300'
              : 'bg-white/[0.03] border-white/[0.08] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]'
          }`}
          title={isPlaying ? 'Mute 40Hz Audio' : 'Play 40Hz Audio'}
        >
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3.5 w-3.5 justify-center">
              <span className="w-0.5 bg-amber-400 rounded-full animate-wave-1" />
              <span className="w-0.5 bg-yellow-200 rounded-full animate-wave-2" />
              <span className="w-0.5 bg-amber-400 rounded-full animate-wave-3" />
            </div>
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </button>

        {/* Mini Volume Popover Trigger */}
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className={`h-8 px-1 rounded-lg border transition-all flex items-center justify-center ${
            isOpen
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white'
          }`}
          title="Soundtrack Volume"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Compact Volume Control Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/15 bg-[#090b12]/98 p-3.5 shadow-2xl backdrop-blur-2xl z-50 space-y-3 text-xs text-white animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-300 font-bold">
              <Music className="h-3.5 w-3.5 text-amber-400" />
              <span>40Hz FOCUS AUDIO</span>
            </div>
            <span className="text-[9px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 font-bold">
              {isPlaying ? 'ACTIVE' : 'MUTED'}
            </span>
          </div>

          {/* Quick Play/Mute Button */}
          <button
            onClick={handleToggle}
            className={`w-full py-2 px-3 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isPlaying
                ? 'bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300'
                : 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg shadow-amber-900/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Mute Soundtrack</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Unmute Soundtrack</span>
              </>
            )}
          </button>

          {/* Volume Slider */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1">
                {volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-amber-400" />}
                <span>Volume:</span>
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
        </div>
      )}
    </div>
  );
};
