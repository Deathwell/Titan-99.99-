import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  HelpCircle,
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
  ArrowRight
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

  // Generate optimum recommendation dynamically based on all 6 questionnaire answers
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

  return (
    <div className="space-y-6 font-sans select-none animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-[#0e0e14] to-purple-950/40 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-inner shrink-0">
            <Sparkles className="h-7 w-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30 uppercase tracking-widest">
                ZERO UNCERTAINTY ORACLE
              </span>
              <span className="text-zinc-400 text-xs font-mono">Clueless what to do today?</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white font-serif mt-1">
              AI Workout Prescription & Guided Timer
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 max-w-2xl">
              Answer 6 quick parameters below to generate the optimum, science-backed workout routine with exact exercises, sets, reps, and guided timer.
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-zinc-300 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Operator: <strong className="text-white">{profile.callsign}</strong></span>
        </div>
      </div>

      {/* 2-Column Grid: Left Questionnaire & Right Optimum Routine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Questionnaire Form (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="luxury-card p-5 bg-[#0e0e14]/90 border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>1. OPERATOR PROFILE & PREFERENCES</span>
            </h3>

            {/* Q1: Age */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-zinc-300 font-semibold">Age:</label>
                <span className="font-mono text-cyan-300 font-bold">{age} Years Old</span>
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
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-black/60 rounded-lg border border-white/10"
              />
            </div>

            {/* Q2: Gender */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-semibold block">Gender:</label>
              <div className="grid grid-cols-3 gap-2">
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
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border text-center ${
                      gender === g.id
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: Environment */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-semibold block">Environment:</label>
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
                  <span>Full Equipment (Gym)</span>
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
                  <span>No Equipment (Bodyweight)</span>
                </button>
              </div>
            </div>

            {/* Q5: Intensity Level */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-semibold block">Target Intensity:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'BEGINNER', label: 'Beginner', color: 'emerald' },
                  { id: 'INTERMEDIATE', label: 'Intermediate', color: 'cyan' },
                  { id: 'ADVANCED', label: 'Advanced', color: 'rose' },
                  { id: 'SUPERHERO', label: 'Superhero ⚡', color: 'amber' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(850);
                      setIntensity(lvl.id as IntensityLevel);
                    }}
                    className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all border text-center ${
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
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q6: Time Commitment (15m to 240m in 15m intervals) */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs">
                <label className="text-zinc-300 font-semibold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Time Commitment (15m to 4h):</span>
                </label>
                <span className="font-mono text-cyan-300 font-extrabold text-sm">
                  {durationMinutes >= 60
                    ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60 > 0 ? `${durationMinutes % 60}m` : ''}`
                    : `${durationMinutes}m`}{' '}
                  {durationMinutes >= 240 && '(4H MAX)'}
                </span>
              </div>

              {/* 15-Minute Slider */}
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
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-black/60 rounded-lg border border-white/10"
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

        {/* Right Column: Generated Optimum Protocol & Start Timer (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="luxury-card p-5 sm:p-6 bg-[#0e0e14]/90 border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] space-y-4">
            {/* Optimum Prescription Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30 uppercase tracking-widest">
                    OPTIMUM MATCH
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {prescription.difficulty} • {prescription.environment} • {prescription.equipment}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white font-serif mt-1">
                  {prescription.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {prescription.subtitle}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Estimated Reward</span>
                <span className="text-base sm:text-lg font-mono font-bold text-amber-400">
                  +{prescription.xpAward} XP
                </span>
                <span className="text-[10px] font-mono text-rose-300 block">
                  ~{prescription.calorieBurnEstimate} kcal Burn
                </span>
              </div>
            </div>

            {/* Target Objective Pill */}
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25 text-xs text-cyan-200/90 leading-relaxed font-mono flex items-start gap-2">
              <Zap className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong>Physiological Objective:</strong> {prescription.targetObjective}. {prescription.physiologicalImpact}.
              </div>
            </div>

            {/* Exercise Steps Breakdown */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>PRESCRIBED EXERCISES ({prescription.exerciseSteps.length} MOVEMENTS):</span>
                <span className="text-cyan-400 font-semibold">{prescription.durationMinutes}m Total Protocol</span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                {prescription.exerciseSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/50 border border-white/[0.07] space-y-1 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white">{step.name}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/25 shrink-0">
                        {step.sets} × {step.reps}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-zinc-400 font-mono pl-7">
                      <span className="text-cyan-300">{step.targetMuscle}</span>
                      <span>•</span>
                      <span className="text-amber-300">{step.intensityRpe}</span>
                      {step.restSeconds > 0 && (
                        <>
                          <span>•</span>
                          <span>{step.restSeconds}s Rest</span>
                        </>
                      )}
                    </div>

                    <p className="text-[10.5px] text-zinc-400 italic pl-7 mt-0.5">
                      💡 {step.cue}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Guided Timer Button */}
            <div className="pt-2 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-zinc-400 font-mono">
                <span>Auto-syncs duration to Home & Analytics upon completion</span>
              </div>

              <button
                onClick={handleStartTimerClicked}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all transform active:scale-95"
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
                <span>Target Intensity:</span>
                <span className="text-amber-400 font-bold">{intensity} ({environment})</span>
              </div>
              <div className="flex justify-between text-zinc-400 font-mono">
                <span>XP on Completion:</span>
                <span className="text-emerald-400 font-bold">+{Math.floor(durationMinutes * 1.5)} XP</span>
              </div>
              <div className="flex justify-between text-zinc-400 font-mono">
                <span>Slider Sync:</span>
                <span className="text-cyan-300 font-bold">Advances Home & Analytics automatically!</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 italic">
              💡 You will be able to pause anytime for rest. If you abort early, zero workout time is recorded.
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
