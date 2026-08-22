import React from 'react';
import {
  Flame,
  Award,
  Zap,
  TrendingUp,
  Target,
  Shield,
  Clock,
  Sparkles,
  AlertTriangle,
  Globe2,
  Users,
  Swords
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { formatLargeNumber } from '../../lib/statsEngine';

export const DopamineHero: React.FC = () => {
  const { composite, profile } = useTitan();
  const {
    percentileGlobal,
    zGlobal,
    tier,
    percentilePhysique,
    percentileFinance,
    humansDefeated,
    humansRemaining
  } = composite;

  const isTitan = percentileGlobal >= 99.0;
  const gapToTitan = Math.max(0, 99.0 - percentileGlobal);

  // SVG circular reactor parameters
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentileGlobal / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-titan-cardBorder bg-gradient-to-b from-titan-surface/95 via-titan-surface/80 to-titan-bg p-6 sm:p-8 shadow-2xl backdrop-blur-2xl font-mono">
      {/* Background neon ambient pulse */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl transition-all duration-700 animate-pulse-slow"
        style={{ backgroundColor: tier.colorHex }}
      />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-titan-cyan/20 blur-3xl" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Giant Pulsing Cybernetic Percentile Core */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center">
            {/* SVG Reactor Gauge */}
            <svg className="h-60 w-60 -rotate-90 transform drop-shadow-2xl" viewBox="0 0 220 220">
              {/* Outer Glow Ring */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                className="stroke-slate-800/80"
                strokeWidth="14"
                fill="transparent"
              />
              {/* Titan 99% Apex marker segment */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                className="stroke-purple-500/40"
                strokeWidth="14"
                strokeDasharray={`${circumference * 0.01} ${circumference * 0.99}`}
                strokeDashoffset={-(circumference * 0.99)}
                fill="transparent"
              />
              {/* Active Animated Progress Arc */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke={tier.colorHex}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: `drop-shadow(0 0 10px ${tier.colorHex}80)`
                }}
              />
            </svg>

            {/* Inner Core Hologram */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[11px] font-extrabold tracking-widest text-slate-400">
                GLOBAL RANKING
              </span>
              <div className="flex items-baseline my-0.5">
                <span
                  className="text-4xl sm:text-5xl font-black tracking-tight font-mono drop-shadow-lg text-white"
                  style={{ color: isTitan ? '#c084fc' : '#ffffff' }}
                >
                  {percentileGlobal.toFixed(1)}
                </span>
                <span className="text-lg font-extrabold text-titan-cyan ml-0.5">%</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="text-slate-500">Z-INDEX:</span>
                <span className="font-bold text-titan-cyan">
                  {zGlobal >= 0 ? `+${zGlobal.toFixed(2)}` : zGlobal.toFixed(2)}σ
                </span>
              </div>
            </div>
          </div>

          {/* Operator Tier Banner */}
          <div className="mt-4 flex flex-col items-center gap-1.5">
            <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider border flex items-center gap-2 shadow-lg ${tier.badgeClass}`}>
              <Award className="h-4 w-4" />
              <span>{tier.code} // {tier.name}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs font-sans mt-1">
              {isTitan
                ? '⭐ Top 1.0% Global Apex: Dual-Domain Supremacy Unlocked'
                : `Top ${(100 - percentileGlobal).toFixed(1)}% of population. Only ${gapToTitan.toFixed(1)}% away from TITAN Apex.`}
            </p>
          </div>
        </div>

        {/* Right: Dual-Core Power Cells & Planetary Humans Defeated Telemetry */}
        <div className="lg:col-span-7 space-y-4">
          {/* Dual Domain Quick Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Physique Power Cell */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 relative overflow-hidden group hover:border-titan-cyan transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  🏃 PHYSIQUE CORE
                </span>
                <span className="text-sm font-bold text-white">
                  {percentilePhysique.toFixed(1)}%ile
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between text-xs">
                <span className="text-slate-400">Cooper Clinic / PST Norms</span>
                <span className="text-titan-cyan font-bold">Z = +{composite.zPhysique.toFixed(2)}σ</span>
              </div>
              <div className="mt-2 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-titan-cyan h-full transition-all duration-700"
                  style={{ width: `${percentilePhysique}%` }}
                />
              </div>
            </div>

            {/* Finance Power Cell */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 relative overflow-hidden group hover:border-titan-emerald transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  📊 FINANCE MASTERY
                </span>
                <span className="text-sm font-bold text-white">
                  {percentileFinance.toFixed(1)}%ile
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between text-xs">
                <span className="text-slate-400">Wall St / Quant Desks</span>
                <span className="text-titan-emerald font-bold">Z = +{composite.zFinance.toFixed(2)}σ</span>
              </div>
              <div className="mt-2 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-titan-emerald h-full transition-all duration-700"
                  style={{ width: `${percentileFinance}%` }}
                />
              </div>
            </div>
          </div>

          {/* 🌍 PLANETARY SCALE: HUMANS DEFEATED TELEMETRY */}
          <div className="rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-purple-950/40 p-4 relative overflow-hidden shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-titan-cyan animate-spin-slow" />
                <span className="text-xs font-extrabold text-white tracking-wider">
                  EARTH POPULATION CONQUEST SCALE (8.0 BILLION HUMANS)
                </span>
              </div>
              <span className="text-[10px] text-cyan-300 font-bold">
                TOP {(100 - percentileGlobal).toFixed(2)}% APEX RANK
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div>
                <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-emerald-400" /> HUMANS OUTRANKED / DEFEATED:
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 font-mono">
                  {formatLargeNumber(humansDefeated)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  ({percentileGlobal.toFixed(2)}% of world population outranked)
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <Swords className="h-3.5 w-3.5 text-amber-400" /> OPERATORS REMAINING AHEAD:
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5 font-mono">
                  {formatLargeNumber(humansRemaining)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  (Only top {(100 - percentileGlobal).toFixed(2)}% remaining on Earth)
                </div>
              </div>
            </div>

            {/* Earth Conquest Progress Bar */}
            <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-titan-cyan via-titan-emerald to-purple-500 h-full transition-all duration-700"
                style={{ width: `${percentileGlobal}%` }}
              />
            </div>
          </div>

          {/* High-Stakes Discipline Streak Box */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                <Flame className="h-5 w-5 fill-amber-400 animate-bounce" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                  <span>DISCIPLINE STREAK: {profile.streakDays} CONSECUTIVE DAYS</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-900 text-amber-200 text-[10px]">
                    1.2x XP Multiplier
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                  Rule of Decay: <strong>1 Missed Day = 1 Day of Previous Gains Erased</strong>. Log today's mission to keep gains locked permanently!
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span className="px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> TODAY ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
