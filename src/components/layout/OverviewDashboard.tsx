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
  ChevronRight
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

  const [greeting, setGreeting] = useState<string>('Welcome');
  const [isLootOpen, setIsLootOpen] = useState<boolean>(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

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
    <div className="space-y-7 max-w-2xl mx-auto select-none py-2">
      {/* 1. Header Greeting & Streak Pill */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {greeting}, {profile.callsign || 'Operator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
            Complete your 3 daily habits to defend your streak.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/25 text-amber-300 font-semibold text-xs sm:text-sm shadow-sm">
          <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{profile.streakDays}d Streak</span>
        </div>
      </div>

      {/* 2. Hero Score Card (Ultra-Sleek Obsidian Glass) */}
      <div className="luxury-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-b from-[#0a0f1d]/90 via-[#070b14]/90 to-[#04060a]/90">
        {/* Soft Ambient Radial Light */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-center sm:text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-bold tracking-widest uppercase">
              <Sparkles className="h-3 w-3" /> TITAN STATUS
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                TOP <CountUpNumber end={topPercent} decimals={1} suffix="%" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Outranking <span className="text-white font-semibold"><CountUpNumber end={composite.humansDefeated / 1000000} decimals={1} suffix="M" /></span> humans worldwide.
              </p>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                Level {profile.level} Operator
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                {profile.xp} Total XP
              </span>
            </div>
          </div>

          {/* Platinum Gauge Ring Visualizer */}
          <div className="relative flex items-center justify-center shrink-0">
            <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 p-0.5 shadow-glow-cyan">
              <div className="h-full w-full rounded-full bg-[#05070d] flex flex-col items-center justify-center">
                <Shield className="h-8 w-8 text-sky-400 stroke-[2]" />
                <span className="text-[10px] font-bold text-slate-300 mt-1 tracking-wider font-mono">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Today's 3 Daily Habits (Refined Apple Health Cards) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            DAILY HABIT PROTOCOL
          </h3>
          <span className="text-xs text-slate-400 font-medium font-mono">
            {completedCount} / 3 Completed
          </span>
        </div>

        {/* Habit 1: Workout */}
        <div
          onClick={(e) => handleHabitToggle(e, 'STRENGTH')}
          className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-[0.99] group ${
            hasWorkoutToday
              ? 'bg-emerald-950/25 border-emerald-500/35 text-white shadow-sm'
              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-colors ${hasWorkoutToday ? 'bg-emerald-400 text-black shadow-glow-emerald' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <div className={`text-sm font-semibold tracking-tight ${hasWorkoutToday ? 'line-through text-slate-400' : 'text-white group-hover:text-sky-300 transition-colors'}`}>
                Complete Daily Physical Workout
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Hit lifting target or 30-min cardio (+50 XP)
              </div>
            </div>
          </div>

          <div>
            {hasWorkoutToday ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <Circle className="h-5 w-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            )}
          </div>
        </div>

        {/* Habit 2: Finance */}
        <div
          onClick={(e) => handleHabitToggle(e, 'MODELING')}
          className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-[0.99] group ${
            hasFinanceToday
              ? 'bg-amber-950/25 border-amber-500/35 text-white shadow-sm'
              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-colors ${hasFinanceToday ? 'bg-amber-400 text-black shadow-glow-amber' : 'bg-amber-500/10 text-amber-400'}`}>
              <LineChart className="h-5 w-5" />
            </div>
            <div>
              <div className={`text-sm font-semibold tracking-tight ${hasFinanceToday ? 'line-through text-slate-400' : 'text-white group-hover:text-sky-300 transition-colors'}`}>
                Study Financial Modeling & Markets
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Review 1 curriculum module or quant lesson (+50 XP)
              </div>
            </div>
          </div>

          <div>
            {hasFinanceToday ? (
              <CheckCircle2 className="h-5 w-5 text-amber-400" />
            ) : (
              <Circle className="h-5 w-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            )}
          </div>
        </div>

        {/* Habit 3: Discipline */}
        <div
          onClick={(e) => handleHabitToggle(e, 'QUANT')}
          className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-[0.99] group ${
            hasDisciplineToday
              ? 'bg-purple-950/25 border-purple-500/35 text-white shadow-sm'
              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-colors ${hasDisciplineToday ? 'bg-purple-400 text-black shadow-glow-purple' : 'bg-purple-500/10 text-purple-400'}`}>
              <Target className="h-5 w-5" />
            </div>
            <div>
              <div className={`text-sm font-semibold tracking-tight ${hasDisciplineToday ? 'line-through text-slate-400' : 'text-white group-hover:text-sky-300 transition-colors'}`}>
                Tactical Discipline Execution
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Cold exposure, zero junk food & sleep hygiene (+50 XP)
              </div>
            </div>
          </div>

          <div>
            {hasDisciplineToday ? (
              <CheckCircle2 className="h-5 w-5 text-purple-400" />
            ) : (
              <Circle className="h-5 w-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            )}
          </div>
        </div>
      </div>

      {/* 4. Instant AI Body Fat Scanner (Sleek Glass Banner) */}
      <div
        onClick={() => setActiveTab('hologram')}
        className="luxury-card p-5 bg-gradient-to-r from-[#0a1122]/90 via-[#070d1a]/90 to-[#0d0a1c]/90 border-white/[0.08] hover:border-sky-400/40 cursor-pointer transition-all flex items-center justify-between group active:scale-[0.99]"
      >
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 text-black flex items-center justify-center shadow-glow-cyan shrink-0 group-hover:scale-105 transition-transform">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight">
                Neural Body Fat Morph
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-sky-400/10 text-sky-300 border border-sky-400/20 text-[9px] font-bold tracking-wider uppercase font-mono">
                AI SCANNER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload your photo & drag the slider from 8% to 58% Body Fat in real-time.
            </p>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* 5. Daily Mystery Drop Banner */}
      <div
        onClick={() => setIsLootOpen(true)}
        className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] cursor-pointer transition-all flex items-center justify-between group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Gift className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block tracking-tight">
              {claimedDropToday ? 'Daily Mystery Drop Claimed' : 'Daily Mystery Drop Ready (1/1)'}
            </span>
            <span className="text-[11px] text-slate-400">
              {claimedDropToday ? 'Capsule is recharging until midnight.' : 'Tap to crack open today\'s capsule for bonus XP & rare titles.'}
            </span>
          </div>
        </div>

        <span className="text-xs text-purple-300 font-semibold group-hover:text-purple-200">
          {claimedDropToday ? 'View' : 'Open'}
        </span>
      </div>

      {/* Mystery Loot Modal */}
      <MysteryLootModal isOpen={isLootOpen} onClose={() => setIsLootOpen(false)} />
    </div>
  );
};
