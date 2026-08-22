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

interface DynamicColorProps {
  value: number; // 0 to 240
  onChange: (val: number, clientX?: number, clientY?: number) => void;
  accentColor: 'emerald' | 'gold';
  title: string;
}

// Compute continuous HSL brightness & luminosity ramp based on exact value
function getDynamicLuminescence(value: number, accentColor: 'emerald' | 'gold') {
  const ratio = Math.max(0, Math.min(1, value / 240)); // 0.0 to 1.0
  const isEmerald = accentColor === 'emerald';
  const hue = isEmerald ? 158 : 42; // 158 = Cyber Emerald, 42 = Porsche Gold

  if (value === 0) {
    return {
      ratio: 0,
      lightness: 30,
      saturation: 40,
      glowRadius: 0,
      glowColor: 'transparent',
      primaryColor: '#64748b',
      fillGradient: 'rgba(255,255,255,0.06)',
      thumbGlow: 'none',
      badgeBg: 'rgba(255,255,255,0.03)',
      badgeBorder: 'rgba(255,255,255,0.08)',
      badgeText: '#64748b',
      conduitGlow: 'none',
      cardBgOpacity: 0.8
    };
  }

  // Smooth continuous scaling:
  // Lightness: 35% (dark deep green/gold at 15m) -> 92% (blinding white-hot core at 240m)
  const lightness = Math.round(35 + ratio * 57);
  // Saturation: 65% -> 100%
  const saturation = Math.round(65 + ratio * 35);
  // Glow radius: 2px -> 28px
  const glowRadius = Math.round(2 + ratio * 26);

  const primaryColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const glowColor = `hsla(${hue}, 100%, ${Math.min(75, lightness)}%, ${0.3 + ratio * 0.7})`;
  const fillGradient = `linear-gradient(90deg, hsl(${hue}, ${saturation}%, ${Math.max(25, lightness - 20)}%) 0%, hsl(${hue}, ${saturation}%, ${lightness}%) 70%, hsl(${hue}, 100%, ${Math.min(98, lightness + 15)}%) 100%)`;

  return {
    ratio,
    lightness,
    saturation,
    glowRadius,
    glowColor,
    primaryColor,
    fillGradient,
    thumbGlow: `0 0 ${glowRadius + 6}px ${glowColor}, 0 2px 8px rgba(0,0,0,0.8)`,
    badgeBg: `hsla(${hue}, 90%, 30%, ${0.15 + ratio * 0.25})`,
    badgeBorder: `hsla(${hue}, 100%, ${lightness}%, ${0.3 + ratio * 0.5})`,
    badgeText: `hsl(${hue}, 100%, ${Math.min(95, lightness + 10)}%)`,
    conduitGlow: `0 0 ${glowRadius + 4}px ${glowColor}`,
    cardBgOpacity: 0.8 + ratio * 0.15
  };
}

