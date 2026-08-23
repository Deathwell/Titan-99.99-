import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Activity,
  Award,
  Zap,
  Target,
  ArrowRight,
  ExternalLink,
  Play,
  Flame,
  Compass,
  Clock
} from 'lucide-react';
import { ExerciseGuide, findExerciseGuide } from '../../lib/exerciseGuideDatabase';
import { soundEngine } from '../../lib/audio';

interface ExerciseGuideModalProps {
  exerciseName: string;
  onClose: () => void;
}

export const ExerciseGuideModal: React.FC<ExerciseGuideModalProps> = ({ exerciseName, onClose }) => {
  const guide = findExerciseGuide(exerciseName);
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  const handleClose = () => {
    soundEngine.playClick(600);
    onClose();
  };

  const handleOpenYoutube = () => {
    soundEngine.playClick(900);
    window.open(guide.curatedVideoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-2xl bg-[#0c0d14] border-2 border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.3)] max-h-[90vh] flex flex-col">
        
        {/* Header Strip */}
        <div className="p-5 bg-gradient-to-r from-cyan-950/40 via-[#0e1017] to-transparent border-b border-white/[0.08] flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-mono text-[9.5px] font-bold border border-cyan-500/30 uppercase tracking-widest">
                TITAN KINESIOLOGY & FORM MANUAL
              </span>
              <span className="px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400 font-mono text-[9.5px] border border-white/[0.08]">
                {guide.category}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mt-1 tracking-tight">
              {guide.name}
            </h2>
            <p className="text-xs text-cyan-400/90 font-mono mt-0.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Scientific Framework: <strong>{guide.coachAttribution}</strong></span>
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-zinc-400 hover:text-white transition-all border border-white/10 shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          
          {/* 1. YOUTUBE VIDEO TUTORIAL HERO CARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#12080a] to-[#0c0d14] border-2 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)] flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-md">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-mono text-[9.5px] font-bold border border-red-500/30 uppercase tracking-widest flex items-center gap-1">
                  <Play className="h-2.5 w-2.5 fill-red-400" />
                  <span>VERIFIED VIDEO TUTORIAL</span>
                </span>
                <span className="text-xs text-zinc-400 font-mono">{guide.videoChannelName}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Watch High-Definition Masterclass
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Watch professional biomechanical form breakdown, angle analysis, and rep execution on YouTube.
              </p>
            </div>

            <button
              onClick={handleOpenYoutube}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-2 transition-all active:scale-95 shrink-0"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>WATCH ON YOUTUBE</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </button>
          </div>

          {/* 2. KINETIC MOVEMENT PHASES (Interactive 4-Phase System) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-cyan-400" />
                <span>4-PHASE BIOMECHANICAL MOTION BLUEPRINT</span>
              </h4>
              <span className="text-[10.5px] font-mono text-cyan-400 font-semibold">
                {guide.keyAngles}
              </span>
            </div>

            {/* Phase Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {guide.movementPhases.map((phase, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(850);
                    setActivePhaseIndex(idx);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    activePhaseIndex === idx
                      ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                      : 'bg-[#11131c] border-white/[0.06] text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <span className="text-[10px] font-mono text-cyan-300 font-bold block">
                    {phase.phaseTiming}
                  </span>
                  <span className={`text-xs font-bold block truncate mt-0.5 ${activePhaseIndex === idx ? 'text-white' : 'text-zinc-300'}`}>
                    {phase.phaseName}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Phase Detail Display */}
            <div className="p-4 rounded-2xl bg-[#11131c] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="text-xs font-bold text-white font-serif">
                  {guide.movementPhases[activePhaseIndex].phaseName}
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                  {guide.movementPhases[activePhaseIndex].phaseTiming}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {guide.movementPhases[activePhaseIndex].description}
              </p>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04] text-xs text-amber-300/90 font-mono flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span><strong>Kinetic Focus: </strong>{guide.movementPhases[activePhaseIndex].focusCue}</span>
              </div>
            </div>
          </div>

          {/* 3. MUSCLE ANATOMY TARGETING */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-cyan-400" />
              <span>ANATOMICAL TARGETING MAP</span>
            </h4>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-zinc-400 font-mono">Primary:</span>
              {guide.targetMuscles.map((m, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                  🎯 {m}
                </span>
              ))}
              <span className="text-xs text-zinc-400 font-mono ml-2">Secondary:</span>
              {guide.secondaryMuscles.map((m, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08] text-xs font-mono">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* 4. STEP-BY-STEP EXECUTION WALKTHROUGH */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span>STEP-BY-STEP EXECUTION WALKTHROUGH</span>
            </h4>
            
            <div className="space-y-2.5">
              {guide.setupSteps.map((step, idx) => (
                <div key={`setup-${idx}`} className="p-3 rounded-xl bg-[#11131c] border border-white/[0.06] flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    S{idx + 1}
                  </span>
                  <div className="text-xs text-zinc-300 leading-relaxed">
                    <strong className="text-cyan-300 font-mono">Setup: </strong>{step}
                  </div>
                </div>
              ))}

              {guide.executionSteps.map((step, idx) => (
                <div key={`exec-${idx}`} className="p-3 rounded-xl bg-[#11131c] border border-cyan-500/20 flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="text-xs text-zinc-200 leading-relaxed">
                    <strong className="text-emerald-400 font-mono">Action: </strong>{step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. PRO COACHING CUES (💡) */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>PRO COACHING FORM CUES</span>
            </h4>
            <div className="space-y-1.5 text-xs text-amber-200/90 leading-relaxed">
              {guide.proFormCues.map((cue, idx) => (
                <p key={idx} className="italic">{cue}</p>
              ))}
            </div>
          </div>

          {/* 6. COMMON MISTAKES TO AVOID (⚠️) */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <h4 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
              <span>CRITICAL MISTAKES TO AVOID</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-rose-200/90">
              {guide.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 7. BIOMECHANICS & SPORTS SCIENCE PROOF (🔬) */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5 text-xs text-cyan-200/90 font-mono">
            <span className="text-cyan-300 font-bold">🔬 KINESIOLOGY & BIOMECHANICS PROOF: </span>
            <span>{guide.biomechanicsScience}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0b10] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleOpenYoutube}
            className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
          >
            <Play className="h-3.5 w-3.5 fill-red-400" />
            <span>Search "{guide.name}" on YouTube</span>
            <ExternalLink className="h-3 w-3" />
          </button>

          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
          >
            Got It, Close Manual
          </button>
        </div>
      </div>
    </div>
  );
};
