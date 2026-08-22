import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  LineChart,
  Target,
  Sparkles,
  CheckCircle2,
  Circle,
  Flame,
  ArrowRight,
  Gift,
  Award,
  Zap,
  TrendingUp,
  Shield,
  Eye,
  Lock,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';
import { triggerGlobalConfetti } from '../effects/ConfettiCanvas';
import { CountUpNumber } from '../effects/CountUpNumber';
import { MysteryLootModal, isMysteryDropClaimedToday } from '../modals/MysteryLootModal';

export const OverviewDashboard: React.FC = () => {
  const {
    profile,
    composite,
    workoutLogs,
    financeLogs,
    toggleDailyAccomplishment,
    setActiveTab
  } = useTitan();

  const [isLootOpen, setIsLootOpen] = useState<boolean>(false);

  // Compute live state from today's real logs
  const todayStr = new Date().toISOString().split('T')[0];
  const hasWorkoutToday = workoutLogs.some(w => w.pillar === 'STRENGTH' && w.timestamp.startsWith(todayStr));
  const hasFinanceToday = financeLogs.some(f => (f.discipline === 'PRIVATE_EQUITY' || f.discipline === 'INVESTMENT_BANKING') && f.timestamp.startsWith(todayStr));
  const hasDisciplineToday = financeLogs.some(f => (f.discipline === 'QUANT_DERIVATIVES' || f.discipline === 'FACTOR_RISK') && f.timestamp.startsWith(todayStr));

  const completedCount = (hasWorkoutToday ? 1 : 0) + (hasFinanceToday ? 1 : 0) + (hasDisciplineToday ? 1 : 0);

  const handleHabitToggle = (e: React.MouseEvent, habitType: 'STRENGTH' | 'MODELING' | 'QUANT') => {
    const isNowRecorded = toggleDailyAccomplishment(habitType);

    if (isNowRecorded) {
      triggerGlobalConfetti(e.clientX, e.clientY);
      soundEngine.playQuestComplete();
    } else {
      soundEngine.playClick(600);
    }
  };

  const topPercent = Math.max(0.01, 100 - (composite?.percentileGlobal || 50));
  const claimedDropToday = isMysteryDropClaimedToday();

  return (
    <div className="space-y-6 max-w-3xl mx-auto select-none font-sans py-1">
      {/* 1. Linear Breadcrumb & View Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#8a8f98]">
          <span>Titan</span>
          <span>/</span>
          <span className="text-[#ededef] font-semibold">Today's Protocol</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs">
            <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span className="text-white font-semibold">{profile.streakDays}d Streak</span>
          </div>
        </div>
      </div>

      {/* 2. Linear Hero Card with Signature Glowing Beam */}
      <div className="linear-beam-card p-6 sm:p-7 relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#5e6ad2]/15 text-[#7c88f2] border border-[#5e6ad2]/30 text-[10px] font-bold tracking-wider uppercase font-mono">
              <Sparkles className="h-3 w-3 text-[#56b6f7]" /> PERCENTILE APEX
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                TOP <CountUpNumber end={topPercent} decimals={1} suffix="%" /> GLOBAL RANK
              </div>
              <p className="text-xs text-[#8a8f98] mt-1">
                Outranking <span className="text-white font-medium"><CountUpNumber end={composite.humansDefeated / 1000000} decimals={1} suffix="M" /></span> humans worldwide in physiological and financial stamina.
              </p>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="px-2.5 py-1 rounded bg-white/[0.04] text-[#ededef] border border-white/[0.08] text-xs font-medium">
                Level {profile.level} Operator
              </span>
              <span className="px-2.5 py-1 rounded bg-[#5e6ad2]/10 text-[#7c88f2] border border-[#5e6ad2]/20 text-xs font-mono font-medium">
                {profile.xp} XP Earned
              </span>
            </div>
          </div>

          {/* Minimalist Linear Ring Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-[#5e6ad2] to-[#56b6f7] p-0.5 shadow-glow-indigo">
              <div className="h-full w-full rounded-full bg-[#0e0f15] flex flex-col items-center justify-center">
                <Shield className="h-7 w-7 text-[#56b6f7]" />
                <span className="text-[10px] font-bold text-white font-mono mt-0.5">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Linear-Style Issue & Daily Habit Rows */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs text-[#8a8f98]">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            ACTIVE HABITS ({completedCount}/3)
          </span>
          <span className="text-[11px] font-mono">1-TAP TOGGLE</span>
        </div>

        {/* Habit Row 1: Workout */}
        <div
          onClick={(e) => handleHabitToggle(e, 'STRENGTH')}
          className={`px-4 py-3 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between group ${
            hasWorkoutToday
              ? 'bg-emerald-950/20 border-[#30a46c]/40 text-[#ededef]'
              : 'bg-[#12141c]/60 border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="text-slate-500 group-hover:text-white transition-colors">
              {hasWorkoutToday ? (
                <CheckCircle2 className="h-4 w-4 text-[#30a46c]" />
              ) : (
                <Circle className="h-4 w-4 text-slate-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-[#8a8f98]">TITAN-1</span>
                <span className={`text-xs font-semibold ${hasWorkoutToday ? 'line-through text-slate-500' : 'text-white'}`}>
                  Complete Daily Physical Workout
                </span>
              </div>
              <p className="text-[11px] text-[#8a8f98] mt-0.5">
                Hit compound lifting target or 30-min cardio zone
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              +50 XP
            </span>
          </div>
        </div>

        {/* Habit Row 2: Finance */}
        <div
          onClick={(e) => handleHabitToggle(e, 'MODELING')}
          className={`px-4 py-3 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between group ${
            hasFinanceToday
              ? 'bg-amber-950/20 border-[#f5a623]/40 text-[#ededef]'
              : 'bg-[#12141c]/60 border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="text-slate-500 group-hover:text-white transition-colors">
              {hasFinanceToday ? (
                <CheckCircle2 className="h-4 w-4 text-[#f5a623]" />
              ) : (
                <Circle className="h-4 w-4 text-slate-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-[#8a8f98]">TITAN-2</span>
                <span className={`text-xs font-semibold ${hasFinanceToday ? 'line-through text-slate-500' : 'text-white'}`}>
                  Study Financial Modeling & Capital Markets
                </span>
              </div>
              <p className="text-[11px] text-[#8a8f98] mt-0.5">
                Review 1 curriculum module or quant lesson
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
              +50 XP
            </span>
          </div>
        </div>

        {/* Habit Row 3: Discipline */}
        <div
          onClick={(e) => handleHabitToggle(e, 'QUANT')}
          className={`px-4 py-3 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between group ${
            hasDisciplineToday
              ? 'bg-purple-950/20 border-[#5e6ad2]/40 text-[#ededef]'
              : 'bg-[#12141c]/60 border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="text-slate-500 group-hover:text-white transition-colors">
              {hasDisciplineToday ? (
                <CheckCircle2 className="h-4 w-4 text-[#5e6ad2]" />
              ) : (
                <Circle className="h-4 w-4 text-slate-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-[#8a8f98]">TITAN-3</span>
                <span className={`text-xs font-semibold ${hasDisciplineToday ? 'line-through text-slate-500' : 'text-white'}`}>
                  Tactical Discipline & Sleep Hygiene
                </span>
              </div>
              <p className="text-[11px] text-[#8a8f98] mt-0.5">
                Cold shower, zero processed junk food & 8h sleep
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-[#5e6ad2]/10 text-[#7c88f2] border border-[#5e6ad2]/20 text-[10px] font-bold">
              +50 XP
            </span>
          </div>
        </div>
      </div>

      {/* 4. Linear-Style Quick AI Body Scanner Card */}
      <div
        onClick={() => setActiveTab('hologram')}
        className="linear-card p-4 hover:border-[#56b6f7]/40 cursor-pointer transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-3.5">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#5e6ad2] to-[#56b6f7] text-white flex items-center justify-center shadow-sm shrink-0">
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Neural Body Fat Morph</span>
              <span className="px-1.5 py-0.2 rounded bg-[#56b6f7]/10 text-[#56b6f7] border border-[#56b6f7]/20 text-[9px] font-mono font-bold">
                AI SCANNER
              </span>
            </div>
            <p className="text-[11px] text-[#8a8f98] mt-0.5">
              Upload photo & drag slider from 8% to 58% Body Fat in real-time.
            </p>
          </div>
        </div>

        <ChevronRight className="h-4 w-4 text-[#8a8f98] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* 5. Daily Mystery Drop Action Row */}
      <div
        onClick={() => setIsLootOpen(true)}
        className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] cursor-pointer transition-all flex items-center justify-between group text-xs"
      >
        <div className="flex items-center gap-3">
          <Gift className="h-4 w-4 text-[#7c88f2]" />
          <div>
            <span className="font-semibold text-white">
              {claimedDropToday ? 'Daily Drop Claimed' : 'Daily Mystery Drop Ready (1/1)'}
            </span>
            <span className="text-[11px] text-[#8a8f98] ml-2">
              {claimedDropToday ? 'Capsule recharging until midnight' : 'Claim daily XP & operator titles'}
            </span>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#7c88f2] group-hover:underline">
          {claimedDropToday ? 'View' : 'Open'}
        </span>
      </div>

      {/* Mystery Loot Modal */}
      <MysteryLootModal isOpen={isLootOpen} onClose={() => setIsLootOpen(false)} />
    </div>
  );
};