const SleekProgressiveSlider: React.FC<DynamicColorProps> = ({ value, onChange, accentColor, title }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastTickRef = useRef<number>(Math.floor(value / 15));
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = Math.min(100, Math.max(0, (value / 240) * 100));
  const { time, xp, isMax } = formatDurationLabel(value);
  const lum = getDynamicLuminescence(value, accentColor);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseInt(e.target.value, 10);
    const snappedVal = Math.min(240, Math.max(0, rawVal));
    
    // Acoustic tick on 15-minute boundary crossing
    const current15mStep = Math.floor(snappedVal / 15);
    if (current15mStep !== lastTickRef.current) {
      lastTickRef.current = current15mStep;
      if (snappedVal > 0) {
        const pitchFactor = 0.75 + (snappedVal / 240) * 0.85;
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
      {/* Sleek Minimalist Readout Bar */}
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          <Clock
            className="h-3 w-3 transition-colors duration-150"
            style={{ color: lum.primaryColor }}
          />
          <span className="text-slate-400 font-medium">Duration:</span>
          <span
            className="font-mono font-bold tracking-tight transition-colors duration-150"
            style={{ color: lum.primaryColor, textShadow: value > 0 ? `0 0 ${lum.glowRadius / 2}px ${lum.glowColor}` : 'none' }}
          >
            {time}
          </span>
          {isMax && (
            <span className="px-1.5 py-0.2 rounded bg-red-500/20 border border-red-500/40 text-red-400 font-mono font-extrabold text-[8px] uppercase tracking-widest animate-pulse">
              🔥 4H MAX
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 font-mono">
          <span
            className="px-2 py-0.5 rounded-lg border font-bold text-[10px] transition-all duration-150"
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

      {/* Ultra-Slim Precision Track & Dynamic Luminescence Dial */}
      <div className="relative py-2.5 flex items-center group">
        {/* Floating Minimalist Telemetry Pill */}
        {(isHovered || isDragging) && (
          <div
            className="absolute bottom-full mb-2 -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-[#070b14]/95 border backdrop-blur-md shadow-xl pointer-events-none text-[10px] font-mono font-bold whitespace-nowrap z-30 transition-opacity duration-150"
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

        {/* 4px Razor-Slim Titanium Track */}
        <div className="relative w-full h-1.5 rounded-full bg-white/[0.08] border border-white/[0.08] overflow-hidden shadow-inner">
          {/* Progressive Dynamic Luminescence Fill */}
          <div
            className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-75"
            style={{
              width: `${percentage}%`,
              background: lum.fillGradient,
              boxShadow: value > 0 ? `0 0 ${lum.glowRadius}px ${lum.glowColor}, inset 0 1px 0 rgba(255,255,255,0.6)` : 'none'
            }}
          />
        </div>

        {/* Native Range Slider for Buttery-Smooth Dragging */}
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

        {/* Dynamic Glowing Jewel Dial */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -ml-2 h-4 w-4 rounded-full pointer-events-none transition-transform duration-75 flex items-center justify-center z-10"
          style={{
            left: `${percentage}%`,
            background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 45%, #475569 100%)',
            border: `1.5px solid ${value > 0 ? lum.primaryColor : 'rgba(255,255,255,0.3)'}`,
            boxShadow: lum.thumbGlow
          }}
        >
          {/* Center Gemstone Core Light */}
          <div
            className="h-1.5 w-1.5 rounded-full transition-colors duration-150"
            style={{
              backgroundColor: lum.primaryColor,
              boxShadow: value > 0 ? `0 0 ${lum.glowRadius / 2}px ${lum.glowColor}` : 'none'
            }}
          />
        </div>
      </div>

      {/* Slim Hour Ticks */}
      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 px-0.5">
        <span className={value === 0 ? 'text-white font-bold' : ''}>0h</span>
        <span style={{ color: value >= 60 && value < 120 ? lum.primaryColor : undefined, fontWeight: value >= 60 && value < 120 ? 'bold' : 'normal' }}>1h</span>
        <span style={{ color: value >= 120 && value < 180 ? lum.primaryColor : undefined, fontWeight: value >= 120 && value < 180 ? 'bold' : 'normal' }}>2h</span>
        <span style={{ color: value >= 180 && value < 240 ? lum.primaryColor : undefined, fontWeight: value >= 180 && value < 240 ? 'bold' : 'normal' }}>3h</span>
        <span style={{ color: isMax ? lum.primaryColor : undefined, fontWeight: isMax ? '900' : 'normal', textShadow: isMax ? `0 0 8px ${lum.glowColor}` : 'none' }}>
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

  // Luminescence profiles for the cards themselves
  const workoutLum = getDynamicLuminescence(workoutMinutes, 'emerald');
  const financeLum = getDynamicLuminescence(financeMinutes, 'gold');

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
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-600/20 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm shadow-porsche-gold backdrop-blur-md">
          <Flame className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="font-mono tracking-wider">{profile.streakDays}d Streak</span>
        </div>
      </div>

      {/* 2. Mercedes-AMG / Audi RS Style Telemetry Cluster */}
      <div className="mercedes-card p-5 sm:p-7 relative overflow-hidden bg-gradient-to-br from-[#121829]/90 via-[#0a0e1a]/95 to-[#05070f]/95 border border-white/15 shadow-2xl">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 text-center sm:text-left">
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

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
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
            <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-[#00f0ff] via-[#8c52ff] to-[#e5b95c] p-1 shadow-matrix-cyan">
              <div className="h-full w-full rounded-full bg-[#05070e] flex flex-col items-center justify-center border border-white/10">
                <Shield className="h-8 w-8 text-cyan-400 stroke-[2] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                <span className="text-xs font-black text-white font-mono mt-1 tracking-wider">99.9%</span>
                <span className="text-[8px] text-cyan-400 font-mono tracking-widest">TITAN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Daily Excellence Tasks */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <h3 className="text-[11px] font-black tracking-widest text-slate-300 uppercase">
              DAILY EXCELLENCE MISSIONS ({completedCount}/3)
            </h3>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono font-bold">
            SLIDE TO BOOST INTENSITY & XP
          </span>
        </div>

        {/* Task 1: Workout Protocol (Dynamic Luminescence Scaling) */}
        <div
          className={`p-4 rounded-2xl border transition-all duration-200 ${
            workoutMinutes > 0
              ? 'laser-conduit-emerald pl-5'
              : 'bg-[#0f1424]/80 border-white/10 hover:border-emerald-500/30'
          }`}
          style={{
            backgroundColor: workoutMinutes > 0 ? `rgba(6, 78, 59, ${0.15 + workoutLum.ratio * 0.25})` : undefined,
            borderColor: workoutMinutes > 0 ? workoutLum.badgeBorder : undefined,
            boxShadow: workoutMinutes > 0 ? `0 0 ${workoutLum.glowRadius * 1.2}px ${workoutLum.glowColor}` : undefined
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl transition-all duration-150"
                style={{
                  backgroundColor: workoutMinutes > 0 ? workoutLum.primaryColor : 'rgba(16, 185, 129, 0.15)',
                  color: workoutMinutes > 0 ? '#000000' : '#34d399',
                  boxShadow: workoutMinutes > 0 ? `0 0 ${workoutLum.glowRadius}px ${workoutLum.glowColor}` : 'none'
                }}
              >
                <Dumbbell className="h-4 w-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded border transition-colors duration-150"
                    style={{
                      color: workoutLum.primaryColor,
                      backgroundColor: workoutMinutes > 0 ? workoutLum.badgeBg : 'rgba(6, 78, 59, 0.6)',
                      borderColor: workoutMinutes > 0 ? workoutLum.badgeBorder : 'rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    PHYSIQUE
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                    Physical Workout Protocol
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Compound strength or aerobic stamina (up to 4h)
                </p>
              </div>
            </div>

            {workoutMinutes > 0 ? (
              <CheckCircle2
                className="h-5 w-5 transition-colors duration-150"
                style={{ color: workoutLum.primaryColor, filter: `drop-shadow(0 0 ${workoutLum.glowRadius / 2}px ${workoutLum.glowColor})` }}
              />
            ) : (
              <Circle className="h-5 w-5 text-slate-600" />
            )}
          </div>

          {/* Sleek Progressive Luminescence Slider */}
          <SleekProgressiveSlider
            value={workoutMinutes}
            onChange={(val, x, y) => handleDurationChange('STRENGTH', val, x, y)}
            accentColor="emerald"
            title="Workout"
          />
        </div>

        {/* Task 2: Financial Mastery (Dynamic Luminescence Scaling) */}
        <div
          className={`p-4 rounded-2xl border transition-all duration-200 ${
            financeMinutes > 0
              ? 'laser-conduit-gold pl-5'
              : 'bg-[#0f1424]/80 border-white/10 hover:border-amber-500/30'
          }`}
          style={{
            backgroundColor: financeMinutes > 0 ? `rgba(120, 53, 15, ${0.15 + financeLum.ratio * 0.25})` : undefined,
            borderColor: financeMinutes > 0 ? financeLum.badgeBorder : undefined,
            boxShadow: financeMinutes > 0 ? `0 0 ${financeLum.glowRadius * 1.2}px ${financeLum.glowColor}` : undefined
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl transition-all duration-150"
                style={{
                  backgroundColor: financeMinutes > 0 ? financeLum.primaryColor : 'rgba(245, 158, 11, 0.15)',
                  color: financeMinutes > 0 ? '#000000' : '#fbbf24',
                  boxShadow: financeMinutes > 0 ? `0 0 ${financeLum.glowRadius}px ${financeLum.glowColor}` : 'none'
                }}
              >
                <LineChart className="h-4 w-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded border transition-colors duration-150"
                    style={{
                      color: financeLum.primaryColor,
                      backgroundColor: financeMinutes > 0 ? financeLum.badgeBg : 'rgba(120, 53, 15, 0.6)',
                      borderColor: financeMinutes > 0 ? financeLum.badgeBorder : 'rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    WEALTH
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                    Financial Modeling & Capital Markets
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  LBO models, debt structuring & quant analysis (up to 4h)
                </p>
              </div>
            </div>

            {financeMinutes > 0 ? (
              <CheckCircle2
                className="h-5 w-5 transition-colors duration-150"
                style={{ color: financeLum.primaryColor, filter: `drop-shadow(0 0 ${financeLum.glowRadius / 2}px ${financeLum.glowColor})` }}
              />
            ) : (
              <Circle className="h-5 w-5 text-slate-600" />
            )}
          </div>

          {/* Sleek Progressive Luminescence Slider */}
          <SleekProgressiveSlider
            value={financeMinutes}
            onChange={(val, x, y) => handleDurationChange('MODELING', val, x, y)}
            accentColor="gold"
            title="Finance"
          />
        </div>

        {/* Task 3: Sleep Hygiene & Tactical Discipline (Clean 1-Tap Toggle - NO SLIDER) */}
        <div
          onClick={handleDisciplineToggle}
          className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group active:scale-[0.99] ${
            hasDisciplineToday
              ? 'laser-conduit-cyan bg-purple-950/25 border-purple-500/40 shadow-electric-violet text-white pl-5'
              : 'bg-[#0f1424]/80 border-white/10 hover:border-purple-500/40 hover:bg-[#141b30]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className={`p-2 rounded-xl transition-all ${
              hasDisciplineToday
                ? 'bg-[#8c52ff] text-white shadow-electric-violet scale-105'
                : 'bg-purple-500/15 text-purple-400 border border-purple-500/30 group-hover:scale-105'
            }`}>
              <Moon className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-extrabold text-purple-300 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-500/30">
                  DISCIPLINE
                </span>
                <span className={`text-xs sm:text-sm font-extrabold tracking-tight ${hasDisciplineToday ? 'line-through text-slate-400' : 'text-white'}`}>
                  8-Hour Sleep Hygiene & Recovery Protocol
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Zero junk food, optimal hydration, no screens before bed (+50 XP)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono text-[10px] font-bold">
              +50 XP
            </span>
            <div>
              {hasDisciplineToday ? (
                <CheckCircle2 className="h-5 w-5 text-purple-400 drop-shadow-[0_0_8px_rgba(140,82,255,0.8)]" />
              ) : (
                <Circle className="h-5 w-5 text-slate-600 group-hover:text-purple-400 transition-colors" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Audi RS Style Neural Body Scanner Telemetry Showcase */}
      <div
        onClick={() => setActiveTab('hologram')}
        className="mercedes-card p-4 sm:p-5 bg-gradient-to-r from-[#0c1833]/90 via-[#091124]/90 to-[#180f2b]/90 border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all flex items-center justify-between group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#00f0ff] to-[#0072ff] text-black flex items-center justify-center shadow-matrix-cyan shrink-0 group-hover:scale-105 transition-transform">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-white">
                Neural Body Fat Morph Scanner
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-[9px] font-black uppercase font-mono tracking-wider">
                AI SCANNER LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
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
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-porsche-gold">
            <Gift className="h-4 w-4 animate-bounce" />
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
