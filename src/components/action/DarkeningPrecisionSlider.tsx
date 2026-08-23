import React, { useState, useRef } from 'react';
import { Clock } from 'lucide-react';
import { soundEngine } from '../../lib/audio';

// Helper to format minutes into clean luxury readouts
export function formatDurationLabel(minutes: number): { time: string; xp: number; isMax: boolean } {
  const isMax = minutes >= 240;
  const xp = Math.floor(minutes * 1.5);

  if (minutes === 0) {
    return { time: '0m', xp: 0, isMax: false };
  }

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  let time = '';
  if (h > 0 && m > 0) {
    time = `${h}h ${m}m`;
  } else if (h > 0) {
    time = `${h}h 00m`;
  } else {
    time = `${m}m`;
  }

  return { time, xp, isMax };
}

// Compute dynamic DARKENING luminescence (gets darker & deeper as you slide forward)
export function getDarkeningLuminescence(value: number, accentColor: 'crimson' | 'gold') {
  const ratio = Math.max(0, Math.min(1, value / 240));
  const isCrimson = accentColor === 'crimson';
  const hue = isCrimson ? 348 : 42; // 348 = Velvet Crimson, 42 = Porsche Gold

  if (value === 0) {
    return {
      ratio: 0,
      lightness: 65,
      glowRadius: 0,
      primaryColor: '#71717a',
      fillGradient: 'rgba(255,255,255,0.06)',
      glowColor: 'transparent',
      thumbGlow: 'none',
      badgeBg: 'rgba(255,255,255,0.03)',
      badgeBorder: 'rgba(255,255,255,0.08)',
      badgeText: '#71717a'
    };
  }

  // Lightness starts bright (75%) and gets progressively DARKER down to deep dark (28%) as you slide forward!
  const lightness = Math.round(75 - ratio * 47); // 75% -> 28% (Visibly darkens as dragged!)
  const saturation = Math.round(85 + ratio * 15); // Saturation increases from 85% -> 100%
  const primaryColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const glowColor = `hsla(${hue}, 100%, ${lightness}%, ${0.4 + ratio * 0.4})`;
  const glowRadius = Math.round(3 + ratio * 14);

  // Gradient: transitions from lighter vibrant at the start to deep dark stealth tone at the thumb!
  const fillGradient = `linear-gradient(90deg, hsl(${hue}, 95%, 72%) 0%, hsl(${hue}, 100%, ${lightness}%) 100%)`;

  return {
    ratio,
    lightness,
    glowRadius,
    primaryColor,
    glowColor,
    fillGradient,
    thumbGlow: `0 0 ${glowRadius + 4}px ${glowColor}, 0 2px 6px rgba(0,0,0,0.9)`,
    badgeBg: `hsla(${hue}, 100%, 20%, 0.35)`,
    badgeBorder: `hsla(${hue}, 100%, ${lightness}%, 0.45)`,
    badgeText: `hsl(${hue}, 100%, ${Math.max(45, lightness + 15)}%)`
  };
}

export interface PrecisionSliderProps {
  value: number; // 0 to 240
  onChange: (val: number, clientX?: number, clientY?: number) => void;
  accentColor: 'crimson' | 'gold';
  title: string;
}

