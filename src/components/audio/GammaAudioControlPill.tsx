import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Volume2,
  VolumeX,
  Sliders,
  ChevronDown,
  Sparkles,
  Brain,
  Info,
  Radio,
  Play,
  Pause
} from 'lucide-react';
import { gammaAudioEngine, GammaPreset, GAMMA_PRESETS } from '../../lib/gammaAudioEngine';
import { soundEngine } from '../../lib/audio';

export const GammaAudioControlPill: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(gammaAudioEngine.getIsPlaying());
  const [volume, setVolume] = useState<number>(gammaAudioEngine.getVolume());
  const [preset, setPreset] = useState<GammaPreset>(gammaAudioEngine.getPreset());
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

  const handlePresetSelect = (p: GammaPreset) => {
    setPreset(p);
    gammaAudioEngine.setPreset(p);
    soundEngine.playClick(850);
  };

  return (
    <div className="relative font-sans select-none" ref={dropdownRef}>
      {/* HUD Pill Button */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-all ${
            isPlaying
              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse-slow'
              : 'bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
          }`}
          title="Toggle 40Hz Gamma Focus Audio"
        >
          {isPlaying ? (
            <>
              {/* Animated Live Equalizer Waveform Bars */}
              <div className="flex items-end gap-0.5 h-3 w-3">
                <span className="w-0.5 bg-emerald-400 rounded-full animate-wave-1" />
                <span className="w-0.5 bg-cyan-300 rounded-full animate-wave-2" />
                <span className="w-0.5 bg-emerald-400 rounded-full animate-wave-3" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-wider">40Hz FLOW</span>
            </>
          ) : (
            <>
              <Zap className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-[11px] tracking-wider">40Hz OFF</span>
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
          title="Configure 40Hz Soundscape"
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
              <Brain className="h-4 w-4 text-cyan-400" />
              <span className="font-mono font-bold text-xs tracking-wider text-white">
                40Hz GAMMA SOUNDSCAPE
              </span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30">
              {isPlaying ? 'ACTIVE' : 'MUTED'}
            </span>
          </div>

          {/* Quick Play/Pause Big Button */}
          <button
            onClick={handleToggle}
            className={`w-full py-2.5 px-3 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isPlaying
                ? 'bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300'
                : 'bg-gradient-to-r from-cyan-600 via-emerald-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-lg'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Pause 40Hz Background Stream</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Engage Continuous 40Hz Hum</span>
              </>
            )}
          </button>

          {/* Volume Control */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1">
                {volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-cyan-400" />}
                <span>Ambient Volume:</span>
              </span>
              <span className="text-white font-bold">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.02"
              value={volume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
          </div>

          {/* Preset Soundscapes */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
              SELECT SOUNDSCAPE FREQUENCY:
            </span>
            <div className="space-y-1.5">
              {(Object.keys(GAMMA_PRESETS) as GammaPreset[]).map(p => {
                const isSelected = preset === p;
                const config = GAMMA_PRESETS[p];
                return (
                  <button
                    key={p}
                    onClick={() => handlePresetSelect(p)}
                    className={`w-full p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="font-mono font-bold text-[11px] block">{config.name}</span>
                    <span className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5 font-sans">
                      {config.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scientific Info Note */}
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[10px] text-zinc-400 font-sans leading-relaxed">
            <span className="text-cyan-300 font-bold font-mono block mb-0.5">🎵 Procedural Ambient Harmonic Music:</span>
            Synthesizes evolving D-Minor ambient pads & glass chimes with embedded 40Hz gamma brainwave pulses for deep prefrontal focus.
          </div>
        </div>
      )}
    </div>
  );
};
