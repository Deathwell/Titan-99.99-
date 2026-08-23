import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  Target,
  HeartPulse,
  TrendingUp,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { monteCarloEngine, MonteCarloConfig } from '../../lib/monteCarloEngine';
import { soundEngine } from '../../lib/audio';

interface TodayMonteCarloOracleProps {
  workoutMinutes: number;
  financeMinutes: number;
}

export const TodayMonteCarloOracle: React.FC<TodayMonteCarloOracleProps> = ({
  workoutMinutes,
  financeMinutes
}) => {
  const { profile } = useTitan();
  const [horizonYears, setHorizonYears] = useState<number>(3);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Live real-time sensitivity configuration bound to Today's sliders
  const config: MonteCarloConfig = useMemo(
    () => ({
      currentXP: profile.xp || 0,
      currentStreakDays: profile.streakDays || 0,
      dailyWorkoutMinutes: workoutMinutes,
      dailyFinanceMinutes: financeMinutes,
      streakConsistencyPercent: 90,
      horizonYears
    }),
    [profile.xp, profile.streakDays, workoutMinutes, financeMinutes, horizonYears]
  );

  // Compute 10,000-path stochastic simulation synchronously in < 1ms
  const simulation = useMemo(() => {
    return monteCarloEngine.runSimulation(config);
  }, [config]);

  const {
    timeline,
    timeToTop01PercentDays,
    timeToTop01PercentDate,
    probabilityOfTop01Percent,
    velocityMultiplier,
    mortalityRiskReductionMax,
    capitalMultiplierMax
  } = simulation;

  // Chart Geometry
  const chartWidth = 640;
  const chartHeight = 90;
  const padding = { top: 12, right: 15, bottom: 22, left: 75 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxRank = 8_150_000_000;
  const minRank = 8_150_000;

  // Inverted log-rank scale: Top #8.15M at top, #8.15B at bottom
  const getY = (rank: number) => {
    const logMax = Math.log10(maxRank);
    const logMin = Math.log10(minRank);
    const logVal = Math.log10(Math.max(minRank, rank));
    const norm = (logVal - logMin) / (logMax - logMin);
    return padding.top + norm * innerHeight;
  };

  const getX = (index: number) => {
    return padding.left + (index / Math.max(1, timeline.length - 1)) * innerWidth;
  };

  const p50Points = timeline.map((pt, i) => `${getX(i)},${getY(pt.p50Rank)}`).join(' ');
  const p10Points = timeline.map((pt, i) => `${getX(i)},${getY(pt.p10Rank)}`).join(' ');
  const p90Points = timeline.map((pt, i) => `${getX(i)},${getY(pt.p90Rank)}`).reverse().join(' ');
  const areaPolygon = `${timeline.map((pt, i) => `${getX(i)},${getY(pt.p10Rank)}`).join(' ')} ${p90Points}`;

  const hoveredPoint =
    hoveredIndex !== null ? timeline[hoveredIndex] : timeline[timeline.length - 1];

  const isHighProbability = probabilityOfTop01Percent >= 70;
  const isPaceActive = workoutMinutes > 0 || financeMinutes > 0;

  return (
    <div className="luxury-card p-4 sm:p-5 bg-[#0e0e14]/85 border border-white/[0.08] space-y-3.5 select-none transition-all font-sans">
      {/* Top Header Bar: Clean, Human-Friendly & Crystal Clear */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight font-serif">
                10-Year Destiny & Rank Forecast
              </h3>
              <span className="text-[9px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE FORECAST
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Simulating where your daily workout & finance consistency will take you over time.
            </p>
          </div>
        </div>

        {/* Right: Chance of Becoming Top 0.01% & Horizon Tabs */}
        <div className="flex items-center gap-2.5">
          {/* Chance Badge */}
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 ${
            isHighProbability
              ? 'bg-emerald-950/40 border-emerald-500/35 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
          }`}>
            <span className="text-[10px] text-zinc-300">Chance of Top 0.01%:</span>
            <span className={`font-bold font-mono text-sm ${isHighProbability ? 'text-emerald-400' : 'text-amber-400'}`}>
              {probabilityOfTop01Percent}%
            </span>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center p-0.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono">
            {[1, 3, 5, 10].map(yr => (
              <button
                key={yr}
                onClick={() => {
                  setHorizonYears(yr);
                  soundEngine.playClick(800);
                }}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  horizonYears === yr
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title={`View ${yr} Year Forecast`}
              >
                {yr}Y
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Plain-English Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Card 1: Arrival Date */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono uppercase">
            <Target className="h-3.5 w-3.5 text-cyan-400" />
            <span>Target Arrival Date</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-white font-mono">
            {timeToTop01PercentDate || 'Pace Needs Boost'}
          </div>
          <span className="text-[10px] text-cyan-300/80 block">
            {timeToTop01PercentDays
              ? `Estimated in ${Math.round((timeToTop01PercentDays / 365) * 10) / 10} years`
              : 'Requires >45m daily habit'}
          </span>
        </div>

        {/* Card 2: Climb Speed */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono uppercase">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Daily Climb Speed</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-amber-300 font-mono">
            {velocityMultiplier}x Faster Than Avg
          </div>
          <span className="text-[10px] text-zinc-400 block">
            {isPaceActive ? 'Outranking ~8.2M people/mo' : 'Stalled — Move sliders above'}
          </span>
        </div>

        {/* Card 3: Health & Longevity */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono uppercase">
            <HeartPulse className="h-3.5 w-3.5 text-emerald-400" />
            <span>Health & Longevity</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
            +{mortalityRiskReductionMax}% Defense Boost
          </div>
          <span className="text-[10px] text-zinc-400 block">
            Lower biological aging risk
          </span>
        </div>
      </div>

      {/* Human-Readable Trajectory Graph */}
      <div className="rounded-xl bg-black/55 border border-white/[0.06] p-3 space-y-1.5">
        {/* Simple Legend */}
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
              <span className="text-zinc-300 font-medium">Your Expected Path</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500/40" />
              <span className="text-zinc-400">Best / Worst Case Range</span>
            </span>
          </div>

          {hoveredPoint && (
            <span className="text-cyan-300 font-bold hidden xs:inline">
              {hoveredPoint.dateStr}: Projected Rank #{hoveredPoint.p50Rank.toLocaleString('en-US')}
            </span>
          )}
        </div>

        {/* Visual Forecast Chart */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id="humanAreaGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#e11d48" stopOpacity="0.28" />
              </linearGradient>
              <linearGradient id="humanLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>

            {/* Clear Horizontal Destination Lines */}
            {[
              { rank: 8_150_000, label: 'Top 0.01% Elite', color: '#06b6d4' },
              { rank: 8_150_000_000, label: 'Average Person', color: '#71717a' }
            ].map(grid => {
              const y = getY(grid.rank);
              return (
                <g key={grid.rank}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 6}
                    y={y + 3}
                    textAnchor="end"
                    fill={grid.color}
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {grid.label}
                  </text>
                </g>
              );
            })}

            {/* Shaded 10,000-Path Variance Ribbon */}
            <polygon points={areaPolygon} fill="url(#humanAreaGrad)" />

            {/* P10 / P90 Subtle Boundaries */}
            <polyline
              points={p10Points}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1"
              strokeDasharray="3 3"
              strokeOpacity="0.5"
            />
            <polyline
              points={timeline.map((pt, i) => `${getX(i)},${getY(pt.p90Rank)}`).join(' ')}
              fill="none"
              stroke="#e11d48"
              strokeWidth="1"
              strokeDasharray="3 3"
              strokeOpacity="0.4"
            />

            {/* Primary Expected Growth Path */}
            <polyline
              points={p50Points}
              fill="none"
              stroke="url(#humanLineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hover Interaction Crosshair & Tooltip */}
            {hoveredIndex !== null && (
              <g>
                <line
                  x1={getX(hoveredIndex)}
                  y1={padding.top}
                  x2={getX(hoveredIndex)}
                  y2={chartHeight - padding.bottom}
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <circle
                  cx={getX(hoveredIndex)}
                  cy={getY(timeline[hoveredIndex].p50Rank)}
                  r="4.5"
                  fill="#06b6d4"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            )}

            {/* Interactive Hover Strips */}
            {timeline.map((_, i) => (
              <rect
                key={i}
                x={getX(i) - innerWidth / timeline.length / 2}
                y={padding.top}
                width={innerWidth / timeline.length}
                height={innerHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => {
                  setHoveredIndex(i);
                  soundEngine.playClick(950);
                }}
              />
            ))}
          </svg>
        </div>

        {/* Helpful Micro-Guidance */}
        <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400">
          <span>💡 Slide Workout & Finance higher to see your rank trajectory climb faster.</span>
          <span className="font-mono text-zinc-500 hidden sm:inline">Based on 10,000 mathematical simulations</span>
        </div>
      </div>
    </div>
  );
};
