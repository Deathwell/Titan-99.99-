import React, { useState } from 'react';
import {
  Dumbbell,
  Heart,
  Flame,
  Timer,
  PlusCircle,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Calendar,
  Activity,
  ShieldCheck,
  Sparkles,
  Eye
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { formatSecondsToTime, parseTimeToSeconds } from '../../lib/statsEngine';
import { WorkoutPillar } from '../../types/titan';

export const PhysiqueHub: React.FC = () => {
  const {
    metrics,
    profile,
    updateMetrics,
    workoutLogs,
    addWorkoutLog,
    composite,
    setActiveTab
  } = useTitan();

  // Simple high-level workout form
  const [pillar, setPillar] = useState<WorkoutPillar>('ENDURANCE');
  const [title, setTitle] = useState<string>('1 Hour Endurance / Zone 2 Base');
  const [durationHours, setDurationHours] = useState<number>(1.0);
  const [intensity, setIntensity] = useState<'ZONE_2_STEADY' | 'ZONE_4_TEMPO' | 'ZONE_5_MAX' | 'HEAVY_RESISTANCE' | 'MODERATE_VOLUME'>('ZONE_2_STEADY');
  const [peakHR, setPeakHR] = useState<number>(155);
  const [calories, setCalories] = useState<number>(550);
  const [notes, setNotes] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Quick Preset Helper
  const applyPreset = (presetPillar: WorkoutPillar, presetTitle: string, hours: number, defaultIntensity: any, defaultHR: number, defaultCals: number) => {
    setPillar(presetPillar);
    setTitle(presetTitle);
    setDurationHours(hours);
    setIntensity(defaultIntensity);
    setPeakHR(defaultHR);
    setCalories(defaultCals);
    setIsFormOpen(true);
  };

  const handleWorkoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const durationMinutes = Math.round(durationHours * 60);

    addWorkoutLog({
      pillar,
      title: title || `${durationHours} Hr ${pillar} Session`,
      durationMinutes,
      intensity,
      peakHeartRateBpm: Number(peakHR),
      caloricBurn: Number(calories),
      notes: notes || `Logged ${durationHours} hr ${pillar.toLowerCase()} workout session.`
    });

    // Bump slightly the corresponding physical baseline
    if (pillar === 'ENDURANCE') {
      const nextVo2 = Math.min(75, Number((metrics.vo2Max + 0.3).toFixed(1)));
      const nextRun = Math.max(480, metrics.run15Mile - 3);
      updateMetrics({ vo2Max: nextVo2, run15Mile: nextRun });
    } else if (pillar === 'STRENGTH') {
      const nextBench = Math.min(220, metrics.benchPressKg + 1);
      const nextDeadlift = Math.min(350, metrics.deadliftKg + 1.5);
      updateMetrics({ benchPressKg: nextBench, deadliftKg: nextDeadlift });
    } else if (pillar === 'HYBRID_TACTICAL') {
      const nextBF = Math.max(6, Number((metrics.bodyFatPercent - 0.1).toFixed(1)));
      updateMetrics({ bodyFatPercent: nextBF });
    }

    setNotes('');
    setIsFormOpen(false);
  };

  const bw = profile.bodyWeightKg || 75;

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner */}
      <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-800/40 text-titan-cyan">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wider">
                  TACTICAL PHYSIQUE COMMAND
                </h2>
                <p className="text-xs text-slate-400 font-sans">
                  High-level endurance, strength, and tactical capacity tracking. Log high-level sessions (e.g. 1 hr of endurance, 1 hr of strength).
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 font-mono text-xs">
              <span className="text-slate-400">DIMENSION SCORE: </span>
              <strong className="text-titan-cyan text-sm">{composite.percentilePhysique.toFixed(2)}%</strong>
              <span className="text-slate-500 ml-1">({composite.zPhysique >= 0 ? `+${composite.zPhysique.toFixed(2)}` : composite.zPhysique.toFixed(2)}σ)</span>
            </div>

            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-titan-cyan hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-glow-cyan"
            >
              <PlusCircle className="h-4 w-4" />
              {isFormOpen ? 'Close Logger' : 'Quick Log Workout'}
            </button>
          </div>
        </div>

        {/* 1-Click Quick Preset Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-bold mr-1">QUICK LOG:</span>
          
          <button
            onClick={() => applyPreset('ENDURANCE', '1 Hour Endurance / Zone 2 Base', 1.0, 'ZONE_2_STEADY', 145, 600)}
            className="px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-700/60 hover:bg-cyan-900 text-cyan-300 text-xs flex items-center gap-1 transition-all"
          >
            🏃 1 Hr Endurance
          </button>

          <button
            onClick={() => applyPreset('STRENGTH', '1 Hour Heavy Strength Session', 1.0, 'HEAVY_RESISTANCE', 155, 480)}
            className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-900 text-emerald-300 text-xs flex items-center gap-1 transition-all"
          >
            🏋️ 1 Hr Strength
          </button>

          <button
            onClick={() => applyPreset('HYBRID_TACTICAL', '1.5 Hour Tactical MetCon / Ruck', 1.5, 'ZONE_4_TEMPO', 165, 850)}
            className="px-3 py-1 rounded-lg bg-amber-950/60 border border-amber-700/60 hover:bg-amber-900 text-amber-300 text-xs flex items-center gap-1 transition-all"
          >
            ⚡ 1.5 Hr Tactical MetCon
          </button>

          <button
            onClick={() => applyPreset('MOBILITY_RECOVERY', '45 Min Active Recovery & Mobility', 0.75, 'ZONE_2_STEADY', 115, 220)}
            className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-all"
          >
            🧘 45 Min Mobility
          </button>
        </div>
      </div>

      {/* Quick Workout Log Modal/Form Accordion */}
      {isFormOpen && (
        <form
          onSubmit={handleWorkoutSubmit}
          className="rounded-xl border border-titan-cyan/40 bg-slate-900/90 p-5 shadow-glow-cyan backdrop-blur-xl animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Zap className="h-4 w-4 text-titan-cyan" /> LOG HIGH-LEVEL WORKOUT PROTOCOL
            </h3>
            <span className="text-xs text-emerald-400 font-mono">+350 XP REWARD</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">PILLAR CATEGORY</label>
              <select
                value={pillar}
                onChange={e => {
                  const p = e.target.value as WorkoutPillar;
                  setPillar(p);
                  if (p === 'ENDURANCE') setTitle('1 Hour Endurance / Zone 2 Base');
                  else if (p === 'STRENGTH') setTitle('1 Hour Heavy Strength Session');
                  else if (p === 'HYBRID_TACTICAL') setTitle('1.5 Hour Tactical MetCon');
                  else setTitle('45 Min Mobility & Recovery');
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-titan-cyan focus:outline-none"
              >
                <option value="ENDURANCE">🏃 Endurance / Cardio (Zone 2 - Zone 5)</option>
                <option value="STRENGTH">🏋️ Strength / Heavy Resistance</option>
                <option value="HYBRID_TACTICAL">⚡ Tactical Conditioning / MetCon</option>
                <option value="MOBILITY_RECOVERY">🧘 Active Recovery / Mobility</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">SESSION TITLE</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">DURATION (HOURS)</label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="8.0"
                value={durationHours}
                onChange={e => setDurationHours(parseFloat(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">INTENSITY / ZONE</label>
              <select
                value={intensity}
                onChange={e => setIntensity(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-titan-cyan focus:outline-none"
              >
                <option value="ZONE_2_STEADY">Zone 2 Aerobic Base (Steady)</option>
                <option value="ZONE_4_TEMPO">Zone 4 Lactate Threshold (Tempo)</option>
                <option value="ZONE_5_MAX">Zone 5 Max Aerobic (HIIT)</option>
                <option value="HEAVY_RESISTANCE">Heavy Resistance (RPE 8-9)</option>
                <option value="MODERATE_VOLUME">Moderate Volume / Density</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">PEAK HEART RATE (BPM)</label>
              <input
                type="number"
                min="60"
                max="220"
                value={peakHR}
                onChange={e => setPeakHR(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">EST. CALORIC BURN (KCAL)</label>
              <input
                type="number"
                min="50"
                max="3500"
                value={calories}
                onChange={e => setCalories(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="text-slate-400 block mb-1 text-xs">NOTES / DEBRIEF</label>
            <input
              type="text"
              placeholder="e.g. 1 hour steady state cardio in Zone 2, hydration optimal..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-xs"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-titan-cyan hover:bg-cyan-400 text-black font-bold text-xs font-mono shadow-glow-cyan"
            >
              Log Session & Lock Gains
            </button>
          </div>
        </form>
      )}

      {/* High-Level Physical Baselines Slider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Aerobic Capacity (VO2 Max) */}
        <div className="rounded-xl border border-titan-cardBorder bg-titan-card/60 p-4 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">AEROBIC ENDURANCE (VO2 MAX)</span>
              <span className="text-xs font-bold text-titan-cyan">
                {composite.metrics.vo2Max.percentile.toFixed(1)}%ile (Z = +{composite.metrics.vo2Max.zScore.toFixed(2)}σ)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              Pop Mean: 44.0 • Top 1% Titan: ≥ 65.0 ml/kg/min
            </p>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">
                {metrics.vo2Max.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">ml/kg/min</span>
            </div>

            <input
              type="range"
              min="25"
              max="80"
              step="0.5"
              value={metrics.vo2Max}
              onChange={e => updateMetrics({ vo2Max: parseFloat(e.target.value) })}
              className="w-full mt-3"
            />
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Cooper Norms</span>
            <span>{metrics.vo2Max >= 65 ? 'TITAN APEX' : `${(65.0 - metrics.vo2Max).toFixed(1)} to Top 1%`}</span>
          </div>
        </div>

        {/* Tactical 1.5-Mile Run Pace */}
        <div className="rounded-xl border border-titan-cardBorder bg-titan-card/60 p-4 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">TACTICAL 1.5-MILE PACE</span>
              <span className="text-xs font-bold text-titan-cyan">
                {composite.metrics.run15Mile.percentile.toFixed(1)}%ile (Z = +{composite.metrics.run15Mile.zScore.toFixed(2)}σ)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              Pop Mean: 12:00 (720s) • Top 1% Titan: ≤ 8:45 (525s)
            </p>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">
                {formatSecondsToTime(metrics.run15Mile)}
              </span>
              <span className="text-xs text-slate-400">{metrics.run15Mile} sec</span>
            </div>

            <input
              type="range"
              min="450"
              max="900"
              step="5"
              value={metrics.run15Mile}
              onChange={e => updateMetrics({ run15Mile: parseInt(e.target.value, 10) })}
              className="w-full mt-3"
            />
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>NSW BUD/S PST</span>
            <span>{metrics.run15Mile <= 525 ? 'TITAN APEX' : `${metrics.run15Mile - 525}s to Top 1%`}</span>
          </div>
        </div>

        {/* Upper Strength-to-Weight Power */}
        <div className="rounded-xl border border-titan-cardBorder bg-titan-card/60 p-4 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">UPPER STRENGTH POWER (1RM/BW)</span>
              <span className="text-xs font-bold text-titan-cyan">
                {composite.metrics.benchPressBW.percentile.toFixed(1)}%ile (Z = +{composite.metrics.benchPressBW.zScore.toFixed(2)}σ)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              Pop Mean: 1.10x • Top 1% Titan: ≥ 2.25x BW ({Math.round(2.25 * bw)} kg)
            </p>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">
                {(metrics.benchPressKg / bw).toFixed(2)}x BW
              </span>
              <span className="text-xs text-titan-cyan font-bold">{metrics.benchPressKg} kg</span>
            </div>

            <input
              type="range"
              min="40"
              max="220"
              step="2.5"
              value={metrics.benchPressKg}
              onChange={e => updateMetrics({ benchPressKg: parseFloat(e.target.value) })}
              className="w-full mt-3"
            />
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>BW: {bw} kg</span>
            <span>StrengthLevel Norms</span>
          </div>
        </div>

        {/* Lower / Posterior Strength Power */}
        <div className="rounded-xl border border-titan-cardBorder bg-titan-card/60 p-4 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">POSTERIOR POWER (1RM/BW)</span>
              <span className="text-xs font-bold text-titan-cyan">
                {composite.metrics.deadliftBW.percentile.toFixed(1)}%ile (Z = +{composite.metrics.deadliftBW.zScore.toFixed(2)}σ)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              Pop Mean: 1.75x • Top 1% Titan: ≥ 3.15x BW ({Math.round(3.15 * bw)} kg)
            </p>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">
                {(metrics.deadliftKg / bw).toFixed(2)}x BW
              </span>
              <span className="text-xs text-titan-cyan font-bold">{metrics.deadliftKg} kg</span>
            </div>

            <input
              type="range"
              min="60"
              max="350"
              step="5"
              value={metrics.deadliftKg}
              onChange={e => updateMetrics({ deadliftKg: parseFloat(e.target.value) })}
              className="w-full mt-3"
            />
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>BW: {bw} kg</span>
            <span>USAPL Norms</span>
          </div>
        </div>

        {/* Body Fat % */}
        <div className="rounded-xl border border-titan-cardBorder bg-titan-card/60 p-4 relative overflow-hidden flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">BODY COMPOSITION (DXA)</span>
              <span className="text-xs font-bold text-titan-cyan">
                {composite.metrics.bodyFatPercent.percentile.toFixed(1)}%ile (Z = +{composite.metrics.bodyFatPercent.zScore.toFixed(2)}σ)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              Pop Mean: 20.0% • Top 1% Titan: ≤ 8.0% Adipose
            </p>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-white">
                {metrics.bodyFatPercent.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400">DXA Standard</span>
            </div>

            <input
              type="range"
              min="5.0"
              max="30.0"
              step="0.2"
              value={metrics.bodyFatPercent}
              onChange={e => updateMetrics({ bodyFatPercent: parseFloat(e.target.value) })}
              className="w-full mt-3"
            />
            <button
              onClick={() => setActiveTab('hologram')}
              className="w-full mt-3 py-1.5 px-3 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-glow-cyan"
            >
              <Eye className="h-3.5 w-3.5 text-titan-cyan" />
              Scan Photo & Launch Neural Hologram
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>ACSM Norms</span>
            <span>{metrics.bodyFatPercent <= 8.0 ? 'TITAN APEX' : `${(metrics.bodyFatPercent - 8.0).toFixed(1)}% to Top 1%`}</span>
          </div>
        </div>
      </div>

      {/* Workout History Table */}
      <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-titan-cyan" /> WORKOUT LOG ARCHIVE
          </h3>
          <span className="text-xs text-slate-400">{workoutLogs.length} SESSIONS SAVED</span>
        </div>

        {workoutLogs.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">DATE</th>
                  <th className="pb-2">PILLAR</th>
                  <th className="pb-2">SESSION</th>
                  <th className="pb-2">DURATION</th>
                  <th className="pb-2">INTENSITY</th>
                  <th className="pb-2">CALORIES</th>
                  <th className="pb-2">NOTES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {workoutLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 text-slate-300">{log.dateDisplay}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-[10px] font-bold">
                        {log.pillar}
                      </span>
                    </td>
                    <td className="py-2.5 text-white font-semibold">{log.title}</td>
                    <td className="py-2.5 text-slate-200 font-bold">{log.durationMinutes} min ({(log.durationMinutes / 60).toFixed(1)}h)</td>
                    <td className="py-2.5 text-slate-400">{log.intensity.replace(/_/g, ' ')}</td>
                    <td className="py-2.5 text-amber-400">{log.caloricBurn || 500} kcal</td>
                    <td className="py-2.5 text-slate-400 max-w-xs truncate" title={log.notes}>
                      {log.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 font-mono">
            No workout sessions logged yet. Use the quick presets above (e.g. 1 Hr Endurance or 1 Hr Strength) to record your first session!
          </div>
        )}
      </div>
    </div>
  );
};
