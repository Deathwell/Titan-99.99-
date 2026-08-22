import React from 'react';
import {
  ShieldAlert,
  Award,
  Zap,
  TrendingUp,
  Dumbbell,
  LineChart,
  Target,
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

export const HeroPercentile: React.FC = () => {
  const { composite, profile, setActiveTab } = useTitan();
  const { percentileGlobal, zGlobal, tier, percentilePhysique, zPhysique, percentileFinance, zFinance, weakestMetric } = composite;

  // SVG Gauge calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  // Map percentile 0-100 to stroke dash offset (with 100% being full ring)
  const strokeDashoffset = circumference - (percentileGlobal / 100) * circumference;

  const isTitan = percentileGlobal >= 99.0;
  const gapToTitan = Math.max(0, 99.0 - percentileGlobal);

  return (
    <div className="relative overflow-hidden rounded-xl border border-titan-cardBorder bg-titan-surface/90 p-6 shadow-2xl backdrop-blur-xl">
      {/* Background ambient tactical glows */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl transition-all duration-700"
        style={{ backgroundColor: tier.colorHex }}
      />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-titan-cyan/15 blur-3xl" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left / Center: Grand Circular Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center">
            {/* SVG Circular Progress Gauge */}
            <svg className="h-52 w-52 -rotate-90 transform" viewBox="0 0 200 200">
              {/* Background Ring */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              {/* 99% Titan Marker Ring Segment */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="stroke-purple-500/30"
                strokeWidth="12"
                strokeDasharray={`${circumference * 0.01} ${circumference * 0.99}`}
                strokeDashoffset={-(circumference * 0.99)}
                fill="transparent"
              />
              {/* Active Animated Progress Ring */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke={tier.colorHex}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out drop-shadow-md"
              />
            </svg>

            {/* Inner Gauge Text Telemetry */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold tracking-widest text-slate-400">
                GLOBAL RANK
              </span>
              <div className="flex items-baseline">
                <span
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-white drop-shadow-lg"
                  style={{ color: isTitan ? '#c084fc' : '#ffffff' }}
                >
                  {percentileGlobal.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-titan-cyan ml-0.5">%</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-300 font-mono">
                <span className="text-slate-500">Z-SCORE:</span>
                <span className="font-bold text-titan-cyan">
                  {zGlobal >= 0 ? `+${zGlobal.toFixed(2)}` : zGlobal.toFixed(2)}σ
                </span>
              </div>
            </div>
          </div>

          {/* Operator Tier Badge */}
          <div className="mt-3 flex flex-col items-center gap-1">
            <div className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider border flex items-center gap-1.5 ${tier.badgeClass}`}>
              <Award className="h-3.5 w-3.5" />
              <span>{tier.code} // {tier.name}</span>
            </div>
            <span className="text-[11px] text-slate-400 max-w-xs mt-1">
              {isTitan
                ? '⭐ TITAN PROTOCOL APEX ACHIEVED (Top 1.0% Global Operator)'
                : `${gapToTitan.toFixed(2)}% delta to Top 1% (99.00% TITAN threshold)`}
            </span>
          </div>
        </div>

        {/* Center: Dual-Dimension Breakdown Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Physique Dimension Card */}
          <div className="rounded-xl border border-titan-cardBorder bg-titan-card/60 p-4 relative overflow-hidden group hover:border-titan-cyan/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-700/50 text-titan-cyan">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300">PHYSIQUE CORE</h4>
                  <span className="text-[10px] text-slate-500">5 NORMATIVE VECTORS</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-titan-cyan">
                {percentilePhysique.toFixed(1)}%
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold font-mono text-white">
                  {zPhysique >= 0 ? `+${zPhysique.toFixed(2)}` : zPhysique.toFixed(2)}σ
                </span>
                <span className="text-[10px] text-slate-400 ml-1.5">Z-PHYSIQUE</span>
              </div>
              <button
                onClick={() => setActiveTab('physique')}
                className="text-[11px] text-titan-cyan hover:underline flex items-center gap-0.5"
              >
                Inspect <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            {/* Micro Progress Bar */}
            <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-titan-cyan h-full transition-all duration-700"
                style={{ width: `${percentilePhysique}%` }}
              />
            </div>
          </div>

          {/* Finance Dimension Card */}
          <div className="rounded-xl border border-titan-cardBorder bg-titan-card/60 p-4 relative overflow-hidden group hover:border-titan-emerald/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-titan-emerald">
                  <LineChart className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300">FINANCE MASTERY</h4>
                  <span className="text-[10px] text-slate-500">3 INSTITUTIONAL VECTORS</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-titan-emerald">
                {percentileFinance.toFixed(1)}%
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold font-mono text-white">
                  {zFinance >= 0 ? `+${zFinance.toFixed(2)}` : zFinance.toFixed(2)}σ
                </span>
                <span className="text-[10px] text-slate-400 ml-1.5">Z-FINANCE</span>
              </div>
              <button
                onClick={() => setActiveTab('finance')}
                className="text-[11px] text-titan-emerald hover:underline flex items-center gap-0.5"
              >
                Inspect <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            {/* Micro Progress Bar */}
            <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-titan-emerald h-full transition-all duration-700"
                style={{ width: `${percentileFinance}%` }}
              />
            </div>
          </div>

          {/* Weakest Link Diagnostic Alert */}
          {weakestMetric && (
            <div className="sm:col-span-2 rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-amber-500/20 text-amber-400">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-amber-400 tracking-wider">
                    PRIORITY VECTOR (WEAKEST LINK)
                  </div>
                  <div className="text-xs font-medium text-slate-200">
                    {weakestMetric.benchmark.label}: <strong className="text-amber-300 font-mono">{weakestMetric.percentile.toFixed(1)}th %ile</strong> (Z = {weakestMetric.zScore.toFixed(2)}σ)
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('curriculum')}
                className="px-2.5 py-1 text-[11px] font-bold rounded bg-amber-500 hover:bg-amber-400 text-black whitespace-nowrap transition-colors"
              >
                Train Now
              </button>
            </div>
          )}
        </div>

        {/* Right: Titan Benchmark Thresholds Box */}
        <div className="lg:col-span-3 rounded-xl border border-titan-cardBorder bg-slate-900/50 p-4 flex flex-col justify-between h-full text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-purple-400" /> TITAN STANDARDS (Top 1%)
            </span>
            <span className="text-[10px] font-mono text-purple-400">≥ 99.00%</span>
          </div>

          <div className="mt-3 space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">VO2 Max Target:</span>
              <span className="text-slate-200 font-bold">≥ 65.0 ml/kg/min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">1.5-Mile Run Target:</span>
              <span className="text-slate-200 font-bold">≤ 8:45 (525s)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Bench / Deadlift:</span>
              <span className="text-slate-200 font-bold">≥ 2.25x / 3.15x BW</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">LBO / DCF / Quant:</span>
              <span className="text-slate-200 font-bold">≥ 94 / 95 / 92 pts</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>Global Z Target: <strong className="text-purple-300">+2.326σ</strong></span>
            <span className="text-titan-cyan font-bold">1 in 100 Operative</span>
          </div>
        </div>
      </div>
    </div>
  );
};