export const DarkeningPrecisionSlider: React.FC<PrecisionSliderProps> = ({
  value,
  onChange,
  accentColor,
  title
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastTickRef = useRef<number>(Math.floor(value / 15));
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = Math.min(100, Math.max(0, (value / 240) * 100));
  const { time, xp, isMax } = formatDurationLabel(value);
  const lum = getDarkeningLuminescence(value, accentColor);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseInt(e.target.value, 10);
    const snappedVal = Math.min(240, Math.max(0, rawVal));

    // Acoustic tick on 15-minute boundary crossing
    const current15mStep = Math.floor(snappedVal / 15);
    if (current15mStep !== lastTickRef.current) {
      lastTickRef.current = current15mStep;
      if (snappedVal > 0) {
        const pitchFactor = 0.8 + (snappedVal / 240) * 0.7;
        soundEngine.playSliderTick(pitchFactor);
      }
    }

    const rect = trackRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width * (snappedVal / 240) : window.innerWidth / 2;
    const y = rect ? rect.top : window.innerHeight / 2;
    onChange(snappedVal, x, y);
  };

  return (
    <div
      className="space-y-2 mt-3 pt-2.5 border-t border-white/[0.06] relative select-none"
      ref={trackRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      {/* Precision Telemetry Readout Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Clock
            className="h-3.5 w-3.5 transition-colors duration-150"
            style={{
              color: lum.primaryColor,
              filter: value > 0 ? `drop-shadow(0 0 4px ${lum.glowColor})` : 'none'
            }}
          />
          <span className="text-zinc-400 font-medium text-[11px]">Duration:</span>
          <span
            className="font-mono font-bold tracking-tight text-xs transition-colors duration-150"
            style={{
              color: lum.primaryColor,
              textShadow: value > 0 ? `0 0 ${lum.glowRadius / 2}px ${lum.glowColor}` : 'none'
            }}
          >
            {time}
          </span>
          {isMax && (
            <span className="px-1.5 py-0.2 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono font-bold text-[8px] uppercase tracking-widest animate-pulse shadow-sm">
              4H MAX
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 font-mono">
          <span
            className="px-2 py-0.5 rounded-md border font-semibold text-[10px] transition-all duration-150"
            style={{
              backgroundColor: lum.badgeBg,
              borderColor: lum.badgeBorder,
              color: lum.badgeText,
              boxShadow: value > 0 ? `0 0 ${lum.glowRadius / 2}px ${lum.glowColor}` : 'none'
            }}
          >
            +{xp} XP
          </span>
        </div>
      </div>

      {/* Darkening Laser Slider Capsule */}
      <div className="relative py-2 flex items-center group">
        {/* Floating Minimalist Telemetry Pill */}
        {(isHovered || isDragging) && (
          <div
            className="absolute bottom-full mb-1.5 -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-[#121218]/95 border backdrop-blur-md shadow-2xl pointer-events-none text-[10px] font-mono font-bold whitespace-nowrap z-30 transition-opacity duration-150"
            style={{
              borderColor: lum.badgeBorder,
              boxShadow: `0 4px 14px rgba(0,0,0,0.8), 0 0 ${lum.glowRadius}px ${lum.glowColor}`
            }}
          >
            <span style={{ color: lum.primaryColor }}>{time}</span>
            <span className="text-zinc-500 mx-1">•</span>
            <span className="text-white">+{xp} XP</span>
          </div>
        )}

        {/* 5px Recessed Dark Track */}
        <div className="relative w-full h-1.5 rounded-full bg-black/60 border border-white/[0.08] overflow-hidden shadow-inner">
          {/* Active Liquid Laser Fill with Darkening Gradient */}
          <div
            className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-75"
            style={{
              width: `${percentage}%`,
              background: lum.fillGradient,
              boxShadow: value > 0 ? `0 0 ${lum.glowRadius}px ${lum.glowColor}` : 'none'
            }}
          />
        </div>

        {/* Native Range Input for 60fps Scrubbing */}
        <input
          type="range"
          min="0"
          max="240"
          step="5"
          value={value}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchEnd={() => setIsDragging(false)}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          title={`Set ${title} duration`}
        />

        {/* Darkening Dial Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -ml-2 h-4 w-4 rounded-full pointer-events-none transition-transform duration-75 flex items-center justify-center z-10"
          style={{
            left: `${percentage}%`,
            background:
              'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 45%, #475569 100%)',
            border: `1.5px solid ${value > 0 ? lum.primaryColor : 'rgba(255,255,255,0.3)'}`,
            boxShadow: lum.thumbGlow
          }}
        >
          <div
            className="h-1.5 w-1.5 rounded-full transition-colors duration-150"
            style={{
              backgroundColor: lum.primaryColor,
              boxShadow: value > 0 ? `0 0 4px ${lum.glowColor}` : 'none'
            }}
          />
        </div>
      </div>

      {/* Crisp Linear Hour Ticks */}
      <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 px-0.5">
        <span className={value === 0 ? 'text-white font-medium' : ''}>0h</span>
        <span
          style={{
            color: value >= 60 && value < 120 ? lum.primaryColor : undefined,
            fontWeight: value >= 60 && value < 120 ? 'bold' : 'normal'
          }}
        >
          1h
        </span>
        <span
          style={{
            color: value >= 120 && value < 180 ? lum.primaryColor : undefined,
            fontWeight: value >= 120 && value < 180 ? 'bold' : 'normal'
          }}
        >
          2h
        </span>
        <span
          style={{
            color: value >= 180 && value < 240 ? lum.primaryColor : undefined,
            fontWeight: value >= 180 && value < 240 ? 'bold' : 'normal'
          }}
        >
          3h
        </span>
        <span
          style={{
            color: isMax ? lum.primaryColor : undefined,
            fontWeight: isMax ? 'bold' : 'normal',
            textShadow: isMax ? `0 0 6px ${lum.glowColor}` : 'none'
          }}
        >
          4h MAX
        </span>
      </div>
    </div>
  );
};
