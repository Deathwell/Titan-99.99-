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
  Crown,
  Radio,
  Gauge,
  Plus,
  Minus,
  Clock
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';
import { triggerGlobalConfetti } from '../effects/ConfettiCanvas';
import { CountUpNumber } from '../effects/CountUpNumber';
import { MysteryLootModal, isMysteryDropClaimedToday } from '../modals/MysteryLootModal';

const TIME_PRESETS = [0, 15, 30, 45, 60, 90, 120];

export const OverviewDashboard: React.FC = () => {
  const {
    profile,
    composite,
    workoutLogs,
    financeLogs,
    setDailyTaskDuration,
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

  // Compute live duration from today's real logs
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkout = workoutLogs.find(w => w.pillar === 'STRENGTH' && w.timestamp.startsWith(todayStr));
  const todayFinance = financeLogs.find(f => (f.discipline === 'PRIVATE_EQUITY' || f.discipline === 'INVESTMENT_BANKING') && f.timestamp.startsWith(todayStr));
  const todayDiscipline = financeLogs.find(f => (f.discipline === 'QUANT_DERIVATIVES' || f.discipline === 'FACTOR_RISK') && f.timestamp.startsWith(todayStr));

  const workoutMinutes = todayWorkout?.durationMinutes || 0;
  const financeMinutes = todayFinance?.durationMinutes || 0;
  const disciplineMinutes = todayDiscipline?.durationMinutes || 0;

  const completedCount = (workoutMinutes > 0 ? 1 : 0) + (financeMinutes > 0 ? 1 : 0) + (disciplineMinutes > 0 ? 1 : 0);

  // Time-Cone Step Handler in 15-Minute Increments
  const handleDurationStep = (
    e: React.MouseEvent,
    type: 'STRENGTH' | 'MODELING' | 'QUANT',
    currentMin: number,
    delta: number
  ) => {
    e.stopPropagation();
    const newMinutes = Math.max(0, Math.min(180, currentMin + delta));
    setDailyTaskDuration(type, newMinutes);

    // Audio Feedback
    if (newMinutes > currentMin) {
      const pitchFactor = 0.8 + (newMinutes / 120) * 0.8;
      soundEngine.playSliderTick(pitchFactor);
      if (newMinutes % 30 === 0 && newMinutes > 0) {
        triggerGlobalConfetti(e.clientX, e.clientY);
        soundEngine.playQuestComplete();
      }
    } else {
      soundEngine.playClick(500);
    }
  };

  // Direct Time Preset Click
  const handlePresetSelect = (
    e: React.MouseEvent,
    type: 'STRENGTH' | 'MODELING' | 'QUANT',
    presetMinutes: number
  ) => {
    e.stopPropagation();
    setDailyTaskDuration(type, presetMinutes);
    const pitchFactor = 0.8 + (presetMinutes / 120) * 0.8;
    soundEngine.playSliderTick(pitchFactor);

    if (presetMinutes > 0) {
      triggerGlobalConfetti(e.clientX, e.clientY);
      soundEngine.playQuestComplete();
    } else {
      soundEngine.playClick(500);
    }
  };

  // Toggle 0 <-> 60m
  const handleQuickToggle = (
    e: React.MouseEvent,
    type: 'STRENGTH' | 'MODELING' | 'QUANT',
    currentMin: number
  ) => {
    const nextMin = currentMin > 0 ? 0 : 60;
    setDailyTaskDuration(type, nextMin);

    if (nextMin > 0) {
      triggerGlobalConfetti(e.clientX, e.clientY);
      soundEngine.playQuestComplete();
    } else {
      soundEngine.playClick(500);
    }
  };

  const topPercent = Math.max(0.01, 100 - (composite?.percentileGlobal || 50));
  const claimedDropToday = isMysteryDropClaimedToday();

  return (
    <div className="space-y-7 max-w-3xl mx-auto select-none font-sans py-2">
      {/* 1. Luxury Cockpit Greeting & Porsche Gold Streak Bezel */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#00f0ff] animate-pulse shadow-matrix-cyan" />
            <span className="text-[11px] font-bold tracking-widest text-[#00f0ff] uppercase font-mono">
              OPERATOR COCKPIT ACTIVE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {greeting}, <span className="text-metallic-silver">{profile.callsign || 'Operator'}</span>
          </h2>
        </div>

        {/* Porsche Gold Streak Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-600/20 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm shadow-porsche-gold backdrop-blur-md">
          <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="font-mono tracking-wider">{profile.streakDays}d Streak</span>
        </div>
      </div>

      {/* 2. Mercedes-AMG / Audi RS Style Telemetry Cluster */}
      <div className="mercedes-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-[#121829]/90 via-[#0a0e1a]/95 to-[#05070f]/95 border border-white/15 shadow-2xl">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-extrabold tracking-widest uppercase font-mono shadow-sm">
              <Crown className="h-3.5 w-3.5 text-amber-400" /> APEX PERFORMANCE CLUSTER
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                TOP <span className="text-metallic-cyan"><CountUpNumber end={topPercent} decimals={1} suffix="%" /></span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-xs text-slate-300">
                <Gauge className="h-4 w-4 text-cyan-400" />
                <span>Outranking <strong className="text-white font-mono text-sm"><CountUpNumber end={composite.humansDefeated / 1000000} decimals={1} suffix="M" /></strong> global contenders</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="px-3 py-1 rounded-lg bg-white/[0.06] text-white border border-white/15 text-xs font-semibold shadow-inner">
                Tier {profile.level} Operator
              </span>
              <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                {profile.xp} Total XP
              </span>
            </div>
          </div>

          {/* Supercar Speedometer Holographic Ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-[#00f0ff] via-[#8c52ff] to-[#e5b95c] p-1 shadow-matrix-cyan">
              <div className="h-full w-full rounded-full bg-[#05070e] flex flex-col items-center justify-center border border-white/10">
                <Shield className="h-9 w-9 text-cyan-400 stroke-[2] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                <span className="text-xs font-black text-white font-mono mt-1 tracking-wider">99.9%</span>
                <span className="text-[9px] text-cyan-400 font-mono tracking-widest">TITAN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 15-Minute Time-Cone Productivity Missions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400 animate-pulse" />
            <h3 className="text-xs font-black tracking-widest text-slate-300 uppercase">
              15-MIN TIME-CONE PRODUCTIVITY ({completedCount}/3)
            </h3>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono font-bold">
            MORE TIME = HIGHER XP & APEX RANK
          </span>
        </div>

        {/* Mission 1: Workout Protocol (Cyber Emerald) */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
          workoutMinutes > 0
            ? 'laser-conduit-emerald bg-emerald-950/30 border-emerald-500/50 shadow-cyber-emerald pl-5'
            : 'bg-[#0f1424]/80 border-white/10 hover:border-emerald-500/30'
        }`}>
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4">
            <div
              onClick={(e) => handleQuickToggle(e, 'STRENGTH', workoutMinutes)}
              className="flex items-center gap-3.5 cursor-pointer flex-1"
            >
              <div className={`p-2.5 rounded-xl transition-all ${
                workoutMinutes > 0
                  ? 'bg-emerald-400 text-black shadow-cyber-emerald scale-105'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}>
                <Dumbbell className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-extrabold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                    PHYSIQUE
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Physical Workout Protocol
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compound strength or aerobic zone • <strong className="text-emerald-300">+{Math.floor(workoutMinutes * 1.5)} XP Earned</strong>
                </p>
              </div>
            </div>

            {/* Stepper Buttons (-15m / +15m) */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleDurationStep(e, 'STRENGTH', workoutMinutes, -15)}
                disabled={workoutMinutes <= 0}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-90"
                title="Subtract 15 mins"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <div className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-black text-xs sm:text-sm min-w-[70px] text-center shadow-sm">
                {workoutMinutes}m
              </div>

              <button
                onClick={(e) => handleDurationStep(e, 'STRENGTH', workoutMinutes, 15)}
                className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 transition-all active:scale-90 shadow-sm"
                title="Add 15 mins"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Time Cone Segmented Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-1.5">
            {TIME_PRESETS.map((preset) => {
              const isCurrentOrPassed = workoutMinutes >= preset && preset > 0;
              const isExact = workoutMinutes === preset;
              return (
                <button
                  key={preset}
                  onClick={(e) => handlePresetSelect(e, 'STRENGTH', preset)}
                  className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    isExact
                      ? 'bg-emerald-400 text-black shadow-cyber-emerald scale-105'
                      : isCurrentOrPassed
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/[0.03] text-slate-500 hover:text-slate-300 border border-white/[0.04]'
                  }`}
                >
                  {preset === 0 ? '0m' : `${preset}m`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mission 2: Financial Mastery (Porsche Gold) */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
          financeMinutes > 0
            ? 'laser-conduit-gold bg-amber-950/30 border-amber-500/50 shadow-porsche-gold pl-5'
            : 'bg-[#0f1424]/80 border-white/10 hover:border-amber-500/30'
        }`}>
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4">
            <div
              onClick={(e) => handleQuickToggle(e, 'MODELING', financeMinutes)}
              className="flex items-center gap-3.5 cursor-pointer flex-1"
            >
              <div className={`p-2.5 rounded-xl transition-all ${
                financeMinutes > 0
                  ? 'bg-amber-400 text-black shadow-porsche-gold scale-105'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}>
                <LineChart className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-extrabold text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/30">
                    WEALTH
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Financial Modeling & Capital Markets
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  LBO debt, cash sweeps & quant drills • <strong className="text-amber-300">+{Math.floor(financeMinutes * 1.5)} XP Earned</strong>
                </p>
              </div>
            </div>

            {/* Stepper Buttons (-15m / +15m) */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleDurationStep(e, 'MODELING', financeMinutes, -15)}
                disabled={financeMinutes <= 0}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-90"
                title="Subtract 15 mins"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <div className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-black text-xs sm:text-sm min-w-[70px] text-center shadow-sm">
                {financeMinutes}m
              </div>

              <button
                onClick={(e) => handleDurationStep(e, 'MODELING', financeMinutes, 15)}
                className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-all active:scale-90 shadow-sm"
                title="Add 15 mins"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Time Cone Segmented Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-1.5">
            {TIME_PRESETS.map((preset) => {
              const isCurrentOrPassed = financeMinutes >= preset && preset > 0;
              const isExact = financeMinutes === preset;
              return (
                <button
                  key={preset}
                  onClick={(e) => handlePresetSelect(e, 'MODELING', preset)}
                  className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    isExact
                      ? 'bg-amber-400 text-black shadow-porsche-gold scale-105'
                      : isCurrentOrPassed
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                      : 'bg-white/[0.03] text-slate-500 hover:text-slate-300 border border-white/[0.04]'
                  }`}
                >
                  {preset === 0 ? '0m' : `${preset}m`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mission 3: Tactical Discipline (Electric Violet) */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
          disciplineMinutes > 0
            ? 'laser-conduit-cyan bg-purple-950/30 border-purple-500/50 shadow-electric-violet pl-5'
            : 'bg-[#0f1424]/80 border-white/10 hover:border-purple-500/30'
        }`}>
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4">
            <div
              onClick={(e) => handleQuickToggle(e, 'QUANT', disciplineMinutes)}
              className="flex items-center gap-3.5 cursor-pointer flex-1"
            >
              <div className={`p-2.5 rounded-xl transition-all ${
                disciplineMinutes > 0
                  ? 'bg-[#8c52ff] text-white shadow-electric-violet scale-105'
                  : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
              }`}>
                <Target className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-extrabold text-purple-300 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-500/30">
                    DISCIPLINE
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Cold Exposure & Sleep Hygiene
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Zero junk food, optimal hydration & recovery • <strong className="text-purple-300">+{Math.floor(disciplineMinutes * 1.5)} XP Earned</strong>
                </p>
              </div>
            </div>

            {/* Stepper Buttons (-15m / +15m) */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleDurationStep(e, 'QUANT', disciplineMinutes, -15)}
                disabled={disciplineMinutes <= 0}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-90"
                title="Subtract 15 mins"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <div className="px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono font-black text-xs sm:text-sm min-w-[70px] text-center shadow-sm">
                {disciplineMinutes}m
              </div>

              <button
                onClick={(e) => handleDurationStep(e, 'QUANT', disciplineMinutes, 15)}
                className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 transition-all active:scale-90 shadow-sm"
                title="Add 15 mins"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Time Cone Segmented Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-1.5">
            {TIME_PRESETS.map((preset) => {
              const isCurrentOrPassed = disciplineMinutes >= preset && preset > 0;
              const isExact = disciplineMinutes === preset;
              return (
                <button
                  key={preset}
                  onClick={(e) => handlePresetSelect(e, 'QUANT', preset)}
                  className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    isExact
                      ? 'bg-[#8c52ff] text-white shadow-electric-violet scale-105'
                      : isCurrentOrPassed
                      ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40'
                      : 'bg-white/[0.03] text-slate-500 hover:text-slate-300 border border-white/[0.04]'
                  }`}
                >
                  {preset === 0 ? '0m' : `${preset}m`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Audi RS Style Neural Body Scanner Telemetry Showcase */}
      <div
        onClick={() => setActiveTab('hologram')}
        className="mercedes-card p-5 bg-gradient-to-r from-[#0c1833]/90 via-[#091124]/90 to-[#180f2b]/90 border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all flex items-center justify-between group active:scale-[0.99]"
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#00f0ff] to-[#0072ff] text-black flex items-center justify-center shadow-matrix-cyan shrink-0 group-hover:scale-105 transition-transform">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-white">
                Neural Body Fat Morph Scanner
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-[9px] font-black uppercase font-mono tracking-wider">
                AI SCANNER LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload photo & drag the real-time slider from 8% to 58% Body Fat with ASMR marimba audio.
            </p>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
      </div>

      {/* 5. Luxury Watch / Gold Vault Capsule Banner */}
      <div
        onClick={() => setIsLootOpen(true)}
        className="gold-vault-card p-4 hover:border-amber-400/60 cursor-pointer transition-all flex items-center justify-between group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-porsche-gold">
            <Gift className="h-5 w-5 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-black text-amber-300 block tracking-tight">
              {claimedDropToday ? 'DAILY TITAN REWARD VAULT CLAIMED' : 'TITAN REWARD VAULT READY (1/1)'}
            </span>
            <span className="text-[11px] text-amber-200/70">
              {claimedDropToday ? 'Capsule recharging until midnight reset.' : 'Crack open today\'s titanium vault for bonus XP & rare titles.'}
            </span>
          </div>
        </div>

        <span className="text-xs font-extrabold text-amber-300 group-hover:underline px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 font-mono">
          {claimedDropToday ? 'VIEW' : 'OPEN'}
        </span>
      </div>

      {/* Mystery Loot Modal */}
      <MysteryLootModal isOpen={isLootOpen} onClose={() => setIsLootOpen(false)} />
    </div>
  );
};
