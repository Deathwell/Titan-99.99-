import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  Award,
  HeartPulse,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ChevronUp
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

  // Sleek Low-Profile Sparkline Geometry
  const chartWidth = 640;
  const chartHeight = 85;
  const padding = { top: 10, right: 15, bottom: 20, left: 45 };

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

  return (
    <div className="luxury-card p-3.5 sm:p-4 bg-[#0e0e14]/80 border border-white/[0.08] space-y-3 select-none transition-all font-sans">
      {/* Top Header Bar: Lowkey, Executive & Clear */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                10,000 Monte Carlo Simulation
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE SYNCED
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 block font-mono">
              Live probability projected from today's slider commitments
            </span>
          </div>
        </div>

        {/* Right Probability & Horizon Controls */}
        <div className="flex items-center gap-2">
          {/* Probability Pill */}
          <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono flex items-center gap-1.5 ${
            isHighProbability
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
          }`}>
            <span>Top 0.01%:</span>
            <span className={isHighProbability ? 'text-emerald-400 text-sm' : 'text-amber-400 text-sm'}>
              {probabilityOfTop01Percent}%
            </span>
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center p-0.5 rounded-lg bg-black/50 border border-white/10 text-[10px] font-mono">
            {[1, 3, 5, 10].map(yr => (
              <button
                key={yr}
                onClick={() => {
                  setHorizonYears(yr);
                  soundEngine.playClick(800);
                }}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  horizonYears === yr
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {yr}Y
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Compact KPI Readouts */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        <div className="p-2 rounded-lg bg-black/40 border border-white/[0.05]">
          <span className="text-[9px] text-zinc-400 block truncate">TARGET BREACH</span>
          <span className="text-white font-bold block truncate">
            {timeToTop01PercentDate || 'Pace Slower'}
          </span>
          <span className="text-[9px] text-cyan-400 block truncate">
            {timeToTop01PercentDays ? `${timeToTop01PercentDays}d` : '>45m/d needed'}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-black/40 border border-white/[0.05]">
          <span className="text-[9px] text-zinc-400 block truncate">VELOCITY SPEED</span>
          <span className="text-amber-300 font-bold block truncate">
            {velocityMultiplier}x Baseline
          </span>
          <span className="text-[9px] text-zinc-400 block truncate">
            {capitalMultiplierMax}x Alpha
          </span>
        </div>

        <div className="p-2 rounded-lg bg-black/40 border border-white/[0.05]">
          <span className="text-[9px] text-zinc-400 block truncate">MORTALITY DEFENSE</span>
          <span className="text-emerald-400 font-bold block truncate">
            -{mortalityRiskReductionMax}% Hazard
          </span>
          <span className="text-[9px] text-zinc-400 block truncate">
            Cardio Shielded
          </span>
        </div>
      </div>

      {/* Low-Profile Mini Stochastic Sparkline Ribbon */}
      <div className="rounded-lg bg-black/50 border border-white/[0.06] p-2 space-y-1">
        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>P50 Expected Median</span>
            <span className="text-zinc-600">•</span>
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500/40" />
            <span>P10–P90 Range</span>
          </span>
          {hoveredPoint && (
            <span className="text-cyan-300 font-semibold">
              {hoveredPoint.dateStr}: Rank #{hoveredPoint.p50Rank.toLocaleString('en-US')}
            </span>
          )}
        </div>

        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id="todayAreaGradMini" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#e11d48" stopOpacity="0.25" />
              </linearGradient>
              <linearGradient id="todayLineGradMini" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>

            {/* Horizontal Reference Lines */}
            {[
              { rank: 8_150_000, label: 'Top 0.1%' },
              { rank: 8_150_000_000, label: '8.15B' }
            ].map(grid => {
              const y = getY(grid.rank);
              return (
                <g key={grid.rank}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padding.left - 6}
                    y={y + 3}
                    textAnchor="end"
                    fill="#71717a"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {grid.label}
                  </text>
                </g>
              );
            })}

            {/* Shaded Area */}
            <polygon points={areaPolygon} fill="url(#todayAreaGradMini)" />

            {/* P10 / P90 Outlines */}
            <polyline
              points={p10Points}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1"
              strokeDasharray="2 2"
              strokeOpacity="0.5"
            />
            <polyline
              points={timeline.map((pt, i) => `${getX(i)},${getY(pt.p90Rank)}`).join(' ')}
              fill="none"
              stroke="#e11d48"
              strokeWidth="1"
              strokeDasharray="2 2"
              strokeOpacity="0.4"
            />

            {/* P50 Median Line */}
            <polyline
              points={p50Points}
              fill="none"
              stroke="url(#todayLineGradMini)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hover Crosshair */}
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
                  r="4"
                  fill="#06b6d4"
                  stroke="#ffffff"
                  strokeWidth="1.5"
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
      </div>
    </div>
  );
};
