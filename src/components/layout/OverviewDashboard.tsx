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
  Lock
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
    toggleDailyAccomplishment,
    setActiveTab,
    gainXP
  } = useTitan();

  const [greeting, setGreeting] = useState<string>('Welcome');
  const [isLootOpen, setIsLootOpen] = useState<boolean>(false);
  const [habitsCompleted, setHabitsCompleted] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Load today's completed habit state from localStorage
    const todayKey = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`titan_habits_${todayKey}`);
    if (saved) {
      try {
        setHabitsCompleted(JSON.parse(saved));
      } catch {
        // Ignore
      }
    }
  }, []);

  const handleHabitToggle = (e: React.MouseEvent, habitId: string, habitType: 'STRENGTH' | 'MODELING' | 'QUANT') => {
    const isNowDone = !habitsCompleted[habitId];
    const updated = { ...habitsCompleted, [habitId]: isNowDone };
    setHabitsCompleted(updated);

    const todayKey = new Date().toISOString().split('T')[0];
    localStorage.setItem(`titan_habits_${todayKey}`, JSON.stringify(updated));

    if (isNowDone) {
      triggerGlobalConfetti(e.clientX, e.clientY);
      soundEngine.playQuestComplete();
      gainXP(50);
      toggleDailyAccomplishment(habitType);
    } else {
      soundEngine.playClick(600);
    }
  };

  const topPercent = Math.max(0.01, 100 - (composite?.percentileGlobal || 50));
  const claimedDropToday = isMysteryDropClaimedToday();

  return (
    <div className="space-y-6 max-w-2xl mx-auto select-none">
      {/* 1. Header Greeting & Streak */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {greeting}, {profile.callsign || 'Operator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Complete your 3 daily habits to defend your streak.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm">
          <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{profile.streakDays}d Streak</span>
        </div>
      </div>

      {/* 2. Hero Score Card (Strava / Apple Fitness Style) */}
      <div className="social-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-b from-[#0e1424] to-[#080c18] border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <span className="text-[11px] font-extrabold tracking-widest text-cyan-400 uppercase font-mono">
              GLOBAL TITAN RANK
            </span>
            <div className="flex items-baseline justify-center sm:justify-start gap-2 my-1">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                TOP <CountUpNumber end={topPercent} decimals={1} suffix="%" />
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              You currently outrank <strong className="text-slate-200"><CountUpNumber end={composite.humansDefeated / 1000000} decimals={1} suffix="M" /></strong> humans worldwide.
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Level {profile.level} Operator
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {profile.xp} Total XP
              </span>
            </div>
          </div>

          {/* Quick Circular Progress Visualizer */}
          <div className="relative flex items-center justify-center shrink-0">
            <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-400 p-1 shadow-glow-cyan">
              <div className="h-full w-full rounded-full bg-black flex flex-col items-center justify-center">
                <Shield className="h-8 w-8 text-cyan-400 stroke-[2.5]" />
                <span className="text-[10px] font-extrabold text-white mt-1">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Today's 3 Daily Habits (1-Tap Complete) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white tracking-tight">
            TODAY'S 3 DAILY HABITS
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {Object.values(habitsCompleted).filter(Boolean).length} / 3 Completed
          </span>
        </div>

        {/* Habit 1: Workout */}
        <div
          onClick={(e) => handleHabitToggle(e, 'habit_workout', 'STRENGTH')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between active:scale-[0.98] ${
            habitsCompleted['habit_workout']
              ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`p-2.5 rounded-xl ${habitsCompleted['habit_workout'] ? 'bg-emerald-500 text-black shadow-glow-emerald' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${habitsCompleted['habit_workout'] ? 'line-through text-slate-400' : 'text-white'}`}>
                Complete Daily Physical Workout
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Hit lifting target or 30-min cardio (+50 XP)
              </div>
            </div>
          </div>

          <div>
            {habitsCompleted['habit_workout'] ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            ) : (
              <Circle className="h-6 w-6 text-slate-500 hover:text-slate-300" />
            )}
          </div>
        </div>

        {/* Habit 2: Finance */}
        <div
          onClick={(e) => handleHabitToggle(e, 'habit_finance', 'MODELING')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between active:scale-[0.98] ${
            habitsCompleted['habit_finance']
              ? 'bg-amber-950/20 border-amber-500/40 text-white'
              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`p-2.5 rounded-xl ${habitsCompleted['habit_finance'] ? 'bg-amber-500 text-black shadow-glow-amber' : 'bg-amber-500/10 text-amber-400'}`}>
              <LineChart className="h-5 w-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${habitsCompleted['habit_finance'] ? 'line-through text-slate-400' : 'text-white'}`}>
                Study Financial Modeling & Markets
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Review 1 curriculum module or quant lesson (+50 XP)
              </div>
            </div>
          </div>

          <div>
            {habitsCompleted['habit_finance'] ? (
              <CheckCircle2 className="h-6 w-6 text-amber-400" />
            ) : (
              <Circle className="h-6 w-6 text-slate-500 hover:text-slate-300" />
            )}
          </div>
        </div>

        {/* Habit 3: Discipline */}
        <div
          onClick={(e) => handleHabitToggle(e, 'habit_discipline', 'QUANT')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between active:scale-[0.98] ${
            habitsCompleted['habit_discipline']
              ? 'bg-purple-950/20 border-purple-500/40 text-white'
              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`p-2.5 rounded-xl ${habitsCompleted['habit_discipline'] ? 'bg-purple-500 text-black shadow-glow-purple' : 'bg-purple-500/10 text-purple-400'}`}>
              <Target className="h-5 w-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${habitsCompleted['habit_discipline'] ? 'line-through text-slate-400' : 'text-white'}`}>
                Tactical Discipline Execution
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Cold exposure, zero junk food & sleep hygiene (+50 XP)
              </div>
            </div>
          </div>

          <div>
            {habitsCompleted['habit_discipline'] ? (
              <CheckCircle2 className="h-6 w-6 text-purple-400" />
            ) : (
              <Circle className="h-6 w-6 text-slate-500 hover:text-slate-300" />
            )}
          </div>
        </div>
      </div>

      {/* 4. Instant AI Body Fat Scanner Callout */}
      <div
        onClick={() => setActiveTab('hologram')}
        className="social-card p-5 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98]"
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-cyan-400 text-black flex items-center justify-center shadow-glow-cyan shrink-0 group-hover:scale-105 transition-transform">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-extrabold text-white">
                Neural Body Fat Morph
              </h4>
              <span className="px-1.5 py-0.5 rounded bg-cyan-400 text-black text-[9px] font-black uppercase">
                AI Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload your photo & drag the slider from 8% to 58% Body Fat in real-time.
            </p>
          </div>
        </div>

        <ArrowRight className="h-5 w-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
      </div>

      {/* 5. Daily Mystery Drop Banner */}
      <div
        onClick={() => setIsLootOpen(true)}
        className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] cursor-pointer transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <Gift className="h-5 w-5 text-purple-400 animate-bounce" />
          <div>
            <span className="text-xs font-bold text-white block">
              {claimedDropToday ? 'Daily Mystery Drop Claimed' : 'Daily Mystery Drop Ready (1/1)'}
            </span>
            <span className="text-[11px] text-slate-400">
              {claimedDropToday ? 'Capsule is recharging until midnight.' : 'Tap to crack open today\'s capsule for bonus XP & rare titles.'}
            </span>
          </div>
        </div>

        <span className="text-xs text-purple-400 font-bold group-hover:underline">
          {claimedDropToday ? 'View' : 'Open'}
        </span>
      </div>

      {/* Mystery Loot Modal */}
      <MysteryLootModal isOpen={isLootOpen} onClose={() => setIsLootOpen(false)} />
    </div>
  );
};
