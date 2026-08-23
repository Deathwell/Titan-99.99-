import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Dumbbell,
  Play,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  Shield,
  Activity,
  TreePine,
  Building,
  Target,
  BookOpen,
  Sliders,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import {
  generateCustomPrescription,
  IntensityLevel,
  EnvironmentType,
  EquipmentType,
  GenderType,
  TacticalPrescription
} from '../../lib/prescriptionEngine';
import { soundEngine } from '../../lib/audio';
import { ActiveMissionTimerHUD } from '../action/ActiveMissionTimerHUD';

const DURATION_PRESETS = [15, 30, 45, 60, 75, 90, 105, 120, 150, 180, 240];

export const CluelessHubView: React.FC = () => {
  const { profile } = useTitan();

  // 6 Core Questionnaire States
  const [age, setAge] = useState<number>(24);
  const [gender, setGender] = useState<GenderType>('MALE');
  const [environment, setEnvironment] = useState<EnvironmentType>('INDOOR');
  const [equipment, setEquipment] = useState<EquipmentType>('EQUIPMENT');
  const [intensity, setIntensity] = useState<IntensityLevel>('INTERMEDIATE');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);

  // Active Timer & Confirmation States
  const [activeTimerPrescription, setActiveTimerPrescription] = useState<TacticalPrescription | null>(null);
  const [isConfirmingStart, setIsConfirmingStart] = useState<boolean>(false);

  // Generate dynamic recommendation in 0ms
  const prescription = useMemo(() => {
    return generateCustomPrescription({
      age,
      gender,
      environment,
      equipment,
      intensity,
      durationMinutes
    });
  }, [age, gender, environment, equipment, intensity, durationMinutes]);

  const handleStartTimerClicked = () => {
    soundEngine.playClick(900);
    setIsConfirmingStart(true);
  };

  const handleConfirmStart = () => {
    soundEngine.playMilestoneFanfare();
    setActiveTimerPrescription(prescription);
    setIsConfirmingStart(false);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'WARMUP':
        return { label: 'Warmup & Activation', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
      case 'PRIMARY_COMPOUND':
        return { label: 'Primary Compound', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      case 'HYPERTROPHY_ACCESSORY':
        return { label: 'Hypertrophy Accessory', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'ISOLATION_STRETCH':
        return { label: 'Lengthened Isolation', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'METABOLIC_FINISHER':
        return { label: 'Metabolic Finisher', color: 'bg-red-500/20 text-red-300 border-red-500/40' };
      case 'LONGEVITY_RECOVERY':
        return { label: 'Recovery & Decompression', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      default:
        return { label: 'Exercise', color: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
    }
  };

  return (
    <div className="space-y-8 font-sans select-none animate-in fade-in duration-200 max-w-5xl mx-auto pb-16">
      
      {/* 1. PROFESSIONAL HEADER */}
      <div className="border-b border-white/[0.08] pb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/25 uppercase tracking-widest">
              TITAN ORACLE
            </span>
            <span className="text-xs text-zinc-400 font-mono">Dynamic Workout Prescription</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-serif">
            Clueless? AI Workout Prescription
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Specify your parameters below to generate an optimum, science-backed workout plan and start the guided timer.
          </p>
        </div>

        <button
          onClick={handleStartTimerClicked}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center gap-2 transition-all active:scale-95"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>START WORKOUT ({durationMinutes}m)</span>
        </button>
      </div>

      {/* 2. STREAMLINED CONFIGURATION DECK (Clean, Unified, Professional) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0e0e14] border border-white/[0.08] shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span>EXERCISE CONFIGURATION</span>
          </h3>
          <span className="text-[11px] font-mono text-cyan-400/90 font-semibold">
            {prescription.ageBracketLabel}
          </span>
        </div>

        {/* Top Controls Grid: Age, Gender, Environment, Equipment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Age Control */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Age:</span>
              <span className="font-mono text-cyan-300 font-bold text-sm">{age} yrs</span>
            </div>
            <input
              type="range"
              min="15"
              max="75"
              step="1"
              value={age}
              onChange={(e) => {
                setAge(parseInt(e.target.value, 10));
                soundEngine.playClick(800);
              }}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-500">
              <span>15 (Youth)</span>
              <span>45 (Masters)</span>
              <span>75 (Senior)</span>
            </div>
          </div>

          {/* Biological Focus */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <span className="text-xs text-zinc-400 font-medium block">Focus Profile:</span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'MALE', label: 'Male 👨' },
                { id: 'FEMALE', label: 'Female 👩' },
                { id: 'OTHER', label: 'Custom ⚡' }
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(850);
                    setGender(g.id as GenderType);
                  }}
                  className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all border text-center ${
                    gender === g.id
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                      : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Environment */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <span className="text-xs text-zinc-400 font-medium block">Environment:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(850);
                  setEnvironment('INDOOR');
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 ${
                  environment === 'INDOOR'
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                }`}
              >
                <Building className="h-3.5 w-3.5" />
                <span>Indoor</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(850);
                  setEnvironment('OUTDOOR');
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 ${
                  environment === 'OUTDOOR'
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                }`}
              >
                <TreePine className="h-3.5 w-3.5" />
                <span>Outdoor</span>
              </button>
            </div>
          </div>

          {/* Equipment */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <span className="text-xs text-zinc-400 font-medium block">Equipment:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(850);
                  setEquipment('EQUIPMENT');
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 ${
                  equipment === 'EQUIPMENT'
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                }`}
              >
                <Dumbbell className="h-3.5 w-3.5" />
                <span>Gym / Iron</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(850);
                  setEquipment('NO_EQUIPMENT');
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 ${
                  equipment === 'NO_EQUIPMENT'
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                <span>Bodyweight</span>
              </button>
            </div>
          </div>
        </div>

        {/* Intensity Level Tabs */}
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <span className="text-xs text-zinc-400 font-medium block">Intensity Level:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'BEGINNER', label: 'Beginner', note: 'RPE 6.5–7.0 (Form & Joint Armor)' },
              { id: 'INTERMEDIATE', label: 'Intermediate', note: 'RIR 1–2 (Progressive Overload)' },
              { id: 'ADVANCED', label: 'Advanced', note: 'RIR 0–1 (Near Failure Density)' },
              { id: 'SUPERHERO', label: 'Superhero ⚡', note: 'RPE 9.5–10 (Spartan MRV Peak)' }
            ].map(lvl => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick(850);
                  setIntensity(lvl.id as IntensityLevel);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  intensity === lvl.id
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40'
                    : 'bg-black/30 border-white/[0.06] text-zinc-400 hover:border-white/20'
                }`}
              >
                <span className={`text-xs font-bold block ${intensity === lvl.id ? 'text-white' : 'text-zinc-300'}`}>
                  {lvl.label}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                  {lvl.note}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration Slider & Chips (15m to 240m) */}
        <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span>Available Time Frame:</span>
            </span>
            <span className="font-mono text-cyan-300 font-bold text-sm">
              {durationMinutes >= 60
                ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60 > 0 ? `${durationMinutes % 60}m` : ''}`
                : `${durationMinutes}m`}{' '}
              {durationMinutes === 240 && '(MAX 4H)'}
            </span>
          </div>

          <input
            type="range"
            min="15"
            max="240"
            step="15"
            value={durationMinutes}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setDurationMinutes(val);
              soundEngine.playSliderTick(0.8 + (val / 240) * 0.7);
            }}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {DURATION_PRESETS.map(dur => (
              <button
                key={dur}
                type="button"
                onClick={() => {
                  soundEngine.playClick(850);
                  setDurationMinutes(dur);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                  durationMinutes === dur
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                    : 'bg-black/40 border-white/[0.06] text-zinc-400 hover:text-white'
                }`}
              >
                {dur >= 60 ? `${dur / 60}h` : `${dur}m`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. HERO PROTOCOL SUMMARY CARD */}
      <div className="p-6 rounded-2xl bg-[#0e0e14] border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-mono text-[9px] font-bold border border-cyan-500/30 uppercase tracking-widest">
                PRESCRIBED PROTOCOL
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {prescription.difficulty} • {prescription.environment} • {prescription.equipment}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif tracking-tight">
              {prescription.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              {prescription.subtitle}
            </p>
            <div className="text-xs font-mono text-cyan-300/90 flex items-center gap-1.5 pt-1">
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span>Framework: <strong>{prescription.coachingSource}</strong></span>
            </div>
          </div>

          {/* Output Telemetry Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] text-center min-w-[80px]">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Duration</span>
              <span className="text-sm font-mono font-bold text-cyan-300">{prescription.durationMinutes}m</span>
            </div>
            <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] text-center min-w-[80px]">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Reward</span>
              <span className="text-sm font-mono font-bold text-amber-400">+{prescription.xpAward} XP</span>
            </div>
            <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] text-center min-w-[90px]">
              <span className="text-[9px] font-mono text-zinc-400 block uppercase">Burn</span>
              <span className="text-sm font-mono font-bold text-rose-400">~{prescription.calorieBurnEstimate} kcal</span>
            </div>
          </div>
        </div>

        {/* Phase Timeline: Warmup -> Working Sets -> Recovery */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
          <div className="flex justify-between text-xs font-mono text-zinc-400">
            <span>Warmup: <strong className="text-amber-400">{prescription.warmupMinutes}m</strong></span>
            <span>Working Compounds: <strong className="text-cyan-300">{prescription.workMinutes}m</strong></span>
            <span>Recovery: <strong className="text-emerald-400">{prescription.cooldownMinutes}m</strong></span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden flex">
            <div
              className="bg-amber-400 h-full"
              style={{ width: `${(prescription.warmupMinutes / prescription.durationMinutes) * 100}%` }}
            />
            <div
              className="bg-cyan-500 h-full"
              style={{ width: `${(prescription.workMinutes / prescription.durationMinutes) * 100}%` }}
            />
            <div
              className="bg-emerald-400 h-full"
              style={{ width: `${(prescription.cooldownMinutes / prescription.durationMinutes) * 100}%` }}
            />
          </div>
        </div>

        {/* Kinesiology Objective Box */}
        <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/25 text-xs text-zinc-300 leading-relaxed font-mono">
          <span className="text-cyan-300 font-bold">PHYSIOLOGICAL OBJECTIVE: </span>
          {prescription.targetObjective}. {prescription.physiologicalImpact}.
        </div>
      </div>

      {/* 4. EXERCISE SEQUENCE LIST (Clear, Full-Width, Non-Overlapping) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
            STEP-BY-STEP EXERCISE PROTOCOL ({prescription.exerciseSteps.length} MOVEMENTS)
          </h3>
          <span className="text-xs text-zinc-400 font-mono">
            {prescription.durationMinutes}m Total
          </span>
        </div>

        <div className="space-y-3">
          {prescription.exerciseSteps.map((step, idx) => {
            const badge = getCategoryBadge(step.category);
            return (
              <div
                key={step.id || idx}
                className="p-4 sm:p-5 rounded-2xl bg-[#0e0e14] border border-white/[0.08] hover:border-white/20 transition-all space-y-3 shadow-md"
              >
                {/* Top Row: Number, Name, Category Badge, Sets & Reps */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-7 w-7 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white font-serif leading-snug">
                      {step.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-rose-950/40 text-rose-300 font-mono font-bold text-xs border border-rose-500/30 shadow-sm">
                      {step.sets} Sets × {step.reps}
                    </span>
                  </div>
                </div>

                {/* Telemetry Row: 4 Clear Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-black/50 border border-white/[0.05] text-xs font-mono">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Target Muscle:</span>
                    <span className="text-cyan-300 font-semibold truncate block">{step.targetMuscle}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Eccentric Tempo:</span>
                    <span className="text-white font-semibold block">{step.tempo}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Intensity Gauge:</span>
                    <span className="text-amber-300 font-semibold block">{step.intensityRirOrRpe}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Rest Interval:</span>
                    <span className="text-emerald-400 font-semibold block">
                      {step.restSeconds > 0 ? `${step.restSeconds}s` : 'Continuous'}
                    </span>
                  </div>
                </div>

                {/* Coaching & Science Rationale */}
                <div className="space-y-1 text-xs pl-1">
                  <p className="text-zinc-200">
                    <strong className="text-amber-400">💡 Coaching Cue:</strong> {step.coachingCue}
                  </p>
                  <p className="text-zinc-400 text-[11px] italic">
                    <strong className="text-cyan-400 font-mono">🔬 Sports Science:</strong> {step.sportsScienceRationale}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. BOTTOM CTA BAR */}
      <div className="p-5 rounded-2xl bg-[#0e0e14] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="text-xs text-zinc-400 font-mono">
          <span>Ready to execute {prescription.durationMinutes} minutes of focused sports science?</span>
          <span className="text-emerald-400 font-bold block sm:inline sm:ml-2">
            +{prescription.xpAward} XP + Sliders auto-advance to {Math.floor(prescription.durationMinutes / 60)}h {prescription.durationMinutes % 60 > 0 ? `${prescription.durationMinutes % 60}m` : ''} upon completion.
          </span>
        </div>

        <button
          onClick={handleStartTimerClicked}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>START WORKOUT TIMER ({durationMinutes} MIN)</span>
        </button>
      </div>

      {/* Initiation Confirmation Dialog */}
      {isConfirmingStart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0e0e14] border-2 border-cyan-500/50 rounded-2xl p-6 space-y-5 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <Play className="h-6 w-6 fill-cyan-300" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-serif">
                  Initiate {durationMinutes}-Minute Workout Protocol?
                </h4>
                <p className="text-xs text-zinc-400">{prescription.title}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400 font-mono">
                <span>Duration:</span>
                <span className="text-white font-bold">{durationMinutes} Minutes</span>
              </div>
              <div className="flex justify-between text-zinc-400 font-mono">
                <span>Framework:</span>
                <span className="text-cyan-300 font-bold">{prescription.coachingSource}</span>
              </div>
              <div className="flex justify-between text-zinc-400 font-mono">
                <span>XP on Completion:</span>
                <span className="text-emerald-400 font-bold">+{prescription.xpAward} XP</span>
              </div>
              <div className="flex justify-between text-zinc-400 font-mono">
                <span>Slider Sync:</span>
                <span className="text-cyan-300 font-bold">Home & Analytics auto-sync</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 italic">
              💡 You will be able to pause anytime for breaks. If you abort early, zero workout time is recorded.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={handleConfirmStart}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95"
              >
                Yes, Start Protocol Timer!
              </button>
              <button
                onClick={() => setIsConfirmingStart(false)}
                className="px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-all border border-white/10"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Live Mission Timer HUD */}
      {activeTimerPrescription && (
        <ActiveMissionTimerHUD
          prescription={activeTimerPrescription}
          onClose={() => setActiveTimerPrescription(null)}
        />
      )}
    </div>
  );
};
