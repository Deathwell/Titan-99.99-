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
import { TrendingUp, ShieldAlert, AlertTriangle, Sparkles } from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

export const ProgressionChart: React.FC = () => {
  const { history, profile } = useTitan();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | 'ALL'>('30D');
  const [visibleSeries, setVisibleSeries] = useState<{
    global: boolean;
    physique: boolean;
    finance: boolean;
  }>({
    global: true,
    physique: true,
    finance: true
  });

  const filteredData = React.useMemo(() => {
    if (!history || history.length === 0) return [];
    if (timeRange === '7D') return history.slice(-7);
    if (timeRange === '30D') return history.slice(-30);
    return history;
  }, [history, timeRange]);

  const startPercentile = filteredData.length > 0 ? filteredData[0].percentileGlobal : 0;
  const currentPercentile = filteredData.length > 0 ? filteredData[filteredData.length - 1].percentileGlobal : 0;
  const delta = currentPercentile - startPercentile;

  const hasDecayedDays = filteredData.some(d => d.isDecayErased);

  return (
    <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 shadow-xl backdrop-blur-md">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-titan-cyan">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wider">
              GLOBAL PERCENTILE TRAJECTORY
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical percentile progression over time vs. <span className="text-purple-400 font-bold">99.00% TITAN Apex line</span>.
          </p>
        </div>

        {/* Filters & Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Tabs */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-titan-card p-1 text-xs font-mono">
            {(['7D', '30D', 'ALL'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded transition-all ${
                  timeRange === range
                    ? 'bg-titan-cyan text-black font-bold shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Delta Pill */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-lg border border-titan-cardBorder bg-slate-900/60 text-xs font-mono">
            <span className="text-slate-400">DELTA ({timeRange}):</span>
            <span className={`font-bold ${delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {delta >= 0 ? `+${delta.toFixed(2)}%` : `${delta.toFixed(2)}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Series Visibility Toggles & Decay Warning indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={visibleSeries.global}
              onChange={e => setVisibleSeries(prev => ({ ...prev, global: e.target.checked }))}
              className="rounded border-slate-700 text-titan-cyan focus:ring-0"
            />
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>Composite Global</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={visibleSeries.physique}
              onChange={e => setVisibleSeries(prev => ({ ...prev, physique: e.target.checked }))}
              className="rounded border-slate-700 text-titan-cyan focus:ring-0"
            />
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Physique</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={visibleSeries.finance}
              onChange={e => setVisibleSeries(prev => ({ ...prev, finance: e.target.checked }))}
              className="rounded border-slate-700 text-titan-cyan focus:ring-0"
            />
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Finance Mastery</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          {hasDecayedDays && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 text-[10px] font-bold animate-pulse">
              <AlertTriangle className="h-3 w-3" /> MISSED DAYS ERASED
            </span>
          )}
          <div className="flex items-center gap-1.5 text-purple-400 font-bold text-[11px]">
            <span className="h-2 w-4 border-b-2 border-dashed border-purple-400" />
            <span>99.00% TITAN Standard</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="globalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="physiqueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="financeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />

            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={val => {
                const parts = val.split('-');
                return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : val;
              }}
            />

            <YAxis
              domain={[0, 100]}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={val => `${val}%`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as any;
                  return (
                    <div className="rounded-lg border border-titan-cardBorder bg-titan-surface/95 p-3 shadow-2xl backdrop-blur-md text-xs font-mono">
                      <div className="border-b border-slate-700 pb-1 font-bold text-white flex items-center justify-between gap-2">
                        <span>DATE: {label}</span>
                        {pt.isDecayErased && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-900 border border-rose-600 text-rose-300 text-[9px] font-bold">
                            MISSED DAY ERASED
                          </span>
                        )}
                      </div>
                      <div className="mt-2 space-y-1">
                        {payload.map((item, index) => (
                          <div key={index} className="flex items-center justify-between gap-4">
                            <span style={{ color: item.color }} className="font-semibold">
                              {item.name}:
                            </span>
                            <span className="font-bold text-white">
                              {typeof item.value === 'number' ? `${item.value.toFixed(2)}%` : item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <ReferenceLine
              y={99.0}
              stroke="#a855f7"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                value: 'TITAN 99.0% APEX',
                fill: '#c084fc',
                position: 'insideTopRight',
                fontSize: 11,
                fontWeight: 'bold'
              }}
            />

            <ReferenceLine
              y={50.0}
              stroke="#475569"
              strokeDasharray="2 2"
              label={{ value: 'MEDIAN (50%)', fill: '#64748b', position: 'insideBottomRight', fontSize: 10 }}
            />

            {visibleSeries.physique && (
              <Area
                type="monotone"
                dataKey="percentilePhysique"
                name="Physique %ile"
                stroke="#10b981"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#physiqueGradient)"
              />
            )}

            {visibleSeries.finance && (
              <Area
                type="monotone"
                dataKey="percentileFinance"
                name="Finance %ile"
                stroke="#f59e0b"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#financeGradient)"
              />
            )}

            {visibleSeries.global && (
              <Area
                type="monotone"
                dataKey="percentileGlobal"
                name="Composite Global %ile"
                stroke="#06b6d4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#globalGradient)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
