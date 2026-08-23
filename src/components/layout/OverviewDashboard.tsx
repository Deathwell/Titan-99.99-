import React, { useState, useEffect, useRef } from 'react';
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
  Clock,
  Moon
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';
import { triggerGlobalConfetti } from '../effects/ConfettiCanvas';
import { CountUpNumber } from '../effects/CountUpNumber';
import { MysteryLootModal, isMysteryDropClaimedToday } from '../modals/MysteryLootModal';
import { ThreatClockBanner } from './ThreatClockBanner';
import { TodayMonteCarloOracle } from './TodayMonteCarloOracle';
import { DarkeningPrecisionSlider } from '../action/DarkeningPrecisionSlider';

export const OverviewDashboard: React.FC = () => {
  const {
    profile,
    composite,
    workoutLogs,
    financeLogs,
    setDailyTaskDuration,
    toggleDailyAccomplishment,
    setActiveTab,
    openVictoryModal,
    todayRewardClaim
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
  const hasDisciplineToday = financeLogs.some(f => (f.discipline === 'QUANT_DERIVATIVES' || f.discipline === 'FACTOR_RISK') && f.timestamp.startsWith(todayStr));

  const workoutMinutes = todayWorkout?.durationMinutes || 0;
  const financeMinutes = todayFinance?.durationMinutes || 0;

  const completedCount = (workoutMinutes > 0 ? 1 : 0) + (financeMinutes > 0 ? 1 : 0) + (hasDisciplineToday ? 1 : 0);

  // Slider Drag Handler
  const handleDurationChange = (
    type: 'STRENGTH' | 'MODELING',
    newMinutes: number,
    clientX?: number,
    clientY?: number
  ) => {
    setDailyTaskDuration(type, newMinutes);

    if (newMinutes === 240) {
      if (clientX && clientY) triggerGlobalConfetti(clientX, clientY);
      soundEngine.playMilestoneFanfare();
    }
  };

  // Clean 1-Tap Toggle for Sleep / Tactical Discipline (No Slider)
  const handleDisciplineToggle = (e: React.MouseEvent) => {
    const isNowDone = toggleDailyAccomplishment('QUANT');
    if (isNowDone) {
      triggerGlobalConfetti(e.clientX, e.clientY);
      soundEngine.playQuestComplete();
    } else {
      soundEngine.playClick(600);
    }
  };

  const todayWorkoutXP = Math.floor(workoutMinutes * 1.5);
  const todayFinanceXP = Math.floor(financeMinutes * 1.5);
  const todayDisciplineXP = hasDisciplineToday ? 50 : 0;
  const todayTotalXP = todayWorkoutXP + todayFinanceXP + todayDisciplineXP;

  const topPercent = Math.max(0.01, 100 - (composite?.percentileGlobal || 50));
  const claimedDropToday = isMysteryDropClaimedToday();

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none font-sans px-2 sm:px-4 py-2">
      {/* 1. Executive Telemetry Overview Card */}
      <div className="luxury-card p-5 sm:p-6 relative overflow-hidden bg-[#0c0c11]/90 border border-white/[0.08] shadow-2xl backdrop-blur-2xl">
        {/* Subtle Ambient Lighting */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative space-y-5">
          {/* Header Row: Greeting & Live Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ff2e4d] animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-[#ff2e4d] uppercase font-mono">
                  OPERATOR ACTIVE
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  8.15B Global Population
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight mt-1">
                {greeting}, <span className="text-zinc-300 font-normal capitalize">{profile.callsign || 'Operator'}</span>
              </h2>
            </div>

            {/* Badges: Today XP & Streak */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 font-semibold text-xs backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span className="font-mono font-bold">
                  <CountUpNumber end={todayTotalXP} decimals={0} prefix="+" suffix=" XP Today" />
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 font-semibold text-xs backdrop-blur-md">
                <Flame className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
                <span className="font-mono font-bold">{profile.streakDays}d Streak</span>
              </div>
            </div>
          </div>

          {/* 4-Column Balanced Telemetry Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Stat 1: Global Standing */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
              <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase block">
                GLOBAL STANDING
              </span>
              <div className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                Top <CountUpNumber end={topPercent} decimals={topPercent < 1 ? 2 : 1} suffix="%" />
              </div>
              <span className="text-[11px] text-zinc-400 mt-0.5 block">
                {composite.oneInNFormatted}
              </span>
            </div>

            {/* Stat 2: Global Rank */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
              <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase block">
                PLANETARY RANK
              </span>
              <div className="text-lg sm:text-xl font-mono font-bold text-zinc-100 mt-1">
                {composite.globalRankFormatted}
              </div>
              <span className="text-[11px] text-zinc-400 mt-0.5 block">
                vs 8.15B Humans
              </span>
            </div>

            {/* Stat 3: Humans Defeated */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
              <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase block">
                OUTRANKED
              </span>
              <div className="text-lg sm:text-xl font-mono font-bold text-rose-300 mt-1">
                <CountUpNumber end={composite.humansDefeated / 1_000_000} decimals={1} suffix="M" />
              </div>
              <span className="text-[11px] text-zinc-400 mt-0.5 block">
                Humans Defeated
              </span>
            </div>

            {/* Stat 4: Operator Tier */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
              <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase block">
                OPERATOR TIER
              </span>
              <div className="text-lg sm:text-xl font-mono font-bold text-amber-300 mt-1">
                Tier {profile.level}
              </div>
              <span className="text-[11px] text-zinc-400 mt-0.5 block">
                Ascendant Status
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Road to 99.9%+ (Top 0.1% Club) Target Telemetry */}
      <div className={`p-4 sm:p-5 rounded-2xl border font-sans text-xs transition-all ${
        composite.isApexTopPointOne
          ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_25px_rgba(255,46,77,0.25)]'
          : 'bg-[#101015]/90 border-white/[0.08]'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border shrink-0 ${
              composite.isApexTopPointOne
                ? 'bg-rose-500/25 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-white/[0.05] border-white/10 text-rose-400'
            }`}>
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">
                {composite.isApexTopPointOne
                  ? '👑 APEX 99.9%+ STATUS ACHIEVED'
                  : '🎯 MISSION OBJECTIVE: BREACH TOP 0.1% GLOBALLY (99.9%+)'}
              </span>
              <span className="text-xs text-zinc-400 mt-0.5 block">
                {composite.isApexTopPointOne
                  ? 'You are officially in the top 1 in 1,000 humans on the planet across dual-domain fitness & finance.'
                  : `Currently ${composite.percentileGlobal.toFixed(2)}th percentile vs 8.15B humans. Z-Score Distance to Top 0.1%: +${composite.gapToTopPointOneZ.toFixed(2)}σ`}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] text-zinc-500 uppercase block">TITAN TARGET THRESHOLD</span>
            <span className="text-xs font-bold text-rose-400">TOP 0.10% (#8.15M RANK)</span>
          </div>
        </div>
      </div>

      {/* 2. Inactivity Threat & Contender Overtake Radar */}
      <ThreatClockBanner />

      {/* 3. Daily Excellence Tasks with Darkening Progressive Sliders */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-[#ff2e4d] animate-pulse" />
            <h3 className="text-[11px] font-bold tracking-widest text-zinc-300 uppercase font-mono">
              DAILY PROTOCOLS ({completedCount}/3)
            </h3>
          </div>
          <span className="text-[10px] text-rose-400 font-mono font-bold">
            DRAG FORWARD TO DEEPEN INTENSITY
          </span>
        </div>

        {/* Task 1: Workout Protocol (Velvet Crimson) */}
        <div className={`p-4 rounded-xl border transition-all duration-200 ${
          workoutMinutes > 0
            ? 'laser-conduit-crimson bg-rose-950/15 border-rose-500/30 pl-4'
            : 'bg-[#121217]/80 border-white/[0.07] hover:border-white/15'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-all ${
                workoutMinutes > 0
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                <Dumbbell className="h-4 w-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-950/50 px-1.5 py-0.2 rounded border border-rose-500/25">
                    PHYSIQUE
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    Physical Workout Protocol
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Compound strength or aerobic stamina (up to 4h)
                </p>
              </div>
            </div>

            {workoutMinutes > 0 ? (
              <CheckCircle2 className="h-5 w-5 text-rose-400" />
            ) : (
              <Circle className="h-5 w-5 text-zinc-600" />
            )}
          </div>

          {/* Darkening Precision Slider */}
          <DarkeningPrecisionSlider
            value={workoutMinutes}
            onChange={(val, x, y) => handleDurationChange('STRENGTH', val, x, y)}
            accentColor="crimson"
            title="Workout"
          />
        </div>

        {/* Task 2: Financial Mastery (Porsche Gold) */}
        <div className={`p-4 rounded-xl border transition-all duration-200 ${
          financeMinutes > 0
            ? 'laser-conduit-gold bg-amber-950/15 border-amber-500/30 pl-4'
            : 'bg-[#121217]/80 border-white/[0.07] hover:border-white/15'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-all ${
                financeMinutes > 0
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                <LineChart className="h-4 w-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-500/25">
                    WEALTH
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    Financial Modeling & Capital Markets
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  LBO models, debt structuring & quant analysis (up to 4h)
                </p>
              </div>
            </div>

            {financeMinutes > 0 ? (
              <CheckCircle2 className="h-5 w-5 text-amber-400" />
            ) : (
              <Circle className="h-5 w-5 text-zinc-600" />
            )}
          </div>

          {/* Darkening Precision Slider */}
          <DarkeningPrecisionSlider
            value={financeMinutes}
            onChange={(val, x, y) => handleDurationChange('MODELING', val, x, y)}
            accentColor="gold"
            title="Finance"
          />
        </div>

        {/* Task 3: Sleep Hygiene & Tactical Discipline */}
        <div
          onClick={handleDisciplineToggle}
          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group active:scale-[0.99] ${
            hasDisciplineToday
              ? 'laser-conduit-crimson bg-rose-950/15 border-rose-500/30 text-white pl-4'
              : 'bg-[#121217]/80 border-white/[0.07] hover:border-white/15'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-all ${
              hasDisciplineToday
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105'
            }`}>
              <Moon className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold text-rose-300 bg-rose-950/50 px-1.5 py-0.2 rounded border border-rose-500/25">
                  DISCIPLINE
                </span>
                <span className={`text-xs sm:text-sm font-bold tracking-tight ${hasDisciplineToday ? 'line-through text-zinc-400' : 'text-white'}`}>
                  8-Hour Sleep Hygiene & Recovery Protocol
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Zero junk food, optimal hydration, no screens before bed (+50 XP)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono text-[10px] font-semibold">
              +50 XP
            </span>
            <div>
              {hasDisciplineToday ? (
                <CheckCircle2 className="h-5 w-5 text-rose-400" />
              ) : (
                <Circle className="h-5 w-5 text-zinc-600 group-hover:text-rose-400 transition-colors" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. The Oracle: Live 10,000-Path Monte Carlo Stochastic Destiny Simulator */}
      <TodayMonteCarloOracle
        workoutMinutes={workoutMinutes}
        financeMinutes={financeMinutes}
      />

      {/* 4. Guilt-Free Nightly Victory Reward Selector (Requires 4h Workout + 4h Finance MAX) */}
      {workoutMinutes >= 240 && financeMinutes >= 240 ? (
        <div
          onClick={openVictoryModal}
          className="p-4 rounded-2xl border-2 border-purple-500/60 bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-purple-950/80 shadow-[0_0_25px_rgba(168,85,247,0.25)] cursor-pointer transition-all flex flex-wrap items-center justify-between gap-4 group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-purple-900/80 border border-purple-400 text-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              {todayRewardClaim ? todayRewardClaim.icon : '🏆'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-900 text-purple-200 text-[10px] font-mono font-bold tracking-wider border border-purple-400">
                  {todayRewardClaim ? 'GUILT-FREE REWARD ACTIVE' : '4H + 4H MAX CONQUEST REACHED'}
                </span>
                <span className="text-emerald-300 text-xs font-bold flex items-center gap-1 font-mono">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin" /> 100% MAX REWARD UNLOCKED
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-white mt-1">
                {todayRewardClaim
                  ? `${todayRewardClaim.icon} ${todayRewardClaim.title.toUpperCase()}`
                  : 'CHOOSE YOUR GUILT-FREE NIGHTLY REWARD'}
              </h4>
              <p className="text-[11px] text-purple-200 mt-0.5">
                {todayRewardClaim
                  ? 'Guilt-free indulgence active for tonight. Relax with zero procrastination anxiety!'
                  : 'Both Workout (4h MAX) and Finance (4h MAX) completed! Claim your reward.'}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openVictoryModal();
            }}
            className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs shadow-glow-purple flex items-center gap-2 transition-all transform active:scale-95 whitespace-nowrap"
          >
            <Gift className="h-4 w-4" />
            <span>{todayRewardClaim ? 'Change Reward' : 'Claim Reward (+150 XP)'}</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#0c0d14]/70 transition-all space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/[0.03] text-zinc-500 border border-white/[0.06]">
                <Lock className="h-4 w-4 text-zinc-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-300">
                    Guilt-Free Nightly Reward
                  </span>
                  <span className="text-[9px] font-mono text-rose-400 px-1.5 py-0.2 rounded bg-rose-950/50 border border-rose-500/20 font-bold">
                    LOCKED (REQUIRES 4H & 4H MAX)
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Slide both Workout to <strong className="text-white">4h MAX</strong> ({workoutMinutes}/240m) & Finance to <strong className="text-white">4h MAX</strong> ({financeMinutes}/240m) to unlock.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-zinc-400 font-bold">
              {Math.round(((workoutMinutes + financeMinutes) / 480) * 100)}% to Unlock
            </span>
          </div>

          {/* Dual Progress Bars */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                <span>Workout: {Math.floor(workoutMinutes / 60)}h {workoutMinutes % 60}m / 4h</span>
                <span className={workoutMinutes >= 240 ? 'text-emerald-400 font-bold' : ''}>{workoutMinutes >= 240 ? 'MAX ✓' : ''}</span>
              </div>
              <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, (workoutMinutes / 240) * 100)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                <span>Finance: {Math.floor(financeMinutes / 60)}h {financeMinutes % 60}m / 4h</span>
                <span className={financeMinutes >= 240 ? 'text-amber-400 font-bold' : ''}>{financeMinutes >= 240 ? 'MAX ✓' : ''}</span>
              </div>
              <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, (financeMinutes / 240) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Neural Body Scanner Showcase */}
      <div
        onClick={() => setActiveTab('hologram')}
        className="luxury-card p-4 bg-[#121217]/80 hover:border-rose-500/30 cursor-pointer transition-all flex items-center justify-between group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Neural Body Fat Morph Scanner
              </h4>
              <span className="px-1.5 py-0.2 rounded-full bg-rose-400/10 text-rose-300 border border-rose-400/25 text-[8px] font-bold uppercase font-mono tracking-wider">
                AI SCANNER
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Upload photo & drag the real-time slider from 8% to 58% Body Fat with ASMR marimba audio.
            </p>
          </div>
        </div>

        <ChevronRight className="h-4 w-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
      </div>

      {/* 4. Reward Vault Banner */}
      <div
        onClick={() => setIsLootOpen(true)}
        className="gold-vault-card p-3.5 hover:border-amber-400/40 cursor-pointer transition-all flex items-center justify-between group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/25 shadow-sm">
            <Gift className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 block tracking-tight">
              {claimedDropToday ? 'DAILY TITAN REWARD VAULT CLAIMED' : 'TITAN REWARD VAULT READY (1/1)'}
            </span>
            <span className="text-[10px] text-amber-200/60">
              {claimedDropToday ? 'Capsule recharging until midnight reset.' : 'Crack open today\'s titanium vault for bonus XP & rare titles.'}
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-300 group-hover:underline px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/25 font-mono">
          {claimedDropToday ? 'VIEW' : 'OPEN'}
        </span>
      </div>

      {/* Mystery Loot Modal */}
      <MysteryLootModal isOpen={isLootOpen} onClose={() => setIsLootOpen(false)} />
    </div>
  );
};
