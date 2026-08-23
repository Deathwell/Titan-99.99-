import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Dumbbell,
  LineChart,
  ShieldAlert,
  Flame,
  Calendar,
  Sparkles,
  Zap,
  Activity,
  HeartPulse,
  DollarSign,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { monteCarloEngine, MonteCarloConfig } from '../../lib/monteCarloEngine';
import { soundEngine } from '../../lib/audio';

export const MonteCarloOracleView: React.FC = () => {
  const { profile } = useTitan();

  const [workoutMin, setWorkoutMin] = useState<number>(60);
  const [financeMin, setFinanceMin] = useState<number>(60);
  const [consistency, setConsistency] = useState<number>(90);
  const [horizonYears, setHorizonYears] = useState<number>(3);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const config: MonteCarloConfig = useMemo(() => ({
    currentXP: profile.xp || 0,
    currentStreakDays: profile.streakDays || 0,
    dailyWorkoutMinutes: workoutMin,
    dailyFinanceMinutes: financeMin,
    streakConsistencyPercent: consistency,
    horizonYears
  }), [profile.xp, profile.streakDays, workoutMin, financeMin, consistency, horizonYears]);

  const simulation = useMemo(() => {
    return monteCarloEngine.runSimulation(config);
  }, [config]);

  const { timeline, milestones, timeToTop01PercentDays, timeToTop01PercentDate, probabilityOfTop01Percent, velocityMultiplier } = simulation;

  // Chart Dimension Calculations
  const chartWidth = 700;
  const chartHeight = 260;
  const padding = { top: 25, right: 30, bottom: 35, left: 60 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxRank = 8_150_000_000;
  const minRank = 8_150_000;

  // Convert Rank to Y position (Inverted log scale: Top rank at the top!)
  const getY = (rank: number) => {
    const logMax = Math.log10(maxRank);
    const logMin = Math.log10(minRank);
    const logVal = Math.log10(Math.max(minRank, rank));
    // Normalize: logMin -> 0 (top), logMax -> 1 (bottom)
    const norm = (logVal - logMin) / (logMax - logMin);
    return padding.top + norm * innerHeight;
  };

  const getX = (index: number) => {
    return padding.left + (index / Math.max(1, timeline.length - 1)) * innerWidth;
  };

  // Build SVG Paths
  const p50Points = timeline.map((pt, i) => `${getX(i)},${getY(pt.p50Rank)}`).join(' ');
  const p10Points = timeline.map((pt, i) => `${getX(i)},${getY(pt.p10Rank)}`).join(' ');
  const p90Points = timeline.map((pt, i) => `${getX(i)},${getY(pt.p90Rank)}`).reverse().join(' ');
  const areaPolygon = `${timeline.map((pt, i) => `${getX(i)},${getY(pt.p10Rank)}`).join(' ')} ${p90Points}`;

  const hoveredPoint = hoveredIndex !== null ? timeline[hoveredIndex] : timeline[timeline.length - 1];

  return (
    <div className="space-y-6 font-sans select-none animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0b0c12]/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-rose-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Sparkles className="h-6 w-6 stroke-[2.2] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40">
                  STOCHASTIC QUANTITATIVE ENGINE
                </span>
                <span className="text-xs font-mono font-bold text-zinc-400">
                  10,000 MONTE CARLO PATHS
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white mt-0.5">
                The Oracle: 10-Year Trajectory Simulator
              </h2>
            </div>
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center p-1 rounded-xl bg-black/50 border border-white/10 text-xs font-mono">
            {[1, 3, 5, 10].map(yr => (
              <button
                key={yr}
                onClick={() => {
                  setHorizonYears(yr);
                  soundEngine.playClick(800);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  horizonYears === yr
                    ? 'bg-gradient-to-r from-cyan-600 to-rose-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {yr}Y
              </button>
            ))}
          </div>
        </div>

        {/* Hero Trajectory Analytics KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Time to Top 0.1% */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-black border border-cyan-500/30 space-y-1">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-cyan-400" />
              <span>TIME TO TOP 0.1% BREACH:</span>
            </span>
            <div className="text-lg font-black text-white font-mono">
              {timeToTop01PercentDays ? `${timeToTop01PercentDays} Days` : 'Trajectory Slower'}
            </div>
            <span className="text-[11px] text-zinc-400 font-mono block">
              {timeToTop01PercentDate ? `Target: ${timeToTop01PercentDate}` : 'Requires >45m/day pace'}
            </span>
          </div>

          {/* 2. Velocity Multiplier */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/40 to-black border border-rose-500/30 space-y-1">
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-rose-400" />
              <span>VELOCITY MULTIPLIER:</span>
            </span>
            <div className="text-lg font-black text-white font-mono">
              {velocityMultiplier}x Baseline
            </div>
            <span className="text-[11px] text-zinc-400 font-mono block">
              Faster than 99.8% of humans
            </span>
          </div>

          {/* 3. Biological Longevity Hazard Reduction */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-black border border-emerald-500/30 space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
              <HeartPulse className="h-3.5 w-3.5 text-emerald-400" />
              <span>MORTALITY HAZARD REDUCTION:</span>
            </span>
            <div className="text-lg font-black text-emerald-300 font-mono">
              -{simulation.mortalityRiskReductionMax}% Hazard
            </div>
            <span className="text-[11px] text-zinc-400 font-mono block">
              Cardiovascular & metabolic defense
            </span>
          </div>

          {/* 4. Capital Compounding Factor */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 to-black border border-amber-500/30 space-y-1">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-amber-400" />
              <span>CAPITAL ALPHA MULTIPLIER:</span>
            </span>
            <div className="text-lg font-black text-amber-300 font-mono">
              {simulation.capitalMultiplierMax}x Compounding
            </div>
            <span className="text-[11px] text-zinc-400 font-mono block">
              Based on quantitative mastery
            </span>
          </div>
        </div>

        {/* Interactive Sensitivity Sliders */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-4">
          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
            ADJUST QUANTITATIVE DAILY SENSITIVITY VARIABLES:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            {/* Workout Minutes */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-300 flex items-center gap-1">
                  <Dumbbell className="h-3 w-3 text-rose-400" /> Physical Training:
                </span>
                <span className="text-rose-400 font-bold">{workoutMin} min / day</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="15"
                value={workoutMin}
                onChange={e => setWorkoutMin(parseInt(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Finance Modeling Minutes */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-300 flex items-center gap-1">
                  <LineChart className="h-3 w-3 text-amber-400" /> Finance Modeling:
                </span>
                <span className="text-amber-400 font-bold">{financeMin} min / day</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                step="15"
                value={financeMin}
                onChange={e => setFinanceMin(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Streak Consistency Factor */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-300 flex items-center gap-1">
                  <Flame className="h-3 w-3 text-cyan-400" /> Streak Reliability:
                </span>
                <span className="text-cyan-400 font-bold">{consistency}% Days</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={consistency}
                onChange={e => setConsistency(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SVG Multi-Band Probabilistic Fan Chart */}
        <div className="p-4 rounded-xl bg-black/60 border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
            <span className="font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>PROBABILISTIC GLOBAL SPECIES FAN (8.15B $\to$ 8.15M APEX)</span>
            </span>
            <div className="flex items-center gap-3 text-[10px] text-zinc-400">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span>P50 Expected Median</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-4 rounded bg-cyan-500/20 border border-cyan-500/40" />
                <span>P10–P90 Range</span>
              </span>
            </div>
          </div>

          {/* Chart Container */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full min-w-[550px] h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="corridorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.05" />
                </linearGradient>

                <linearGradient id="medianLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[
                { rank: 8_150_000_000, label: '8.15B (Bottom 0.01%)' },
                { rank: 815_000_000, label: '815M (Top 10%)' },
                { rank: 81_500_000, label: '81.5M (Top 1%)' },
                { rank: 8_150_000, label: '8.15M (Top 0.1% Apex)' }
              ].map((grid, idx) => {
                const y = getY(grid.rank);
                return (
                  <g key={idx}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#71717a"
                      fontFamily="monospace"
                    >
                      {grid.label}
                    </text>
                  </g>
                );
              })}

              {/* P10 - P90 Probability Shaded Corridor */}
              <polygon points={areaPolygon} fill="url(#corridorGrad)" />

              {/* P50 Median Expected Line */}
              <polyline
                points={p50Points}
                fill="none"
                stroke="url(#medianLineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Milestone Target Pin Lines (Top 0.1% Threshold) */}
              <line
                x1={padding.left}
                y1={getY(8_150_000)}
                x2={chartWidth - padding.right}
                y2={getY(8_150_000)}
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="2 2"
              />

              {/* Interactive Nodes & Tooltip Trigger */}
              {timeline.map((pt, i) => {
                const cx = getX(i);
                const cy = getY(pt.p50Rank);
                const isHovered = hoveredIndex === i;

                return (
                  <g key={i}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 5 : 2.5}
                      fill={isHovered ? '#38bdf8' : '#fff'}
                      stroke="#0b0c12"
                      strokeWidth="1.5"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredIndex(i)}
                    />
                  </g>
                );
              })}

              {/* X-Axis Date Labels */}
              {timeline
                .filter((_, i) => i % Math.ceil(timeline.length / 6) === 0 || i === timeline.length - 1)
                .map((pt, i) => (
                  <text
                    key={i}
                    x={getX(pt.monthIndex)}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#a1a1aa"
                    fontFamily="monospace"
                  >
                    {pt.dateStr}
                  </text>
                ))}
            </svg>
          </div>

          {/* Hovered Point Card */}
          {hoveredPoint && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <span className="text-zinc-300 font-bold">
                📅 {hoveredPoint.dateStr} (Month {hoveredPoint.monthIndex}):
              </span>
              <span className="text-cyan-300">
                P50 Median Rank: <strong>#{hoveredPoint.p50Rank.toLocaleString()}</strong> ({hoveredPoint.p50XP.toLocaleString()} XP)
              </span>
              <span className="text-emerald-400">
                P90 Apex: <strong>#{hoveredPoint.p90Rank.toLocaleString()}</strong>
              </span>
              <span className="text-rose-400">
                P10 Conservative: <strong>#{hoveredPoint.p10Rank.toLocaleString()}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Milestone Targets Horizon Table */}
        <div className="space-y-2.5 pt-2 border-t border-white/[0.08]">
          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
            GLOBAL BENCHMARK BREACH MILESTONES:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-white/[0.06] bg-black/40 space-y-1.5 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{m.name}</span>
                  <span className="text-[10px] text-cyan-400">{m.badge}</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  Target Rank: <strong className="text-zinc-200">#{m.rankTarget.toLocaleString()}</strong>
                </div>
                <div className="text-[11px] text-emerald-400 font-bold">
                  {m.medianDaysToReach !== null ? `✓ ${m.medianDaysToReach} Days (${m.medianDate})` : '⚠️ Increase daily volume'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
