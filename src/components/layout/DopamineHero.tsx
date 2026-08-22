import React from 'react';
import {
  Flame,
  Award,
  Zap,
  TrendingUp,
  Target,
  Shield,
  Sparkles,
  Globe2,
  Users,
  Swords,
  ChevronRight
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { formatLargeNumber } from '../../lib/statsEngine';
import { CountUpNumber } from '../effects/CountUpNumber';
import { triggerGlobalConfetti } from '../effects/ConfettiCanvas';

export const DopamineHero: React.FC = () => {
  const { composite, profile, setActiveTab } = useTitan();
  const {
    percentileGlobal,
    tier,
    percentilePhysique,
    percentileFinance,
    humansDefeated,
    humansRemaining
  } = composite;

  const isTitan = percentileGlobal >= 99.0;
  const topPercent = Math.max(0.01, 100 - percentileGlobal);

  // SVG circular reactor parameters
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentileGlobal / 100) * circumference;

  const handleHeroClick = (e: React.MouseEvent) => {
    triggerGlobalConfetti(e.clientX, e.clientY);
  };

  return (
    <div
      onClick={handleHeroClick}
      className="social-card relative overflow-hidden p-6 sm:p-8 cursor-pointer group select-none"
    >
      {/* Specular Light Sheen */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" />

      {/* Ambient Pulsing Aurora */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full opacity-20 blur-3xl transition-all duration-700 animate-pulse"
        style={{ backgroundColor: tier.colorHex }}
      />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Instagram Story-Style Percentile Ring Core */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center">
            {/* Pulsing Iridescent Outer Glow Ring */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-400 opacity-30 blur-md group-hover:opacity-50 transition-opacity animate-pulse" />

            {/* SVG Reactor Gauge */}
            <svg className="h-56 w-56 -rotate-90 transform drop-shadow-2xl" viewBox="0 0 220 220">
              {/* Outer Track */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                className="stroke-white/[0.06]"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Active Animated Progress Arc */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke="url(#hero-gradient)"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="50%" stopColor="#8a2be2" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Core Typography */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                GLOBAL PERCENTILE
              </span>
              <div className="flex items-baseline my-0.5">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
                  <CountUpNumber end={percentileGlobal} decimals={1} suffix="%" />
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-white/[0.08] text-[11px] font-bold text-cyan-300">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>TOP <CountUpNumber end={topPercent} decimals={1} suffix="%" /></span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider border shadow-sm"
              style={{
                backgroundColor: `${tier.colorHex}20`,
                borderColor: `${tier.colorHex}60`,
                color: tier.colorHex
              }}
            >
              {tier.name.toUpperCase()} TIER
            </span>
          </div>
        </div>

        {/* Right: Addictive Micro-Cards (Humans Defeated & Multi-Axis Status) */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Users className="h-4 w-4 text-cyan-400" /> PLANETARY OUTRANK PROGRESS
              </span>
              <span className="font-mono text-cyan-300 font-bold">
                <CountUpNumber end={humansDefeated / 1000000} decimals={2} suffix="M" /> Defeated
              </span>
            </div>

            {/* Glowing Multi-Segment Progress Bar */}
            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/[0.06] p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 transition-all duration-1000"
                style={{ width: `${percentileGlobal}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>0 (Global Baseline)</span>
              <span>8.1 Billion Humans</span>
            </div>
          </div>

          {/* 2 Asymmetric Bento Status Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Physique Status Chip */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('physique');
              }}
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all group/chip"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Physique Percentile</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover/chip:translate-x-1 transition-transform" />
              </div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                <CountUpNumber end={percentilePhysique} decimals={1} suffix="%" />
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Top {(100 - percentilePhysique).toFixed(1)}% of humans
              </span>
            </div>

            {/* Finance Status Chip */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('finance');
              }}
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all group/chip"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Finance Percentile</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover/chip:translate-x-1 transition-transform" />
              </div>
              <div className="text-xl font-bold text-amber-400 font-mono mt-1">
                <CountUpNumber end={percentileFinance} decimals={1} suffix="%" />
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Top {(100 - percentileFinance).toFixed(1)}% of wealth
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
