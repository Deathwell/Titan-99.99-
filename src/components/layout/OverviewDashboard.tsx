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
  Moon,
  ZapOff
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

interface ChainSliderProps {
  value: number; // 0 to 240
  onChange: (val: number, clientX?: number, clientY?: number) => void;
  accentColor: 'emerald' | 'gold';
  title: string;
}

const LuxuryChainTrackSlider: React.FC<ChainSliderProps> = ({ value, onChange, accentColor, title }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = (value / 240) * 100;
  const { time, xp, isMax } = formatDurationLabel(value);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseInt(e.target.value, 10);
    const rect = trackRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + (rect.width * (rawVal / 240)) : window.innerWidth / 2;
    const y = rect ? rect.top : window.innerHeight / 2;
    onChange(rawVal, x, y);
  };

  const isEmerald = accentColor === 'emerald';

  return (
    <div
      className="space-y-3 mt-4 pt-3.5 border-t border-white/[0.08] relative"
      ref={trackRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      {/* Telemetry Readout Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Clock className={`h-3.5 w-3.5 ${isEmerald ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="text-slate-400 font-semibold tracking-tight">Active Protocol Time:</span>
          <span className={`font-mono font-extrabold text-sm tracking-tight ${
            value > 0 ? (isEmerald ? 'text-emerald-300' : 'text-amber-300') : 'text-slate-500'
          }`}>
            {time}
          </span>
          {isMax && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-mono font-extrabold text-[9px] uppercase tracking-wider animate-pulse shadow-sm">
              🔥 4H MAX APEX
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <span className={`px-2.5 py-1 rounded-xl border font-bold text-xs ${
            value > 0
              ? (isEmerald ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-cyber-emerald' : 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-porsche-gold')
              : 'bg-white/[0.03] border-white/[0.08] text-slate-500'
          }`}>
            +{xp} XP
          </span>
        </div>
      </div>

      {/* Horology & Supercar Machined Chain Track */}
      <div className="relative py-3 select-none group">
        {/* Floating Holographic Telemetry HUD (Follows Thumb during Drag or Hover) */}
        {(isHovered || isDragging || value > 0) && (
          <div
            className="floating-hud-badge"
            style={{
              left: `${Math.max(12, Math.min(88, percentage))}%`,
              borderColor: isEmerald ? 'rgba(52, 211, 153, 0.4)' : 'rgba(251, 191, 36, 0.4)'
            }}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold">
              <span className={isEmerald ? 'text-emerald-300' : 'text-amber-300'}>{time}</span>
              <span className="text-slate-500">•</span>
              <span className="text-white">+{xp} XP</span>
            </div>
          </div>
        )}

        {/* Machined Titanium Rail Housing */}
        <div className="relative h-4 rounded-full bg-[#05070d] border border-white/15 overflow-hidden shadow-inner flex items-center justify-between px-1.5">
          {/* 16 Precision CNC Chain Notches */}
          {Array.from({ length: 17 }).map((_, i) => {
            const notchMinutes = i * 15;
            const isFilled = notchMinutes <= value && value > 0;
            const isHourMark = notchMinutes % 60 === 0;

            return (
              <div
                key={i}
                className={`transition-all ${
                  isHourMark ? 'h-3 w-1' : 'h-1.5 w-0.5'
                } rounded-sm ${
                  isFilled
                    ? (isEmerald ? 'bg-emerald-300 shadow-cyber-emerald' : 'bg-amber-300 shadow-porsche-gold')
                    : 'bg-white/20'
                }`}
              />
            );
          })}

          {/* Illuminated Liquid Laser Conduit Fill */}
          <div
            className={`absolute top-0 bottom-0 left-0 transition-all pointer-events-none ${
              isEmerald
                ? 'bg-gradient-to-r from-emerald-500/40 via-emerald-400/80 to-emerald-300 shadow-cyber-emerald'
                : 'bg-gradient-to-r from-amber-500/40 via-amber-400/80 to-amber-300 shadow-porsche-gold'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Real Transparent Range Slider for Smooth Scrubbing */}
        <input
          type="range"
          min="0"
          max="240"
          step="15"
          value={value}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchEnd={() => setIsDragging(false)}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
          title={`Drag ${title} chain slider (0 to 4 hours)`}
        />

        {/* Diamond Knurled Milled Titanium Dial Thumb */}
        <div
          className={`machined-knurl-dial absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full pointer-events-none transition-all flex items-center justify-center -ml-3.5 z-20 ${
            value > 0
              ? (isEmerald ? 'border-emerald-400 ring-2 ring-emerald-500/30' : 'border-amber-400 ring-2 ring-amber-500/30')
              : 'border-slate-500 ring-1 ring-white/10'
          }`}
          style={{ left: `${percentage}%` }}
        >
          {/* Inner Gemstone Glow */}
          <div className={`h-2.5 w-2.5 rounded-full ${
            value > 0
              ? (isEmerald ? 'bg-emerald-400 shadow-cyber-emerald animate-pulse' : 'bg-amber-400 shadow-porsche-gold animate-pulse')
              : 'bg-slate-500'
          }`} />
        </div>
      </div>

      {/* Laser-Engraved Hour Markers */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1 font-semibold">
        <span className={value === 0 ? 'text-white' : ''}>0h</span>
        <span className={value >= 60 && value < 120 ? (isEmerald ? 'text-emerald-400' : 'text-amber-400') : ''}>1h</span>
        <span className={value >= 120 && value < 180 ? (isEmerald ? 'text-emerald-400' : 'text-amber-400') : ''}>2h</span>
        <span className={value >= 180 && value < 240 ? (isEmerald ? 'text-emerald-400' : 'text-amber-400') : ''}>3h</span>
        <span className={isMax ? (isEmerald ? 'text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(0,230,153,0.8)]' : 'text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(229,185,92,0.8)]') : ''}>
          4h (MAX)
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

  // Chain Slider Drag Handler
  const handleChainChange = (
    type: 'STRENGTH' | 'MODELING',
    newMinutes: number,
    clientX?: number,
    clientY?: number
  ) => {
    setDailyTaskDuration(type, newMinutes);

    // Audio Feedback: Ascending acoustic marimba tick
    const pitchFactor = 0.7 + (newMinutes / 240) * 0.9;
    soundEngine.playSliderTick(pitchFactor);

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

      {/* 3. Daily Excellence Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
            <h3 className="text-xs font-black tracking-widest text-slate-300 uppercase">
              DAILY EXCELLENCE PROTOCOLS ({completedCount}/3)
            </h3>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono font-bold">
            DRAG CHAIN (UP TO 4H MAX XP)
          </span>
        </div>

        {/* Task 1: Workout Protocol with 4h Chain Slider (Cyber Emerald) */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 ${
          workoutMinutes > 0
            ? 'laser-conduit-emerald bg-emerald-950/30 border-emerald-500/50 shadow-cyber-emerald pl-6'
            : 'bg-[#0f1424]/80 border-white/10 hover:border-emerald-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
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
                  <h4 className="text-sm font-extrabold text-white tracking-tight">
                    Physical Workout Protocol
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compound lifting or aerobic stamina (drag chain up to 4h)
                </p>
              </div>
            </div>

            {workoutMinutes > 0 ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(0,230,153,0.8)]" />
            ) : (
              <Circle className="h-6 w-6 text-slate-600" />
            )}
          </div>

          {/* Luxury Machined Chain Track Slider */}
          <LuxuryChainTrackSlider
            value={workoutMinutes}
            onChange={(val, x, y) => handleChainChange('STRENGTH', val, x, y)}
            accentColor="emerald"
            title="Workout"
          />
        </div>

        {/* Task 2: Financial Mastery with 4h Chain Slider (Porsche Gold) */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 ${
          financeMinutes > 0
            ? 'laser-conduit-gold bg-amber-950/30 border-amber-500/50 shadow-porsche-gold pl-6'
            : 'bg-[#0f1424]/80 border-white/10 hover:border-amber-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
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
                  <h4 className="text-sm font-extrabold text-white tracking-tight">
                    Financial Modeling & Capital Markets
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  LBO models, debt structuring & quant analysis (drag chain up to 4h)
                </p>
              </div>
            </div>

            {financeMinutes > 0 ? (
              <CheckCircle2 className="h-6 w-6 text-amber-400 drop-shadow-[0_0_8px_rgba(229,185,92,0.8)]" />
            ) : (
              <Circle className="h-6 w-6 text-slate-600" />
            )}
          </div>

          {/* Luxury Machined Chain Track Slider */}
          <LuxuryChainTrackSlider
            value={financeMinutes}
            onChange={(val, x, y) => handleChainChange('MODELING', val, x, y)}
            accentColor="gold"
            title="Finance"
          />
        </div>

        {/* Task 3: Sleep Hygiene & Tactical Discipline (Clean 1-Tap Toggle - NO SLIDER) */}
        <div
          onClick={handleDisciplineToggle}
          className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group active:scale-[0.99] ${
            hasDisciplineToday
              ? 'laser-conduit-cyan bg-purple-950/30 border-purple-500/50 shadow-electric-violet text-white pl-6'
              : 'bg-[#0f1424]/80 border-white/10 hover:border-purple-500/40 hover:bg-[#141b30]'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-all ${
              hasDisciplineToday
                ? 'bg-[#8c52ff] text-white shadow-electric-violet scale-105'
                : 'bg-purple-500/15 text-purple-400 border border-purple-500/30 group-hover:scale-105'
            }`}>
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold text-purple-300 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-500/30">
                  DISCIPLINE
                </span>
                <span className={`text-sm font-extrabold tracking-tight ${hasDisciplineToday ? 'line-through text-slate-400' : 'text-white'}`}>
                  8-Hour Sleep Hygiene & Cold Exposure
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero junk food, optimal hydration, no screens before bed (+50 XP)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono text-xs font-bold">
              +50 XP
            </span>
            <div>
              {hasDisciplineToday ? (
                <CheckCircle2 className="h-6 w-6 text-purple-400 drop-shadow-[0_0_8px_rgba(140,82,255,0.8)]" />
              ) : (
                <Circle className="h-6 w-6 text-slate-600 group-hover:text-purple-400 transition-colors" />
              )}
            </div>
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
