import React, { useState, useMemo } from 'react';
import {
  Dumbbell,
  Play,
  Clock,
  Zap,
  Flame,
  Building,
  TreePine,
  Activity,
  Sliders,
  ChevronRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Timer
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
import { ExerciseGuideModal } from '../modals/ExerciseGuideModal';

const DURATION_PRESETS = [15, 30, 45, 60, 75, 90, 120, 180, 240];

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

  // Form Guide Modal State
  const [guideExerciseName, setGuideExerciseName] = useState<string | null>(null);

  // Generate dynamic recommendation instantly
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

  const handleOpenGuide = (e: React.MouseEvent, guideKeyOrName: string) => {
    e.stopPropagation();
    soundEngine.playClick(800);
    setGuideExerciseName(guideKeyOrName);
  };

  return (
    <div className="space-y-6 font-sans select-none animate-in fade-in duration-200 max-w-4xl mx-auto pb-16 px-2 sm:px-4">
      
      {/* 1. MINIMALIST EXECUTIVE HEADER */}
      <div className="text-center sm:text-left space-y-1.5 pt-1 pb-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-widest">
          <Sparkles className="h-3 w-3" />
          <span>AI Sports Science Concierge</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
          Clueless? Custom Daily Protocol
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
          Dial in your parameters to receive a tailored, science-backed workout routine with exact tempos, rest intervals, and form guides.
        </p>
      </div>

      {/* 2. SIMPLISTIC & ELEGANT CONFIGURATOR */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0c0c11]/90 border border-white/[0.08] shadow-xl backdrop-blur-xl space-y-5">
        
        {/* Row 1: Age & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/[0.05]">
          {/* Age Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Biological Age</span>
              <span className="text-cyan-300 font-bold text-sm bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                {age} yrs
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
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-400">
              <span>15 (Prime)</span>
              <span>45 (Masters)</span>
              <span>75 (Longevity)</span>
            </div>
          </div>

          {/* Biological Focus */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-zinc-400 block">Biological Focus</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'MALE', label: 'Male' },
                { id: 'FEMALE', label: 'Female' },
                { id: 'OTHER', label: 'Custom' }
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(850);
                    setGender(g.id as GenderType);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                    gender === g.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                      : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/15'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Environment & Equipment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/[0.05]">
          {/* Environment */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-zinc-400 block">Setting</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(850);
                  setEnvironment('INDOOR');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center gap-2 ${
                  environment === 'INDOOR'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/15'
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
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center gap-2 ${
                  environment === 'OUTDOOR'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/15'
                }`}
              >
                <TreePine className="h-3.5 w-3.5" />
                <span>Outdoor</span>
              </button>
            </div>
          </div>

          {/* Equipment */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-zinc-400 block">Gear</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(850);
                  setEquipment('EQUIPMENT');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center gap-2 ${
                  equipment === 'EQUIPMENT'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/15'
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
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center gap-2 ${
                  equipment === 'NO_EQUIPMENT'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/15'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                <span>Bodyweight</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Intensity Levels */}
        <div className="space-y-2 pb-4 border-b border-white/[0.05]">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Intensity Level</span>
            <span className="text-cyan-400">{prescription.difficulty}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'BEGINNER', label: 'Beginner', note: 'RIR 3 • Joint Armor' },
              { id: 'INTERMEDIATE', label: 'Intermediate', note: 'RIR 1–2 • Hypertrophy' },
              { id: 'ADVANCED', label: 'Advanced', note: 'RIR 0–1 • Near Failure' },
              { id: 'SUPERHERO', label: 'Superhero ⚡', note: 'RPE 10 • Spartan Peak' }
            ].map(lvl => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick(850);
                  setIntensity(lvl.id as IntensityLevel);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  intensity === lvl.id
                    ? 'bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:border-white/15 hover:text-zinc-200'
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

        {/* Row 4: Duration Slider & Preset Chips */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span>Duration</span>
            </span>
            <span className="text-cyan-300 font-bold text-sm">
              {durationMinutes >= 60
                ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60 > 0 ? `${durationMinutes % 60}m` : ''}`
                : `${durationMinutes}m`}
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
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all border ${
                  durationMinutes === dur
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/15'
                }`}
              >
                {dur >= 60 ? `${dur / 60}h` : `${dur}m`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ELEGANT PROTOCOL SHOWCASE */}
      <div className="p-6 rounded-2xl bg-[#0c0c11]/95 border border-cyan-500/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              <span>{prescription.difficulty}</span>
              <span>•</span>
              <span>{prescription.environment}</span>
              <span>•</span>
              <span>{prescription.equipment}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              {prescription.title}
            </h2>
            <p className="text-xs text-zinc-400">
              Coached by <span className="text-zinc-300 font-medium">{prescription.coachingSource}</span>
            </p>
          </div>

          <button
            onClick={handleStartTimerClicked}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>START PROTOCOL ({prescription.durationMinutes}m)</span>
          </button>
        </div>

        {/* 3 Minimal Key Metric Tiles */}
        <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-mono">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-zinc-400 uppercase block">Active Time</span>
            <span className="text-sm sm:text-base font-bold text-cyan-300">{prescription.durationMinutes}m</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-zinc-400 uppercase block">Target Burn</span>
            <span className="text-sm sm:text-base font-bold text-rose-300">~{prescription.calorieBurnEstimate} kcal</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-zinc-400 uppercase block">Reward</span>
            <span className="text-sm sm:text-base font-bold text-amber-300">+{prescription.xpAward} XP</span>
          </div>
        </div>
      </div>

      {/* 4. CLEAN EXERCISE SEQUENCE LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
            Movement Sequence ({prescription.exerciseSteps.length} Exercises)
          </h3>
          <span className="text-[11px] text-cyan-400 font-mono">
            Tap any exercise for video guide
          </span>
        </div>

        <div className="space-y-2.5">
          {prescription.exerciseSteps.map((step, idx) => (
            <div
              key={step.id || idx}
              onClick={(e) => handleOpenGuide(e, step.guideKey || step.name)}
              className="p-4 sm:p-5 rounded-2xl bg-[#0c0c11]/80 border border-white/[0.06] hover:border-cyan-500/40 transition-all space-y-2.5 cursor-pointer group hover:bg-[#101017] shadow-sm"
            >
              {/* Header: Number, Title, Form Guide Button, Sets & Reps */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs font-bold text-cyan-400/80 w-5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-200 transition-colors">
                    {step.name}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleOpenGuide(e, step.guideKey || step.name)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950/30 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono font-bold hover:bg-cyan-900/50 transition-all flex items-center gap-1"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>Guide</span>
                  </button>

                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-zinc-200 font-mono font-bold text-xs border border-white/[0.08]">
                    {step.sets} × {step.reps}
                  </span>
                </div>
              </div>

              {/* Minimalist Metadata Tags */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-zinc-400 pl-8">
                <span>Target: <strong className="text-zinc-300 font-normal">{step.targetMuscle}</strong></span>
                <span>•</span>
                <span>Tempo: <strong className="text-zinc-300 font-normal">{step.tempo}</strong></span>
                <span>•</span>
                <span>Rest: <strong className="text-emerald-400 font-normal">{step.restSeconds > 0 ? `${step.restSeconds}s` : 'Continuous'}</strong></span>
                <span>•</span>
                <span>Intensity: <strong className="text-amber-300 font-normal">{step.intensityRirOrRpe}</strong></span>
              </div>

              {/* Coaching Cue in quiet typography */}
              <p className="text-xs text-zinc-400 italic pl-8">
                "{step.coachingCue}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Form Guide Detail Modal */}
      {guideExerciseName && (
        <ExerciseGuideModal
          exerciseName={guideExerciseName}
          onClose={() => setGuideExerciseName(null)}
        />
      )}

      {/* Initiation Confirmation Dialog */}
      {isConfirmingStart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="max-w-md w-full rounded-2xl bg-[#0e0e14] border border-cyan-500/40 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                <Timer className="h-4 w-4" />
                <span>Mission Lock-In</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-white">
                Initiate {prescription.durationMinutes}-Minute Protocol?
              </h3>
              <p className="text-xs text-zinc-400">
                You will enter active execution mode. XP and streak credit are locked strictly until the full timer expires.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>Protocol:</span>
                <span className="text-white font-bold truncate max-w-[200px]">{prescription.title}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Duration:</span>
                <span className="text-cyan-300 font-bold">{prescription.durationMinutes} Minutes</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Completion Reward:</span>
                <span className="text-amber-400 font-bold">+{prescription.xpAward} XP</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingStart(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800/80 text-zinc-300 font-mono text-xs font-bold hover:bg-zinc-700 transition-all border border-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStart}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-lg transition-all active:scale-95"
              >
                Confirm & Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Mission Live HUD */}
      {activeTimerPrescription && (
        <ActiveMissionTimerHUD
          prescription={activeTimerPrescription}
          onClose={() => setActiveTimerPrescription(null)}
        />
      )}
    </div>
  );
};
