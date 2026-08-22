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

// Helper to format minutes into clean luxury readouts
function formatDurationLabel(minutes: number): { time: string; xp: number; isMax: boolean } {
  const isMax = minutes >= 240;
  const xp = Math.floor(minutes * 1.5);

  if (minutes === 0) {
    return { time: '0m', xp: 0, isMax: false };
  }

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  let time = '';
  if (h > 0 && m > 0) {
    time = `${h}h ${m}m`;
  } else if (h > 0) {
    time = `${h}h 00m`;
  } else {
    time = `${m}m`;
  }

  return { time, xp, isMax };
}

// Compute dynamic DARKENING luminescence (gets darker & deeper as you slide forward)
function getDarkeningLuminescence(value: number, accentColor: 'emerald' | 'gold') {
  const ratio = Math.max(0, Math.min(1, value / 240));
  const isEmerald = accentColor === 'emerald';
  const hue = isEmerald ? 156 : 42; // 156 = Cyber Emerald, 42 = Porsche Gold

  if (value === 0) {
    return {
      ratio: 0,
      lightness: 65,
      glowRadius: 0,
      primaryColor: '#64748b',
      fillGradient: 'rgba(255,255,255,0.06)',
      glowColor: 'transparent',
      thumbGlow: 'none',
      badgeBg: 'rgba(255,255,255,0.03)',
      badgeBorder: 'rgba(255,255,255,0.08)',
      badgeText: '#64748b'
    };
  }

  // Lightness starts bright (75%) and gets progressively DARKER down to deep dark (28%) as you slide forward!
  const lightness = Math.round(75 - ratio * 47); // 75% -> 28% (Visibly darkens as dragged!)
  const saturation = Math.round(80 + ratio * 20); // Saturation increases from 80% -> 100% (richer tone)
  const primaryColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const glowColor = `hsla(${hue}, 100%, ${lightness}%, ${0.4 + ratio * 0.4})`;
  const glowRadius = Math.round(3 + ratio * 14);

  // Gradient: transitions from lighter vibrant at the start to deep dark stealth tone at the thumb!
  const fillGradient = `linear-gradient(90deg, hsl(${hue}, 95%, 72%) 0%, hsl(${hue}, 100%, ${lightness}%) 100%)`;

  return {
    ratio,
    lightness,
    glowRadius,
    primaryColor,
    glowColor,
    fillGradient,
    thumbGlow: `0 0 ${glowRadius + 4}px ${glowColor}, 0 2px 6px rgba(0,0,0,0.9)`,
    badgeBg: `hsla(${hue}, 100%, 20%, 0.35)`,
    badgeBorder: `hsla(${hue}, 100%, ${lightness}%, 0.45)`,
    badgeText: `hsl(${hue}, 100%, ${Math.max(45, lightness + 15)}%)`
  };
}

interface PrecisionSliderProps {
  value: number; // 0 to 240
  onChange: (val: number, clientX?: number, clientY?: number) => void;
  accentColor: 'emerald' | 'gold';
  title: string;
}

