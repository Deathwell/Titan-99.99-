import React from 'react';
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
  ArrowRight
} from 'lucide-react';
import { ExerciseGuide, findExerciseGuide } from '../../lib/exerciseGuideDatabase';
import { soundEngine } from '../../lib/audio';

interface ExerciseGuideModalProps {
  exerciseName: string;
  onClose: () => void;
}

export const ExerciseGuideModal: React.FC<ExerciseGuideModalProps> = ({ exerciseName, onClose }) => {
  const guide = findExerciseGuide(exerciseName);

  const handleClose = () => {
    soundEngine.playClick(600);
    onClose();
  };

  // Render dynamic SVG illustration based on exercise biomechanical category
  const renderIllustration = () => {
    switch (guide.illustrationType) {
      case 'squat':
      case 'lunge':
        return (
          <svg className="w-full h-44" viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="16" fill="#090a10" />
            <line x1="20" y1="140" x2="280" y2="140" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
            {/* Floor base */}
            <circle cx="150" cy="40" r="14" fill="#06b6d4" fillOpacity="0.2" stroke="#22d3ee" strokeWidth="2" />
            {/* Torso */}
            <line x1="150" y1="54" x2="140" y2="90" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" />
            {/* Working Leg in Deep 90° Squat/Pistol */}
            <line x1="140" y1="90" x2="110" y2="110" stroke="#f43f5e" strokeWidth="7" strokeLinecap="round" />
            <line x1="110" y1="110" x2="120" y2="140" stroke="#f43f5e" strokeWidth="7" strokeLinecap="round" />
            {/* Extended Leg */}
            <line x1="140" y1="90" x2="210" y2="105" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
            {/* Arms Extended Counterbalance */}
            <line x1="150" y1="65" x2="200" y2="70" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
            {/* Tension Highlights */}
            <circle cx="125" cy="100" r="6" fill="#f43f5e" className="animate-ping" opacity="0.75" />
            <text x="20" y="28" fill="#a1a1aa" fontSize="10" fontFamily="monospace">PHASE: 3S ECCENTRIC DEEP STRETCH</text>
            <text x="210" y="130" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">TENSION: 100% GLUTE/QUAD</text>
          </svg>
        );

      case 'thrust':
        return (
          <svg className="w-full h-44" viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="16" fill="#090a10" />
            <line x1="20" y1="140" x2="280" y2="140" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
            {/* Bench Pad */}
            <rect x="50" y="80" width="30" height="60" rx="4" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
            {/* Head & Upper Back */}
            <circle cx="85" cy="70" r="12" fill="#06b6d4" fillOpacity="0.2" stroke="#22d3ee" strokeWidth="2" />
            {/* Torso in Full Horizontal Lockout */}
            <line x1="85" y1="82" x2="160" y2="82" stroke="#f43f5e" strokeWidth="7" strokeLinecap="round" />
            {/* Padded Barbell over Pelvis */}
            <circle cx="160" cy="76" r="10" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />
            <line x1="160" y1="60" x2="160" y2="100" stroke="#f59e0b" strokeWidth="3" />
            {/* Legs at 90° Angle */}
            <line x1="160" y1="82" x2="160" y2="140" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
            {/* Squeeze Indicator */}
            <circle cx="130" cy="82" r="6" fill="#f43f5e" className="animate-ping" opacity="0.8" />
            <text x="20" y="28" fill="#a1a1aa" fontSize="10" fontFamily="monospace">PHASE: 2-SEC HORIZONTAL LOCKOUT</text>
            <text x="175" y="60" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">MAX GLUTE EMG: 200%</text>
          </svg>
        );

      case 'press':
        return (
          <svg className="w-full h-44" viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="16" fill="#090a10" />
            {/* Incline 30° Bench Line */}
            <line x1="70" y1="130" x2="150" y2="70" stroke="#3f3f46" strokeWidth="6" strokeLinecap="round" />
            {/* Head & Torso */}
            <circle cx="155" cy="65" r="12" fill="#06b6d4" fillOpacity="0.2" stroke="#22d3ee" strokeWidth="2" />
            <line x1="150" y1="75" x2="100" y2="115" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" />
            {/* Arms Pressing at 30° Clavicular Angle */}
            <line x1="135" y1="85" x2="175" y2="40" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" />
            {/* Barbell / Dumbbell */}
            <line x1="160" y1="30" x2="190" y2="50" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            <circle cx="135" cy="85" r="5" fill="#f43f5e" className="animate-ping" opacity="0.8" />
            <text x="20" y="28" fill="#a1a1aa" fontSize="10" fontFamily="monospace">LINE OF DRIVE: 30° CLAVICULAR ANGLE</text>
            <text x="175" y="125" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">ROTATOR CUFF SAFE</text>
          </svg>
        );

      case 'hinge':
        return (
          <svg className="w-full h-44" viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="16" fill="#090a10" />
            <line x1="20" y1="140" x2="280" y2="140" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
            {/* Pelvis Hinging Back */}
            <circle cx="100" cy="70" r="12" fill="#06b6d4" fillOpacity="0.2" stroke="#22d3ee" strokeWidth="2" />
            {/* Flat Spine Torso */}
            <line x1="100" y1="70" x2="160" y2="85" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" />
            {/* Legs with Soft 15° Knee Bend */}
            <line x1="100" y1="70" x2="120" y2="105" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" />
            <line x1="120" y1="105" x2="125" y2="140" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" />
            {/* Arms Skimming Shin */}
            <line x1="160" y1="85" x2="150" y2="125" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="150" cy="125" r="8" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="110" cy="85" r="6" fill="#f43f5e" className="animate-ping" opacity="0.8" />
            <text x="20" y="28" fill="#a1a1aa" fontSize="10" fontFamily="monospace">PHASE: POSTERIOR PELVIC HINGE</text>
            <text x="180" y="115" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">HAMSTRING STRETCH</text>
          </svg>
        );

      default:
        return (
          <svg className="w-full h-44" viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="160" rx="16" fill="#090a10" />
            <circle cx="150" cy="80" r="40" fill="#06b6d4" fillOpacity="0.1" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 4" className="animate-spin" />
            <circle cx="150" cy="80" r="20" fill="#06b6d4" fillOpacity="0.2" stroke="#22d3ee" strokeWidth="2" />
            <Activity className="h-8 w-8 text-cyan-300 absolute" style={{ transform: 'translate(134px, 64px)' }} />
            <text x="20" y="28" fill="#a1a1aa" fontSize="10" fontFamily="monospace">KINETIC KINESIOLOGY VISUALIZER</text>
            <text x="100" y="140" fill="#22d3ee" fontSize="10" fontFamily="monospace" fontWeight="bold">OPTIMUM MOTOR RECRUITMENT</text>
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-2xl bg-[#0c0d14] border-2 border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.3)] max-h-[90vh] flex flex-col">
        
        {/* Header Strip */}
        <div className="p-5 bg-gradient-to-r from-cyan-950/40 via-[#0e1017] to-transparent border-b border-white/[0.08] flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-mono text-[9.5px] font-bold border border-cyan-500/30 uppercase tracking-widest">
                EXERCISE FORM & BIOMECHANICS
              </span>
              <span className="px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400 font-mono text-[9.5px] border border-white/[0.08]">
                {guide.category}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mt-1 tracking-tight">
              {guide.name}
            </h2>
            <p className="text-xs text-cyan-400/90 font-mono mt-0.5">
              Coached by: <strong>{guide.coachAttribution}</strong>
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
          
          {/* Visual SVG Form Illustration */}
          <div className="rounded-2xl overflow-hidden border border-white/[0.08] shadow-inner bg-black/60">
            {renderIllustration()}
          </div>

          {/* Muscle Anatomy Targeting Map */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-cyan-400" />
              <span>ANATOMICAL TARGETING</span>
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

          {/* Step-by-Step Execution Guide */}
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

          {/* Pro Coaching Cues (💡) */}
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

          {/* Common Mistakes to Avoid (⚠️) */}
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

          {/* Biomechanics & Sports Science Rationale (🔬) */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5 text-xs text-cyan-200/90 font-mono">
            <span className="text-cyan-300 font-bold">🔬 KINESIOLOGY & BIOMECHANICS PROOF: </span>
            <span>{guide.biomechanicsScience}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0b10] border-t border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs font-mono text-zinc-400">Titan Form & Physiology Encyclopedia</span>
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
