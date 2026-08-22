import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';
import { Shield, Sparkles } from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

export const RadarMetricChart: React.FC = () => {
  const { composite } = useTitan();

  // Normalize all metrics to Percentile Scale (0 - 100) for radar comparison
  const radarData = [
    {
      subject: 'VO2 Max',
      user: Number(composite.metrics.vo2Max.percentile.toFixed(1)),
      median: 50,
      titan: 99,
      category: 'Physique'
    },
    {
      subject: '1.5-Mi Run',
      user: Number(composite.metrics.run15Mile.percentile.toFixed(1)),
      median: 50,
      titan: 99,
      category: 'Physique'
    },
    {
      subject: 'Bench / BW',
      user: Number(composite.metrics.benchPressBW.percentile.toFixed(1)),
      median: 50,
      titan: 99,
      category: 'Physique'
    },
    {
      subject: 'Deadlift / BW',
      user: Number(composite.metrics.deadliftBW.percentile.toFixed(1)),
      median: 50,
      titan: 99,
      category: 'Physique'
    },
    {
      subject: 'Body Comp',
      user: Number(composite.metrics.bodyFatPercent.percentile.toFixed(1)),
      median: 50,
      titan: 99,
      category: 'Physique'
    },
    {
      subject: 'Fin Modeling',
      user: Number(composite.metrics.financialModeling.percentile.toFixed(1)),
      median: 50,
      titan: 99,
      category: 'Finance'
    },
    {
      subject: 'LBO Structure',
      user: Number(composite.metrics.transactionStructuring.percentile.toFixed(1)),
      median: 50,
      titan: 99,
      category: 'Finance'
    },
    {
      subject: 'Quant & Greeks',
      user: Number(composite.metrics.quantitativeDerivatives.percentile.toFixed(1)),
      median: 50,
      titan: 99,
      category: 'Finance'
    }
  ];

  return (
    <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-titan-cyan">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider">
              MULTI-AXIAL ATTRIBUTE MATRIX
            </h3>
            <p className="text-xs text-slate-400">
              8-Vector comparative polygon vs Population Median & TITAN Apex standard.
            </p>
          </div>
        </div>
      </div>

      <div className="h-80 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis
              dataKey="subject"
              stroke="#94a3b8"
              tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="#475569"
              tick={{ fill: '#64748b', fontSize: 9 }}
              tickFormatter={val => `${val}%`}
            />

            {/* Population Median (50%) */}
            <Radar
              name="Population Median (50%)"
              dataKey="median"
              stroke="#64748b"
              fill="#475569"
              fillOpacity={0.1}
              strokeDasharray="3 3"
            />

            {/* TITAN 99% Benchmark */}
            <Radar
              name="TITAN 99% Apex"
              dataKey="titan"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.15}
            />

            {/* User Live Performance */}
            <Radar
              name="You (Current %ile)"
              dataKey="user"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.4}
              strokeWidth={2}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-titan-cardBorder bg-titan-surface/95 p-3 shadow-2xl text-xs font-mono">
                      <div className="font-bold text-white border-b border-slate-700 pb-1">
                        {pt.subject} ({pt.category})
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="text-cyan-400 font-bold">Your Score: {pt.user}%ile</div>
                        <div className="text-purple-400">TITAN Target: {pt.titan}%ile</div>
                        <div className="text-slate-400">Median: {pt.median}%ile</div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
