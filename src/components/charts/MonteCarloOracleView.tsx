import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  Target,
  HeartPulse,
  DollarSign,
  TrendingUp,
  Dumbbell,
  LineChart,
  Award
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { monteCarloEngine, MonteCarloConfig } from '../../lib/monteCarloEngine';
import { soundEngine } from '../../lib/audio';
import { DarkeningPrecisionSlider } from '../action/DarkeningPrecisionSlider';

export const MonteCarloOracleView: React.FC = () => {
  const { profile, workoutLogs, financeLogs, setDailyTaskDuration } = useTitan();

  // Read current shared daily minutes from context (synchronized with Home page)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkout = workoutLogs.find(w => w.pillar === 'STRENGTH' && w.timestamp.startsWith(todayStr));
  const todayFinance = financeLogs.find(f => (f.discipline === 'PRIVATE_EQUITY' || f.discipline === 'INVESTMENT_BANKING') && f.timestamp.startsWith(todayStr));

  const workoutMinutes = todayWorkout?.durationMinutes || 0;
  const financeMinutes = todayFinance?.durationMinutes || 0;

  const [horizonYears, setHorizonYears] = useState<number>(3);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Synchronously update shared daily habit state when sliders change on Analytics page
  const handleWorkoutChange = (val: number) => {
    setDailyTaskDuration('STRENGTH', val);
  };

  const handleFinanceChange = (val: number) => {
    setDailyTaskDuration('MODELING', val);
  };

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
  const chartWidth = 720;
  const chartHeight = 160;
  const padding = { top: 15, right: 20, bottom: 25, left: 80 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxRank = 8_150_000_000;
  const minRank = 8_150_000;

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
    <div className="space-y-5 font-sans select-none animate-in fade-in duration-300">
      {/* Main Forecast Card */}
      <div className="luxury-card p-5 sm:p-6 bg-[#0e0e14]/85 border border-white/[0.08] space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-sm">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight font-serif">
                  10-Year Destiny & Rank Forecast
                </h3>
                <span className="text-[9px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE SYNCED WITH TODAY'S SLIDERS
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Simulating 10,000 probable futures based on your daily workout & finance consistency.
              </p>
            </div>
          </div>

          {/* Right: Chance of Top 0.01% & Horizon Tabs */}
          <div className="flex items-center gap-2.5">
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

            <div className="flex items-center p-0.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono">
              {[1, 3, 5, 10].map(yr => (
                <button
                  key={yr}
                  onClick={() => {
                    setHorizonYears(yr);
                    soundEngine.playClick(800);
                  }}
                  className={`px-3 py-1 rounded font-bold transition-all ${
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

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono uppercase">
              <Target className="h-3.5 w-3.5 text-cyan-400" />
              <span>Target Arrival Date</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white font-mono">
              {timeToTop01PercentDate || 'Pace Needs Boost'}
            </div>
            <span className="text-[11px] text-cyan-300/80 block">
              {timeToTop01PercentDays
                ? `Estimated in ${Math.round((timeToTop01PercentDays / 365) * 10) / 10} years`
                : 'Requires >45m daily habit'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono uppercase">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Daily Climb Speed</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-amber-300 font-mono">
              {velocityMultiplier}x Faster Than Avg
            </div>
            <span className="text-[11px] text-zinc-400 block">
              {isPaceActive ? 'Outranking ~8.2M people/mo' : 'Stalled — Move sliders below'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono uppercase">
              <HeartPulse className="h-3.5 w-3.5 text-emerald-400" />
              <span>Health & Longevity</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
              +{mortalityRiskReductionMax}% Defense Boost
            </div>
            <span className="text-[11px] text-zinc-400 block">
              Lower biological aging risk
            </span>
          </div>
        </div>

        {/* Forecast Graph */}
        <div className="rounded-xl bg-black/55 border border-white/[0.06] p-3.5 space-y-2">
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

          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                <linearGradient id="oracleAreaGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
                  <stop offset="50%" stopColor="#ec4899" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.28" />
                </linearGradient>
                <linearGradient id="oracleLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>

              {[
                { rank: 8_150_000, label: 'Top 0.01% Elite', color: '#06b6d4' },
                { rank: 81_500_000, label: 'Top 1% (#81.5M)', color: '#a855f7' },
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

              <polygon points={areaPolygon} fill="url(#oracleAreaGrad)" />

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

              <polyline
                points={p50Points}
                fill="none"
                stroke="url(#oracleLineGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

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

      {/* Connected Sliders Dock (Interlinked With Home Page) */}
      <div className="luxury-card p-4 sm:p-5 bg-[#0e0e14]/85 border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30">
                2-WAY LIVE SYNC
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Daily Habit Commitment Sliders
              </h4>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Moving these sliders updates both this 10-year forecast and your Home page daily log simultaneously.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Slider 1: Physical Workout */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/25">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Physical Workout Protocol</span>
                  <span className="text-[10px] text-zinc-400">Strength & stamina training (up to 4h MAX)</span>
                </div>
              </div>
            </div>

            <DarkeningPrecisionSlider
              value={workoutMinutes}
              onChange={handleWorkoutChange}
              accentColor="crimson"
              title="Workout"
            />
          </div>

          {/* Slider 2: Financial Modeling */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25">
                  <LineChart className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Financial Modeling & Capital Markets</span>
                  <span className="text-[10px] text-zinc-400">LBO models & quant derivatives (up to 4h MAX)</span>
                </div>
              </div>
            </div>

            <DarkeningPrecisionSlider
              value={financeMinutes}
              onChange={handleFinanceChange}
              accentColor="gold"
              title="Finance"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
