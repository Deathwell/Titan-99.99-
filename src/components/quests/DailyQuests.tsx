import React, { useState } from 'react';
import {
  Award,
  Flame,
  Zap,
  Shield,
  Dumbbell,
  LineChart,
  CheckCircle2,
  Lock,
  Sparkles,
  Trophy,
  Activity,
  Layers,
  HeartPulse
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { OperatorBadgeWall } from '../achievements/OperatorBadgeWall';
import { soundEngine } from '../../lib/audio';

export const DailyQuests: React.FC = () => {
  const { profile, workoutLogs, financeLogs, composite } = useTitan();

  // Compute Total Lifetime Proof-of-Work Hours
  const totalWorkoutMinutes = workoutLogs.reduce((acc, w) => acc + (w.durationMinutes || 0), 0);
  const totalFinanceMinutes = financeLogs.reduce((acc, f) => acc + (f.durationMinutes || 0), 0);

  const totalWorkoutHours = (totalWorkoutMinutes / 60).toFixed(1);
  const totalFinanceHours = (totalFinanceMinutes / 60).toFixed(1);
  const totalLaborHours = ((totalWorkoutMinutes + totalFinanceMinutes) / 60).toFixed(1);

  const xpProgressPercent = Math.min(100, Math.round((profile.xp / 150_000) * 100));

  return (
    <div className="space-y-6 select-none font-sans">
      {/* 1. Mathematical Proof-of-Work Telemetry Header */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d14]/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-sm">
              <Trophy className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
                  PROOF OF WORK REGISTRY
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  MATHEMATICALLY PURE (NO ARTIFICIAL XP)
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white mt-0.5">
                Operator Trophies & Milestone Hall
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-950/30 font-mono text-xs text-amber-300 font-bold flex items-center gap-1.5">
              <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{profile.streakDays}D ACTIVE STREAK</span>
            </div>
          </div>
        </div>

        {/* Total Lifetime Proof-of-Work Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          {/* Total Workout Hours */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/30 to-black border border-rose-500/20 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
              <Dumbbell className="h-3.5 w-3.5 text-rose-400" />
              <span>PHYSICAL LABOR LOGGED:</span>
            </span>
            <div className="text-xl font-black text-white font-mono">
              {totalWorkoutHours} Hours
            </div>
            <span className="text-[10px] text-rose-300 block">
              {totalWorkoutMinutes.toLocaleString()} Verified Minutes
            </span>
          </div>

          {/* Total Finance Hours */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-black border border-amber-500/20 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
              <LineChart className="h-3.5 w-3.5 text-amber-400" />
              <span>FINANCE MODELING LOGGED:</span>
            </span>
            <div className="text-xl font-black text-white font-mono">
              {totalFinanceHours} Hours
            </div>
            <span className="text-[10px] text-amber-300 block">
              {totalFinanceMinutes.toLocaleString()} Verified Minutes
            </span>
          </div>

          {/* Total Combined Labor Hours */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/30 to-black border border-cyan-500/20 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>COMBINED DISCIPLINE TIME:</span>
            </span>
            <div className="text-xl font-black text-cyan-300 font-mono">
              {totalLaborHours} Hours
            </div>
            <span className="text-[10px] text-zinc-400 block">
              Direct Physical + Financial Time
            </span>
          </div>

          {/* XP Calibration to Top 0.1% */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/30 to-black border border-purple-500/20 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-purple-400" />
              <span>TOP 0.1% CALIBRATION:</span>
            </span>
            <div className="text-xl font-black text-white font-mono">
              {profile.xp.toLocaleString()} <span className="text-xs text-zinc-500 font-normal">/ 150k XP</span>
            </div>
            <span className="text-[10px] text-purple-300 block">
              {xpProgressPercent}% of 150,000 XP Apex Goal
            </span>
          </div>
        </div>

        {/* XP Integrity Note */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-sans text-zinc-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Zero Inflation Standard:</strong> In TITAN, XP is earned <strong>strictly through real logged hours (1.5 XP / min)</strong>. No artificial quest bonuses exist to dilute your true 8.15B ranking.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Collectible 3D Holographic Badges Section */}
      <OperatorBadgeWall />
    </div>
  );
};
