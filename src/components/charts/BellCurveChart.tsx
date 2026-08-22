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
import { generateBellCurveData, standardNormalPDF } from '../../lib/statsEngine';
import { MetricKey } from '../../types/titan';

export const BellCurveChart: React.FC = () => {
  const { composite } = useTitan();
  const [selectedDimension, setSelectedDimension] = useState<'global' | 'physique' | 'finance' | MetricKey>('global');

  // Determine active Z-score and label
  let currentZ = composite.zGlobal;
  let currentPercentile = composite.percentileGlobal;
  let label = 'Composite Global Index';
  let unit = 'σ';

  if (selectedDimension === 'physique') {
    currentZ = composite.zPhysique;
    currentPercentile = composite.percentilePhysique;
    label = 'Physique Dimension Composite';
  } else if (selectedDimension === 'finance') {
    currentZ = composite.zFinance;
    currentPercentile = composite.percentileFinance;
    label = 'Finance Dimension Composite';
  } else if (selectedDimension in composite.metrics) {
    const key = selectedDimension as MetricKey;
    const m = composite.metrics[key];
    if (m) {
      currentZ = m.zScore;
      currentPercentile = m.percentile;
      label = m.benchmark.label;
      unit = `${m.rawValue} ${m.benchmark.unit}`;
    }
  }

  // Generate bell curve points
  const bellData = React.useMemo(() => {
    return generateBellCurveData(currentZ, 80);
  }, [currentZ]);

  return (
    <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-400">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wider">
              GAUSSIAN NORMAL DISTRIBUTION ENGINE
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical population distribution <span className="font-mono text-slate-300">Φ(z) = 0.5 · [1 + erf(z / √2)]</span> with live operator coordinate.
          </p>
        </div>

        {/* Vector Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">VECTOR:</span>
          <select
            value={selectedDimension}
            onChange={e => setSelectedDimension(e.target.value as any)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-mono text-cyan-300 focus:border-titan-cyan focus:outline-none"
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
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded-lg border border-slate-800 bg-titan-card/50">
          <div className="text-slate-500 text-[10px]">SELECTED VECTOR</div>
          <div className="font-bold text-white truncate">{label}</div>
        </div>
        <div className="p-2.5 rounded-lg border border-slate-800 bg-titan-card/50">
          <div className="text-slate-500 text-[10px]">RAW VALUE / SCORE</div>
          <div className="font-bold text-cyan-400">{unit}</div>
        </div>
        <div className="p-2.5 rounded-lg border border-slate-800 bg-titan-card/50">
          <div className="text-slate-500 text-[10px]">CURRENT Z-SCORE</div>
          <div className="font-bold text-emerald-400">
            {currentZ >= 0 ? `+${currentZ.toFixed(3)}` : currentZ.toFixed(3)}σ
          </div>
        </div>
        <div className="p-2.5 rounded-lg border border-slate-800 bg-titan-card/50">
          <div className="text-slate-500 text-[10px]">POPULATION RANK</div>
          <div className="font-bold text-purple-400">
            Top {(100 - currentPercentile).toFixed(2)}% ({currentPercentile.toFixed(2)}th %ile)
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
              tickFormatter={val => val.toFixed(2)}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-titan-cardBorder bg-titan-surface/95 p-2.5 shadow-2xl backdrop-blur-md text-xs font-mono">
                      <div className="font-bold text-white">Z-Score: {pt.z}σ</div>
                      <div className="text-cyan-400">Percentile: {pt.percentile.toFixed(2)}%</div>
                      <div className="text-slate-400">Density: {pt.pdf.toFixed(4)}</div>
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
              label={{ value: 'Mean (μ)', fill: '#64748b', position: 'top', fontSize: 10 }}
            />

            {/* 99th Percentile TITAN Line (Z = 2.326) */}
            <ReferenceLine
              x={2.33}
              stroke="#a855f7"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{ value: 'TITAN 99% (+2.33σ)', fill: '#c084fc', position: 'top', fontSize: 10, fontWeight: 'bold' }}
            />

            {/* User Current Position Reference Line */}
            <ReferenceLine
              x={Number(currentZ.toFixed(2))}
              stroke="#06b6d4"
              strokeWidth={2.5}
              label={{
                value: `YOU (${currentZ >= 0 ? `+${currentZ.toFixed(2)}` : currentZ.toFixed(2)}σ)`,
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
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 inline-block" />
            Your Coordinate
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500 inline-block" />
            TITAN Apex (&gt; +2.33σ)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-500 inline-block" />
            Population Median (0σ)
          </span>
        </div>
        <span className="text-slate-500">
          68.2% in ±1σ • 95.4% in ±2σ • 99.7% in ±3σ
        </span>
      </div>
    </div>
  );
};
