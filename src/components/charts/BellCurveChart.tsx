import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { Activity } from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { generateBellCurveData, zScoreToPercentile } from '../../lib/statsEngine';
import { MetricKey } from '../../types/titan';

export const BellCurveChart: React.FC = () => {
  const { composite } = useTitan();
  const [selectedDimension, setSelectedDimension] = useState<'global' | 'physique' | 'finance' | MetricKey>('global');

  // Determine active Z-score and label
  let currentZ = composite?.zGlobal ?? 0;
  let currentPercentile = composite?.percentileGlobal ?? 50;
  let label = 'Composite Global Index';
  let unit = 'σ';

  if (selectedDimension === 'physique') {
    currentZ = composite?.zPhysique ?? 0;
    currentPercentile = composite?.percentilePhysique ?? 50;
    label = 'Physique Dimension Composite';
  } else if (selectedDimension === 'finance') {
    currentZ = composite?.zFinance ?? 0;
    currentPercentile = composite?.percentileFinance ?? 50;
    label = 'Finance Dimension Composite';
  } else if (composite?.metrics && selectedDimension in composite.metrics) {
    const key = selectedDimension as MetricKey;
    const m = composite.metrics[key];
    if (m) {
      currentZ = m.zScore ?? 0;
      currentPercentile = m.percentile ?? 50;
      label = m.benchmark?.label ?? key;
      unit = `${m.rawValue ?? 0} ${m.benchmark?.unit ?? ''}`;
    }
  }

  // Generate bell curve points with percentile included on every point
  const bellData = React.useMemo(() => {
    return generateBellCurveData(currentZ, 80);
  }, [currentZ]);

  const safeZ = Number(currentZ.toFixed(2));
  const safePercentile = typeof currentPercentile === 'number' && !isNaN(currentPercentile) ? currentPercentile : 50;

  return (
    <div className="luxury-card p-4 sm:p-5 bg-[#0e0e14]/85 border border-white/[0.08] shadow-xl backdrop-blur-md font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-400">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wider">
              GAUSSIAN NORMAL DISTRIBUTION
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Global population distribution curve with your exact position highlighted.
          </p>
        </div>

        {/* Vector Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400 font-mono">VECTOR:</span>
          <select
            value={selectedDimension}
            onChange={e => setSelectedDimension(e.target.value as any)}
            className="rounded-xl border border-white/10 bg-[#121218] px-3 py-1.5 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            <optgroup label="Composites">
              <option value="global">Global Composite Score</option>
              <option value="physique">Physique Composite</option>
              <option value="finance">Finance Composite</option>
            </optgroup>
            <optgroup label="Physique Vectors">
              <option value="vo2Max">Cardiorespiratory (VO2 Max)</option>
              <option value="run15Mile">Tactical 1.5-Mile Run</option>
              <option value="benchPressBW">Relative Bench Press (1RM/BW)</option>
              <option value="deadliftBW">Relative Deadlift (1RM/BW)</option>
              <option value="bodyFatPercent">Body Fat % (DXA)</option>
            </optgroup>
            <optgroup label="Finance Vectors">
              <option value="financialModeling">Core Financial Modeling</option>
              <option value="transactionStructuring">Transaction Structuring (LBO)</option>
              <option value="quantitativeDerivatives">Quantitative Macro & Derivatives</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Metric Info Callout */}
      <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-xl border border-white/[0.06] bg-black/40">
          <div className="text-zinc-400 text-[10px]">SELECTED VECTOR</div>
          <div className="font-bold text-white truncate">{label}</div>
        </div>
        <div className="p-2.5 rounded-xl border border-white/[0.06] bg-black/40">
          <div className="text-zinc-400 text-[10px]">RAW VALUE</div>
          <div className="font-bold text-cyan-400">{unit}</div>
        </div>
        <div className="p-2.5 rounded-xl border border-white/[0.06] bg-black/40">
          <div className="text-zinc-400 text-[10px]">CURRENT Z-SCORE</div>
          <div className="font-bold text-emerald-400">
            {currentZ >= 0 ? `+${currentZ.toFixed(2)}` : currentZ.toFixed(2)}σ
          </div>
        </div>
        <div className="p-2.5 rounded-xl border border-white/[0.06] bg-black/40">
          <div className="text-zinc-400 text-[10px]">POPULATION RANK</div>
          <div className="font-bold text-purple-400">
            Top {(100 - safePercentile).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Bell Curve Visualization Canvas */}
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={bellData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="bellGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />

            <XAxis
              dataKey="z"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={val => `${val >= 0 ? `+${val}` : val}σ`}
            />

            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={val => typeof val === 'number' ? val.toFixed(2) : String(val)}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  if (!pt) return null;
                  const zVal = typeof pt.z === 'number' ? pt.z : 0;
                  const pct = typeof pt.percentile === 'number' ? pt.percentile : zScoreToPercentile(zVal);
                  const pdfVal = typeof pt.pdf === 'number' ? pt.pdf.toFixed(4) : '0.0000';

                  return (
                    <div className="rounded-xl border border-white/10 bg-[#0e0e14]/95 p-3 shadow-2xl backdrop-blur-md text-xs font-mono space-y-1">
                      <div className="font-bold text-white">Z-Score: {zVal >= 0 ? `+${zVal}` : zVal}σ</div>
                      <div className="text-cyan-400 font-semibold">Percentile: {pct.toFixed(2)}%</div>
                      <div className="text-zinc-400">Relative Density: {pdfVal}</div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Mean (Z = 0) reference */}
            <ReferenceLine
              x={0}
              stroke="#64748b"
              strokeDasharray="3 3"
              label={{ value: 'Mean (0σ)', fill: '#94a3b8', position: 'top', fontSize: 10 }}
            />

            {/* 99th Percentile TITAN Line (Z = 2.33) */}
            <ReferenceLine
              x={2.33}
              stroke="#a855f7"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{ value: 'TITAN 99% (+2.33σ)', fill: '#c084fc', position: 'top', fontSize: 10, fontWeight: 'bold' }}
            />

            {/* User Current Position Reference Line */}
            <ReferenceLine
              x={safeZ}
              stroke="#06b6d4"
              strokeWidth={2.5}
              label={{
                value: `YOU (${safeZ >= 0 ? `+${safeZ}` : safeZ}σ)`,
                fill: '#22d3ee',
                position: 'insideTopLeft',
                fontSize: 11,
                fontWeight: 'bold'
              }}
            />

            <Area
              type="monotone"
              dataKey="pdf"
              stroke="#38bdf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#bellGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bell Curve Key Legend */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400 font-mono border-t border-white/[0.06] pt-2.5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 inline-block" />
            Your Coordinate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500 inline-block" />
            TITAN Apex (&gt; +2.33σ)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-500 inline-block" />
            Population Median (0σ)
          </span>
        </div>
        <span className="text-zinc-500">
          68.2% within ±1σ • 95.4% within ±2σ • 99.7% within ±3σ
        </span>
      </div>
    </div>
  );
};
