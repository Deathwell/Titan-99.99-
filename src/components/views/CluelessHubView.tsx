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
  HeartPulse,
  Award,
  ChevronRight,
  Info,
  Layers,
  Sliders
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

const TIME_PRESETS = [15, 30, 45, 60, 75, 90, 105, 120, 150, 180, 210, 240];

export const CluelessHubView: React.FC = () => {
  const { profile } = useTitan();

  // Questionnaire States
  const [age, setAge] = useState<number>(24);
  const [gender, setGender] = useState<GenderType>('MALE');
  const [environment, setEnvironment] = useState<EnvironmentType>('INDOOR');
  const [equipment, setEquipment] = useState<EquipmentType>('EQUIPMENT');
  const [intensity, setIntensity] = useState<IntensityLevel>('INTERMEDIATE');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);

  // Active Timer State
  const [activeTimerPrescription, setActiveTimerPrescription] = useState<TacticalPrescription | null>(null);
  const [isConfirmingStart, setIsConfirmingStart] = useState<boolean>(false);

  // Generate dynamic optimum recommendation in 0ms whenever ANY question changes
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'WARMUP':
        return 'bg-amber-950/40 text-amber-300 border-amber-500/30';
      case 'PRIMARY_COMPOUND':
        return 'bg-rose-950/40 text-rose-300 border-rose-500/40';
      case 'HYPERTROPHY_ACCESSORY':
        return 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40';
      case 'ISOLATION_STRETCH':
        return 'bg-purple-950/40 text-purple-300 border-purple-500/40';
      case 'METABOLIC_FINISHER':
        return 'bg-red-950/50 text-red-300 border-red-500/50';
      case 'LONGEVITY_RECOVERY':
        return 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6 font-sans select-none animate-in fade-in duration-300 pb-12">
      {/* Top Futuristic Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-[#0a0c14] to-purple-950/50 border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
            <Sparkles className="h-7 w-7 animate-pulse text-cyan-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[9.5px] font-bold border border-cyan-500/40 uppercase tracking-widest">
                ZERO UNCERTAINTY ORACLE
              </span>
              <span className="text-zinc-400 text-xs font-mono">Dynamic Sports Science & Longevity Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-serif mt-1 tracking-tight">
              Elite Workout Prescription & Guided Timer
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 max-w-2xl">
              Synthesizes research from <strong>Dr. Peter Attia</strong>, <strong>Dr. Mike Israetel</strong>, <strong>Bret Contreras</strong>, and <strong>Jeff Nippard</strong> to generate your tailored protocol in 0ms.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-zinc-300 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Age: <strong className="text-cyan-300">{age} yrs</strong></span>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive 6-Parameter Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="luxury-card p-5 bg-[#0b0c14]/90 border border-white/[0.08] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                <span>1. OPERATOR PARAMETERS</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">Live 0ms Dynamic Engine</span>
            </div>

            {/* Q1: Age Slider with Dynamic Longevity Bracket */}
            <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/[0.06]">
              <div className="flex items-center justify-between text-xs">
                <label className="text-zinc-200 font-bold flex items-center gap-1.5">
                  <span>Age:</span>
                  <span className="font-mono text-cyan-300 font-extrabold text-sm">{age} Years Old</span>
                </label>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                  age >= 60
                    ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                    : age >= 45
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                    : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                }`}>
                  {prescription.ageBracketLabel}
                </span>
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
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-zinc-900 rounded-lg border border-white/10"
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                <span>15 (Youth Prime)</span>
                <span>45 (Masters Longevity)</span>
                <span>75 (Centenarian Decathlon)</span>
              </div>
            </div>

            {/* Q2: Gender Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-semibold block">Biological Profile / Focus:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'MALE', label: 'Male 👨', desc: 'V-Taper & Compound' },
                  { id: 'FEMALE', label: 'Female 👩', desc: 'Hourglass & Glutes' },
                  { id: 'OTHER', label: 'Custom ⚡', desc: 'Hybrid Athletic' }
                ].map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(850);
                      setGender(g.id as GenderType);
                    }}
                    className={`py-2 px-1.5 rounded-xl transition-all border text-center ${
                      gender === g.id
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">{g.label}</span>
                    <span className="text-[9px] font-mono opacity-70 block">{g.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: Environment */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-semibold block">Training Environment:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(850);
                    setEnvironment('INDOOR');
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                    environment === 'INDOOR'
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Building className="h-4 w-4" />
                  <span>Indoor (Gym / Home)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(850);
                    setEnvironment('OUTDOOR');
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                    environment === 'OUTDOOR'
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <TreePine className="h-4 w-4" />
                  <span>Outdoor (Park / Trail)</span>
                </button>
              </div>
            </div>

            {/* Q4: Equipment */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-semibold block">Equipment Availability:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(850);
                    setEquipment('EQUIPMENT');
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                    equipment === 'EQUIPMENT'
                      ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Dumbbell className="h-4 w-4" />
                  <span>Full Gym Equipment</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(850);
                    setEquipment('NO_EQUIPMENT');
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                    equipment === 'NO_EQUIPMENT'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  <span>Zero Equipment (Bodyweight)</span>
                </button>
              </div>
            </div>

            {/* Q5: Intensity Level */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-semibold block">Target Intensity Tier:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'BEGINNER', label: 'Beginner', desc: 'RPE 6–7', color: 'emerald' },
                  { id: 'INTERMEDIATE', label: 'Intermediate', desc: 'RIR 2', color: 'cyan' },
                  { id: 'ADVANCED', label: 'Advanced', desc: 'RIR 1', color: 'rose' },
                  { id: 'SUPERHERO', label: 'Superhero ⚡', desc: 'RPE 10', color: 'amber' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(850);
                      setIntensity(lvl.id as IntensityLevel);
                    }}
                    className={`py-2 px-1 rounded-xl transition-all border text-center ${
                      intensity === lvl.id
                        ? lvl.color === 'emerald'
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                          : lvl.color === 'cyan'
                          ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                          : lvl.color === 'rose'
                          ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                          : 'bg-amber-500 text-black border-amber-300 shadow-md'
                        : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[11px] font-bold block">{lvl.label}</span>
                    <span className="text-[9px] font-mono opacity-80 block">{lvl.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Q6: Time Commitment (15m to 240m in 15m intervals) */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs">
                <label className="text-zinc-200 font-bold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Time Commitment (15m–4h in 15m steps):</span>
                </label>
                <span className="font-mono text-cyan-300 font-extrabold text-sm">
                  {durationMinutes >= 60
                    ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60 > 0 ? `${durationMinutes % 60}m` : ''}`
                    : `${durationMinutes}m`}{' '}
                  {durationMinutes >= 240 && '(4H MAX)'}
                </span>
              </div>

              {/* 15-Minute Snapping Slider */}
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
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-zinc-900 rounded-lg border border-white/10"
              />

              {/* 15m Quick Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {TIME_PRESETS.map(dur => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(850);
                      setDurationMinutes(dur);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                      durationMinutes === dur
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-black/40 border-white/[0.06] text-zinc-500 hover:text-white'
                    }`}
                  >
                    {dur >= 60 ? `${dur / 60}h` : `${dur}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Sports Science Prescription & Live Guided Timer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="luxury-card p-5 sm:p-6 bg-[#0b0c14]/95 border-2 border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.25)] space-y-4">
            {/* Header: Title, Coach & Reward */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30 uppercase tracking-wider">
                    SCIENCE-BACKED PROTOCOL
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 font-mono text-[9px] border border-cyan-500/30">
                    {prescription.difficulty} • {prescription.environment} • {prescription.equipment}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-serif tracking-tight">
                  {prescription.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {prescription.subtitle}
                </p>
                <div className="text-[11px] font-mono text-cyan-300/90 pt-0.5 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Framework: <strong>{prescription.coachingSource}</strong></span>
                </div>
              </div>

              <div className="text-right bg-black/50 p-2.5 rounded-xl border border-white/[0.08] shrink-0">
                <span className="text-[9px] font-mono text-zinc-400 block uppercase">Projected Output</span>
                <span className="text-base font-mono font-bold text-amber-400 block">
                  +{prescription.xpAward} XP
                </span>
                <span className="text-[10px] font-mono text-rose-300 flex items-center justify-end gap-1">
                  <Flame className="h-3 w-3" />
                  <span>~{prescription.calorieBurnEstimate} kcal</span>
                </span>
              </div>
            </div>

            {/* Time Breakdown Bar: Warmup | Work | Cooldown */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/[0.07] space-y-1.5">
              <div className="flex justify-between text-[10.5px] font-mono text-zinc-300">
                <span className="text-amber-400 font-semibold">Warmup: {prescription.warmupMinutes}m</span>
                <span className="text-cyan-300 font-semibold">Working Sets: {prescription.workMinutes}m</span>
                <span className="text-emerald-400 font-semibold">Recovery Flush: {prescription.cooldownMinutes}m</span>
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

            {/* Scientific Rationale Highlights */}
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25 space-y-1.5 text-xs text-zinc-300">
              <div className="text-[11px] font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5 text-cyan-400" />
                <span>Kinesiology & Longevity Mechanics:</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed italic">
                {prescription.targetObjective}. {prescription.physiologicalImpact}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                {prescription.scientificBreakdown.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                    <span className="text-cyan-400">✓</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Exercise Execution Protocol */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>EXERCISE SEQUENCE ({prescription.exerciseSteps.length} MOVEMENTS):</span>
                <span className="text-cyan-400 font-semibold">{prescription.durationMinutes}m Total Protocol</span>
              </div>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                {prescription.exerciseSteps.map((step, idx) => (
                  <div
                    key={step.id || idx}
                    className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] space-y-2 hover:border-white/20 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="h-5 w-5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate font-serif">
                          {step.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase ${getCategoryColor(step.category)}`}>
                          {step.category.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/30">
                          {step.sets} × {step.reps}
                        </span>
                      </div>
                    </div>

                    {/* Telemetry Strip: Muscle, Tempo, RPE/RIR, Rest */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px] font-mono bg-black/40 p-2 rounded-lg border border-white/[0.04]">
                      <div>
                        <span className="text-zinc-500 block">Target:</span>
                        <span className="text-cyan-300 font-semibold truncate block">{step.targetMuscle}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Tempo:</span>
                        <span className="text-white font-semibold block">{step.tempo}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Intensity:</span>
                        <span className="text-amber-300 font-semibold block">{step.intensityRirOrRpe}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Rest:</span>
                        <span className="text-emerald-400 font-semibold block">
                          {step.restSeconds > 0 ? `${step.restSeconds}s` : '0s'}
                        </span>
                      </div>
                    </div>

                    {/* Coaching Cue & Sports Science Rationale */}
                    <div className="space-y-1 text-[10.5px] pl-1">
                      <p className="text-zinc-300">
                        <strong className="text-amber-400">💡 Form Cue:</strong> {step.coachingCue}
                      </p>
                      <p className="text-zinc-400 italic">
                        <strong className="text-cyan-400 font-mono">🔬 Science:</strong> {step.sportsScienceRationale}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Guided Timer Button */}
            <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-zinc-400 font-mono">
                <span>⚡ Automatically advances Home & Analytics sliders on finish</span>
              </div>

              <button
                onClick={handleStartTimerClicked}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>START WORKOUT TIMER ({durationMinutes} MIN)</span>
              </button>
            </div>
          </div>
        </div>
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
