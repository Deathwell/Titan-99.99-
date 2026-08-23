import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Dumbbell,
  LineChart,
  Clock,
  Zap,
  CheckCircle2,
  X,
  ArrowRight,
  Flame,
  Shield,
  Activity,
  Play
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import {
  PrescriptionDomain,
  TacticalPrescription,
  generateTacticalPrescriptions
} from '../../lib/prescriptionEngine';
import { soundEngine } from '../../lib/audio';

interface TacticalMissionProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDomain?: PrescriptionDomain;
  onLaunchTimer: (prescription: TacticalPrescription) => void;
}

const DURATION_PRESETS = [15, 30, 45, 60, 90, 120, 180, 240];

export const TacticalMissionProtocolModal: React.FC<TacticalMissionProtocolModalProps> = ({
  isOpen,
  onClose,
  initialDomain = 'FITNESS',
  onLaunchTimer
}) => {
  const { profile } = useTitan();

  const [domain, setDomain] = useState<PrescriptionDomain>(initialDomain);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);
  const [isConfirmingStart, setIsConfirmingStart] = useState<boolean>(false);

  // Generate 3 curated science-backed options based on domain & duration
  const prescriptions = useMemo(() => {
    return generateTacticalPrescriptions(domain, selectedDuration, profile.level);
  }, [domain, selectedDuration, profile.level]);

  // Set default selection when prescriptions change
  const activePrescription = useMemo(() => {
    return (
      prescriptions.find(p => p.id === selectedPrescriptionId) ||
      prescriptions[0] ||
      null
    );
  }, [prescriptions, selectedPrescriptionId]);

  if (!isOpen) return null;

  const handleStartTimerClicked = () => {
    soundEngine.playClick(900);
    setIsConfirmingStart(true);
  };

  const handleConfirmStart = () => {
    if (activePrescription) {
      soundEngine.playMilestoneFanfare();
      onLaunchTimer(activePrescription);
      onClose();
    }
  };

  const isFitness = domain === 'FITNESS';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0b0c13] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-gradient-to-r from-cyan-950/40 via-black to-purple-950/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 shadow-sm">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                  Tactical AI Mission Prescription
                </h3>
                <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 font-mono text-[9px] font-bold border border-cyan-500/30 uppercase">
                  ZERO UNCERTAINTY
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Clueless on what to execute today? Select your time frame to receive science-backed, curated options.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick(600);
              onClose();
            }}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/10 transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {/* Step 1: Select Execution Domain */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider block">
              1. SELECT EXECUTION PILLAR:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(800);
                  setDomain('FITNESS');
                  setSelectedPrescriptionId(null);
                }}
                className={`p-3.5 rounded-xl border transition-all flex items-center gap-3 text-left ${
                  domain === 'FITNESS'
                    ? 'bg-rose-950/40 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                    : 'bg-black/40 border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${
                  domain === 'FITNESS'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-white/[0.04] text-zinc-400 border-white/10'
                }`}>
                  <Dumbbell className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-white block">
                    Physical Training & Conditioning
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Sets, reps, muscle targets, RPE intensity & recovery
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(800);
                  setDomain('FINANCE');
                  setSelectedPrescriptionId(null);
                }}
                className={`p-3.5 rounded-xl border transition-all flex items-center gap-3 text-left ${
                  domain === 'FINANCE'
                    ? 'bg-amber-950/40 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-black/40 border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${
                  domain === 'FINANCE'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/[0.04] text-zinc-400 border-white/10'
                }`}>
                  <LineChart className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-white block">
                    Financial Mastery & Modeling
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    LBO modeling, M&A synergies, DCF & quant derivatives
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Time Commitment Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
                2. SPECIFY AVAILABLE TIME COMMITMENT:
              </label>
              <span className="font-mono text-xs font-bold text-cyan-300">
                {selectedDuration >= 60
                  ? `${Math.floor(selectedDuration / 60)}h ${selectedDuration % 60 > 0 ? `${selectedDuration % 60}m` : ''}`
                  : `${selectedDuration}m`}{' '}
                Duration
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {DURATION_PRESETS.map(dur => {
                const isSelected = selectedDuration === dur;
                const isMax = dur === 240;
                return (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(850);
                      setSelectedDuration(dur);
                      setSelectedPrescriptionId(null);
                    }}
                    className={`py-2 px-1 rounded-xl font-mono text-xs font-bold transition-all border text-center ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                        : isMax
                        ? 'bg-rose-950/20 border-rose-500/30 text-rose-300 hover:border-rose-500/50'
                        : 'bg-black/50 border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {dur >= 60 ? `${dur / 60}h` : `${dur}m`}
                    {isMax && <span className="block text-[8px] text-rose-400">MAX</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Science-Backed Curated Options */}
          <div className="space-y-3">
            <label className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
              <span>3. SELECT ONE OF {prescriptions.length} CURATED PROTOCOLS:</span>
              <span className="text-[10px] text-emerald-400 font-normal">
                ✓ Optimized for Operator Level {profile.level}
              </span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {prescriptions.map((p, idx) => {
                const isSelected = activePrescription?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      soundEngine.playClick(900);
                      setSelectedPrescriptionId(p.id);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                        : 'bg-black/40 border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider border ${
                          p.difficulty === 'ELITE'
                            ? 'bg-purple-950 text-purple-300 border-purple-500/40'
                            : p.difficulty === 'INTENSE'
                            ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                            : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                        }`}>
                          {p.difficulty}
                        </span>

                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white font-serif leading-tight">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {p.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] mt-3 space-y-1 text-[10px] font-mono">
                      <div className="text-emerald-400 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span>{p.calorieBurnOrXPBonus}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Option Deep Dive Details */}
          {activePrescription && (
            <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    Protocol Roadmap:
                  </span>
                  <h4 className="text-sm font-bold text-white font-serif">
                    {activePrescription.title}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                  {activePrescription.durationMinutes} Minutes Required
                </span>
              </div>

              {/* Steps Checklist Preview */}
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {isFitness &&
                  activePrescription.exerciseSteps?.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-white/[0.05] text-zinc-400 font-mono text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-white">{step.name}</span>
                          <span className="text-[10px] text-zinc-400 block font-mono">
                            {step.targetMuscle} • {step.intensityRpe}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 font-mono text-[10px] border border-rose-500/20 font-bold">
                        {step.sets} × {step.reps}
                      </span>
                    </div>
                  ))}

                {!isFitness &&
                  activePrescription.financeSteps?.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-white/[0.05] text-zinc-400 font-mono text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-white">{step.topic}</span>
                          <span className="text-[10px] text-zinc-400 block font-mono">
                            {step.deliverable}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 font-mono text-[10px] border border-amber-500/20 font-bold">
                        {step.durationMinutes}m Drill
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0c0d14] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-zinc-400 font-mono">
            <span>Upon completion: </span>
            <span className="text-emerald-400 font-bold">
              +{Math.floor(selectedDuration * 1.5)} XP + Sliders auto-advance to {Math.floor(selectedDuration / 60)}h {selectedDuration % 60 > 0 ? `${selectedDuration % 60}m` : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-semibold transition-all border border-white/10"
            >
              Cancel
            </button>

            <button
              onClick={handleStartTimerClicked}
              disabled={!activePrescription}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>START PROTOCOL TIMER ({selectedDuration} MIN)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Initiation Confirmation Dialog */}
      {isConfirmingStart && activePrescription && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0e0e14] border-2 border-cyan-500/50 rounded-2xl p-6 space-y-5 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <Play className="h-6 w-6 fill-cyan-300" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-serif">
                  Initiate {activePrescription.durationMinutes}-Minute Protocol?
                </h4>
                <p className="text-xs text-zinc-400">
                  {activePrescription.title}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400 font-mono">
                <span>Timer Duration:</span>
                <span className="text-white font-bold">{activePrescription.durationMinutes} Minutes</span>
              </div>
              <div className="flex justify-between text-zinc-400 font-mono">
                <span>Planned Output:</span>
                <span className="text-emerald-400 font-bold">+{Math.floor(activePrescription.durationMinutes * 1.5)} XP</span>
              </div>
              <div className="flex justify-between text-zinc-400 font-mono">
                <span>Slider Auto-Sync:</span>
                <span className="text-cyan-300 font-bold">Home & Analytics</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 italic">
              💡 You can pause at any time for breaks. If you cancel early, zero XP is recorded.
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
    </div>
  );
};