const DarkeningPrecisionSlider: React.FC<PrecisionSliderProps> = ({ value, onChange, accentColor, title }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastTickRef = useRef<number>(Math.floor(value / 15));
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = Math.min(100, Math.max(0, (value / 240) * 100));
  const { time, xp, isMax } = formatDurationLabel(value);
  const lum = getDarkeningLuminescence(value, accentColor);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseInt(e.target.value, 10);
    const snappedVal = Math.min(240, Math.max(0, rawVal));
    
    // Acoustic tick on 15-minute boundary crossing
    const current15mStep = Math.floor(snappedVal / 15);
    if (current15mStep !== lastTickRef.current) {
      lastTickRef.current = current15mStep;
      if (snappedVal > 0) {
        const pitchFactor = 0.8 + (snappedVal / 240) * 0.7;
        soundEngine.playSliderTick(pitchFactor);
      }
    }

    const rect = trackRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + (rect.width * (snappedVal / 240)) : window.innerWidth / 2;
    const y = rect ? rect.top : window.innerHeight / 2;
    onChange(snappedVal, x, y);
  };

  return (
    <div
      className="space-y-2 mt-3 pt-2.5 border-t border-white/[0.06] relative select-none"
      ref={trackRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      {/* Precision Telemetry Readout Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Clock
            className="h-3.5 w-3.5 transition-colors duration-150"
            style={{ color: lum.primaryColor, filter: value > 0 ? `drop-shadow(0 0 4px ${lum.glowColor})` : 'none' }}
          />
          <span className="text-slate-400 font-medium text-[11px]">Duration:</span>
          <span
            className="font-mono font-bold tracking-tight text-xs transition-colors duration-150"
            style={{
              color: lum.primaryColor,
              textShadow: value > 0 ? `0 0 ${lum.glowRadius / 2}px ${lum.glowColor}` : 'none'
            }}
          >
            {time}
          </span>
          {isMax && (
            <span className="px-1.5 py-0.2 rounded bg-red-500/20 border border-red-500/40 text-red-400 font-mono font-bold text-[8px] uppercase tracking-widest animate-pulse shadow-sm">
              4H MAX
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 font-mono">
          <span
            className="px-2 py-0.5 rounded-md border font-semibold text-[10px] transition-all duration-150"
            style={{
              backgroundColor: lum.badgeBg,
              borderColor: lum.badgeBorder,
              color: lum.badgeText,
              boxShadow: value > 0 ? `0 0 ${lum.glowRadius / 2}px ${lum.glowColor}` : 'none'
            }}
          >
            +{xp} XP
          </span>
        </div>
      </div>

      {/* Darkening Laser Slider Capsule */}
      <div className="relative py-2 flex items-center group">
        {/* Floating Minimalist Telemetry Pill */}
        {(isHovered || isDragging) && (
          <div
            className="absolute bottom-full mb-1.5 -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-[#080c18]/95 border backdrop-blur-md shadow-2xl pointer-events-none text-[10px] font-mono font-bold whitespace-nowrap z-30 transition-opacity duration-150"
            style={{
              left: `${Math.max(10, Math.min(90, percentage))}%`,
              borderColor: lum.badgeBorder,
              boxShadow: `0 4px 14px rgba(0,0,0,0.8), 0 0 ${lum.glowRadius}px ${lum.glowColor}`
            }}
          >
            <span style={{ color: lum.primaryColor }}>{time}</span>
            <span className="text-slate-500 mx-1">•</span>
            <span className="text-white">+{xp} XP</span>
          </div>
        )}

        {/* 5px Recessed Dark Track */}
        <div className="relative w-full h-1.5 rounded-full bg-black/50 border border-white/[0.08] overflow-hidden shadow-inner">
          {/* Active Liquid Laser Fill with Darkening Gradient */}
          <div
            className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-75"
            style={{
              width: `${percentage}%`,
              background: lum.fillGradient,
              boxShadow: value > 0 ? `0 0 ${lum.glowRadius}px ${lum.glowColor}` : 'none'
            }}
          />
        </div>

        {/* Native Range Input for 60fps Scrubbing */}
        <input
          type="range"
          min="0"
          max="240"
          step="5"
          value={value}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchEnd={() => setIsDragging(false)}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          title={`Set ${title} duration`}
        />

        {/* Darkening Dial Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -ml-2 h-4 w-4 rounded-full pointer-events-none transition-transform duration-75 flex items-center justify-center z-10"
          style={{
            left: `${percentage}%`,
            background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 45%, #475569 100%)',
            border: `1.5px solid ${value > 0 ? lum.primaryColor : 'rgba(255,255,255,0.3)'}`,
            boxShadow: lum.thumbGlow
          }}
        >
          <div
            className="h-1.5 w-1.5 rounded-full transition-colors duration-150"
            style={{
              backgroundColor: lum.primaryColor,
              boxShadow: value > 0 ? `0 0 4px ${lum.glowColor}` : 'none'
            }}
          />
        </div>
      </div>

      {/* Crisp Linear Hour Ticks */}
      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 px-0.5">
        <span className={value === 0 ? 'text-white font-medium' : ''}>0h</span>
        <span style={{ color: value >= 60 && value < 120 ? lum.primaryColor : undefined, fontWeight: value >= 60 && value < 120 ? 'bold' : 'normal' }}>1h</span>
        <span style={{ color: value >= 120 && value < 180 ? lum.primaryColor : undefined, fontWeight: value >= 120 && value < 180 ? 'bold' : 'normal' }}>2h</span>
        <span style={{ color: value >= 180 && value < 240 ? lum.primaryColor : undefined, fontWeight: value >= 180 && value < 240 ? 'bold' : 'normal' }}>3h</span>
        <span style={{ color: isMax ? lum.primaryColor : undefined, fontWeight: isMax ? 'bold' : 'normal', textShadow: isMax ? `0 0 6px ${lum.glowColor}` : 'none' }}>
          4h MAX
        </span>
      </div>
    </div>
  );
};

