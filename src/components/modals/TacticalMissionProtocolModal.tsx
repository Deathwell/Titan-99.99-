import React, { useState } from 'react';
import {
  Sparkles,
  Dumbbell,
  Clock,
  Zap,
  CheckCircle2,
  X,
  Play
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import {
  TacticalPrescription,
  generateCustomPrescription,
  IntensityLevel
} from '../../lib/prescriptionEngine';
import { soundEngine } from '../../lib/audio';

interface TacticalMissionProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchTimer?: (prescription: TacticalPrescription) => void;
}

export const TacticalMissionProtocolModal: React.FC<TacticalMissionProtocolModalProps> = ({
  isOpen,
  onClose,
  onLaunchTimer
}) => {
  const { profile, setActiveTab } = useTitan();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-md bg-[#0e0e14] border-2 border-cyan-500/50 rounded-2xl p-6 space-y-5 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
          <Sparkles className="h-7 w-7 animate-pulse" />
        </div>

        <div className="space-y-1">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30 tracking-widest uppercase">
            ORACLE PRESCRIPTION
          </span>
          <h3 className="text-lg font-bold text-white font-serif">
            Clueless? Dedicated Tab Ready
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Switch to the dedicated <strong>Clueless?</strong> tab to customize Age, Gender, Equipment, Intensity, and 15m–4h interval.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => {
              soundEngine.playClick(900);
              setActiveTab('clueless');
              onClose();
            }}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95"
          >
            Open Clueless? Tab
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-all border border-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
