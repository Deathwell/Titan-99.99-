import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  X,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sparkles,
  Dumbbell,
  Clock,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Award
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { TacticalPrescription } from '../../lib/prescriptionEngine';
import { soundEngine } from '../../lib/audio';
import { triggerGlobalConfetti } from '../effects/ConfettiCanvas';
import { ExerciseGuideModal } from '../modals/ExerciseGuideModal';

interface ActiveMissionTimerHUDProps {
  prescription: TacticalPrescription;
  onClose: () => void;
}

export const ActiveMissionTimerHUD: React.FC<ActiveMissionTimerHUDProps> = ({
  prescription,
  onClose
}) => {
  const { setDailyTaskDuration, profile } = useTitan();

  const totalDurationSeconds = prescription.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalDurationSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isAbortConfirmOpen, setIsAbortConfirmOpen] = useState<boolean>(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isAudioTicking, setIsAudioTicking] = useState<boolean>(true);
  const [activeGuideExercise, setActiveGuideExercise] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer Tick Mechanism
  useEffect(() => {
    if (!isPaused && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleCompleteMission();
            return 0;
          }
          // Acoustic pacing tick every 60 seconds
          if ((prev - 1) % 60 === 0 && isAudioTicking) {
            soundEngine.playClick(900);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, secondsRemaining, isAudioTicking]);

  const handleCompleteMission = () => {
    soundEngine.playMilestoneFanfare();
    triggerGlobalConfetti();

    // Register workout duration in shared context (automatically moves Home and Analytics sliders)
    setDailyTaskDuration('STRENGTH', prescription.durationMinutes);

    setIsCompletedModalOpen(true);
  };

  const handleAbortMission = () => {
    soundEngine.playAlert();
    // Do NOT register any time or XP
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  const togglePause = () => {
    soundEngine.playClick(isPaused ? 850 : 650);
    setIsPaused(prev => !prev);
  };

  const toggleStep = (index: number) => {
    soundEngine.playClick(950);
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Time Formatting
  const hrs = Math.floor(secondsRemaining / 3600);
  const mins = Math.floor((secondsRemaining % 3600) / 60);
  const secs = secondsRemaining % 60;
  const timeDisplay = hrs > 0
    ? `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalDurationSeconds - secondsRemaining) / totalDurationSeconds) * 100)
  );

  return (
    <>
      {/* Floating Tactical HUD Dock */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[460px] max-h-[85vh] flex flex-col bg-[#0b0c13]/95 backdrop-blur-2xl border-2 border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.25)] overflow-hidden animate-in slide-in-from-bottom-5 duration-300 font-sans">
        {/* Animated Top Progress Laser */}
        <div className="w-full h-1.5 bg-black/60 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-rose-500 to-amber-400 transition-all duration-300 shadow-[0_0_10px_#06b6d4]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* HUD Header */}
        <div className="p-3.5 bg-gradient-to-r from-cyan-950/40 to-black/60 border-b border-white/[0.08] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl border shrink-0 bg-rose-500/15 border-rose-500/30 text-rose-400">
              <Dumbbell className="h-4 w-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold border border-cyan-500/30 uppercase tracking-widest animate-pulse">
                  {isPaused ? 'PAUSED' : 'LIVE PROTOCOL'}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">+{prescription.xpAward} XP Target</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5 font-serif">
                {prescription.title}
              </h4>
            </div>
          </div>

          {/* Quick HUD Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsAudioTicking(prev => !prev)}
              className={`p-1.5 rounded-lg border transition-all ${
                isAudioTicking
                  ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400'
                  : 'bg-white/[0.04] border-white/10 text-zinc-500'
              }`}
              title={isAudioTicking ? 'Mute Pacing Audio' : 'Enable Pacing Audio'}
            >
              {isAudioTicking ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setIsExpanded(prev => !prev)}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/10 transition-all"
              title={isExpanded ? 'Collapse Routine' : 'Expand Routine'}
            >
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setIsAbortConfirmOpen(true)}
              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
              title="Abort Mission"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Timer Digital Readout Strip */}
        <div className="px-4 py-3 bg-black/70 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-cyan-400" />
              <span>Time Remaining</span>
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-wider tabular-nums drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              {timeDisplay}
            </div>
          </div>

          {/* Action Button Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePause}
              className={`px-3 py-2 rounded-xl border font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                isPaused
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border-amber-500/40'
              }`}
            >
              {isPaused ? <Play className="h-4 w-4 fill-white" /> : <Pause className="h-4 w-4" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={handleCompleteMission}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-95"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden xs:inline">Finish</span>
            </button>
          </div>
        </div>

        {/* Expandable Step-by-Step Routine Checklist */}
        {isExpanded && (
          <div className="p-3.5 space-y-2.5 overflow-y-auto max-h-[45vh] custom-scrollbar bg-black/40">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span>EXERCISE PROTOCOL CHECKLIST:</span>
              <span className="text-cyan-300 font-bold">
                {Object.values(completedSteps).filter(Boolean).length} / {prescription.exerciseSteps.length} Complete
              </span>
            </div>

            {prescription.exerciseSteps.map((step, idx) => {
              const isDone = completedSteps[idx] || false;
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/30 opacity-70'
                      : 'bg-white/[0.03] border-white/[0.07] hover:border-white/20'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-zinc-500 flex items-center justify-center text-[9px] font-mono text-zinc-400">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold leading-tight ${isDone ? 'line-through text-zinc-400' : 'text-white'}`}>
                        {step.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundEngine.playClick(750);
                            setActiveGuideExercise(step.name);
                          }}
                          className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono hover:bg-cyan-900/80"
                        >
                          Guide 📖
                        </button>
                        <span className="text-[10px] font-mono text-rose-300 bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-500/20">
                          {step.sets} × {step.reps}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-zinc-400 mt-1 font-mono">
                      <span className="text-cyan-300">{step.targetMuscle}</span>
                      <span>•</span>
                      <span className="text-amber-300">{step.intensityRirOrRpe}</span>
                      <span>•</span>
                      <span>{step.tempo}</span>
                      {step.restSeconds > 0 && (
                        <>
                          <span>•</span>
                          <span>{step.restSeconds}s Rest</span>
                        </>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1 italic">
                      💡 {step.coachingCue}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mid-Workout Exercise Form Guide Modal */}
      {activeGuideExercise && (
        <ExerciseGuideModal
          exerciseName={activeGuideExercise}
          onClose={() => setActiveGuideExercise(null)}
        />
      )}

      {/* Abort Confirmation Dialog */}
      {isAbortConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#0e0e14] border border-rose-500/40 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-serif">Abort Active Workout?</h4>
                <p className="text-[11px] text-zinc-400">Confirmation Required</p>
              </div>
            </div>

            <p className="text-xs text-rose-200/90 leading-relaxed bg-rose-950/30 p-3 rounded-xl border border-rose-500/20">
              ⚠️ If you cancel this mission, your session will <strong>NOT be registered</strong>.
              Zero XP will be awarded and your daily commitment sliders will remain unchanged.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleAbortMission}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md"
              >
                Yes, Abort Mission
              </button>
              <button
                onClick={() => setIsAbortConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-all border border-white/10"
              >
                Resume Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mission Accomplished Dialog */}
      {isCompletedModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-md bg-[#0e0e14] border-2 border-cyan-500/50 rounded-2xl p-6 space-y-5 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-rose-500 to-amber-400 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-[#0e0e14] flex items-center justify-center text-3xl">
                🏆
              </div>
            </div>

            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30 tracking-widest uppercase">
                MISSION ACCOMPLISHED
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-serif">
                {prescription.title} Complete!
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Completed full {prescription.durationMinutes}-minute execution protocol with supreme discipline.
              </p>
            </div>

            {/* Reward Badges */}
            <div className="grid grid-cols-2 gap-2.5 py-1">
              <div className="p-3 rounded-xl bg-black/50 border border-white/[0.08]">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">XP Earned</span>
                <span className="text-lg font-bold font-mono text-amber-400">+{prescription.xpAward} XP</span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/[0.08]">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Sliders Updated</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {Math.floor(prescription.durationMinutes / 60)}h {prescription.durationMinutes % 60}m
                </span>
              </div>
            </div>

            <div className="text-[11px] text-cyan-300/90 font-mono bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-500/20">
              ⚡ Sliders on Home & Analytics updated automatically. 10-Year forecast recalculated!
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg transition-all active:scale-[0.99]"
            >
              Return to Cockpit
            </button>
          </div>
        </div>
      )}
    </>
  );
};