export const OverviewDashboard: React.FC = () => {
  const {
    profile,
    composite,
    workoutLogs,
    financeLogs,
    setDailyTaskDuration,
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

  const topPercent = Math.max(0.01, 100 - (composite?.percentileGlobal || 50));
  const claimedDropToday = isMysteryDropClaimedToday();

  return (
    <div className="space-y-6 max-w-3xl mx-auto select-none font-sans py-2">
      {/* 1. Ultra-Sleek Telemetry Header (Clean, Modern, with Total XP in Top Right) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00f0ff] animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-[#00f0ff] uppercase font-mono">
              OPERATOR ACTIVE
            </span>
          </div>

          {/* Top Right Total XP & Streak Badges */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 font-semibold text-xs backdrop-blur-md">
              <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="font-mono font-bold"><CountUpNumber end={profile.xp} decimals={0} suffix=" Total XP" /></span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-300 font-semibold text-xs backdrop-blur-md">
              <Flame className="h-3.5 w-3.5 text-orange-400 fill-orange-400" />
              <span className="font-mono">{profile.streakDays}d Streak</span>
            </div>
          </div>
        </div>

        {/* Hero Rank Display */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/[0.08]">
          <div>
            <span className="text-xs text-slate-400 font-medium block">
              {greeting}, <strong className="text-white font-semibold">{profile.callsign || 'Operator'}</strong>
            </span>
            <div className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1 flex items-baseline gap-3">
              <span>TOP</span>
              <span className="text-metallic-cyan">
                <CountUpNumber end={topPercent} decimals={1} suffix="%" />
              </span>
            </div>
          </div>

          {/* Key Metric Indicators */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.08] font-mono">
              <strong className="text-white"><CountUpNumber end={composite.humansDefeated / 1000000} decimals={1} suffix="M" /></strong> Defeated
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.08] font-medium">
              Tier {profile.level} Operator
            </span>
          </div>
        </div>
      </div>

      {/* 2. Daily Excellence Tasks with Darkening Progressive Sliders */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <h3 className="text-[11px] font-bold tracking-widest text-slate-300 uppercase font-mono">
              DAILY PROTOCOLS ({completedCount}/3)
            </h3>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono font-bold">
            DRAG FORWARD TO DEEPEN INTENSITY
          </span>
        </div>

        {/* Task 1: Workout Protocol */}
        <div className={`p-4 rounded-xl border transition-all duration-200 ${
          workoutMinutes > 0
            ? 'laser-conduit-emerald bg-emerald-950/15 border-emerald-500/30 pl-4'
            : 'bg-[#0a0e1a]/80 border-white/[0.07] hover:border-white/15'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-all ${
                workoutMinutes > 0
                  ? 'bg-emerald-400 text-black shadow-sm'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                <Dumbbell className="h-4 w-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-500/25">
                    PHYSIQUE
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    Physical Workout Protocol
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Compound strength or aerobic stamina (up to 4h)
                </p>
              </div>
            </div>

            {workoutMinutes > 0 ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <Circle className="h-5 w-5 text-slate-600" />
            )}
          </div>

          {/* Darkening Precision Slider */}
          <DarkeningPrecisionSlider
            value={workoutMinutes}
            onChange={(val, x, y) => handleDurationChange('STRENGTH', val, x, y)}
            accentColor="emerald"
            title="Workout"
          />
        </div>

        {/* Task 2: Financial Mastery */}
        <div className={`p-4 rounded-xl border transition-all duration-200 ${
          financeMinutes > 0
            ? 'laser-conduit-gold bg-amber-950/15 border-amber-500/30 pl-4'
            : 'bg-[#0a0e1a]/80 border-white/[0.07] hover:border-white/15'
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
                <p className="text-[11px] text-slate-400 mt-0.5">
                  LBO models, debt structuring & quant analysis (up to 4h)
                </p>
              </div>
            </div>

            {financeMinutes > 0 ? (
              <CheckCircle2 className="h-5 w-5 text-amber-400" />
            ) : (
              <Circle className="h-5 w-5 text-slate-600" />
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
              ? 'laser-conduit-cyan bg-purple-950/15 border-purple-500/30 text-white pl-4'
              : 'bg-[#0a0e1a]/80 border-white/[0.07] hover:border-white/15'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-all ${
              hasDisciplineToday
                ? 'bg-[#8c52ff] text-white shadow-sm'
                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105'
            }`}>
              <Moon className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold text-purple-300 bg-purple-950/50 px-1.5 py-0.2 rounded border border-purple-500/25">
                  DISCIPLINE
                </span>
                <span className={`text-xs sm:text-sm font-bold tracking-tight ${hasDisciplineToday ? 'line-through text-slate-400' : 'text-white'}`}>
                  8-Hour Sleep Hygiene & Recovery Protocol
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Zero junk food, optimal hydration, no screens before bed (+50 XP)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-[10px] font-semibold">
              +50 XP
            </span>
            <div>
              {hasDisciplineToday ? (
                <CheckCircle2 className="h-5 w-5 text-purple-400" />
              ) : (
                <Circle className="h-5 w-5 text-slate-600 group-hover:text-purple-400 transition-colors" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Neural Body Scanner Showcase */}
      <div
        onClick={() => setActiveTab('hologram')}
        className="luxury-card p-4 bg-[#0a0e1a]/80 hover:border-cyan-500/30 cursor-pointer transition-all flex items-center justify-between group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-black flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Neural Body Fat Morph Scanner
              </h4>
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/25 text-[8px] font-bold uppercase font-mono tracking-wider">
                AI SCANNER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Upload photo & drag the real-time slider from 8% to 58% Body Fat with ASMR marimba audio.
            </p>
          </div>
        </div>

        <ChevronRight className="h-4 w-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
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
