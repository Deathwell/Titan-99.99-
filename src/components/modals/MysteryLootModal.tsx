import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  X,
  Zap,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Crown
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';
import { triggerGlobalConfetti } from '../effects/ConfettiCanvas';

interface MysteryLootModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MYSTERY_TITLES = [
  'APEX DISCIPLINE',
  'WALL STREET SOVEREIGN',
  'SILENT EXECUTIONER',
  'MITOCHONDRIAL BEAST',
  'TOP 0.01% OPERATOR',
  'COMPOUND ACCUMULATOR',
  'TITAN PROTOCOL COMMANDER'
];

export const MysteryLootModal: React.FC<MysteryLootModalProps> = ({ isOpen, onClose }) => {
  const { gainXP } = useTitan();
  const [phase, setPhase] = useState<'READY' | 'SHAKING' | 'OPENED'>('READY');
  const [droppedReward, setDroppedReward] = useState<{ xp: number; title: string } | null>(null);

  if (!isOpen) return null;

  const handleOpenCapsule = () => {
    if (phase !== 'READY') return;

    setPhase('SHAKING');
    soundEngine.playLootTension();

    setTimeout(() => {
      const xp = 100 + Math.floor(Math.random() * 200);
      const title = MYSTERY_TITLES[Math.floor(Math.random() * MYSTERY_TITLES.length)];

      setDroppedReward({ xp, title });
      gainXP(xp);
      setPhase('OPENED');

      triggerGlobalConfetti(window.innerWidth / 2, window.innerHeight / 2);
      soundEngine.playLootExplosion();
    }, 1200);
  };

  const handleClaim = () => {
    onClose();
    setPhase('READY');
    setDroppedReward(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl border border-white/[0.12] bg-[#090d1a] p-6 sm:p-8 text-center relative overflow-hidden shadow-[0_0_60px_rgba(138,43,226,0.25)]">
        {/* Background Ambient Glow */}
        <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {phase !== 'OPENED' ? (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-purple-400 uppercase font-mono">
                MYSTERY DAILY DROP
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">
                CYBERNETIC LOOT CAPSULE
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Variable XP boost & rare operator identity titles.
              </p>
            </div>

            {/* 3D Capsule Illustration */}
            <div
              onClick={handleOpenCapsule}
              className={`h-40 w-40 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-1 flex items-center justify-center shadow-glow-purple cursor-pointer transition-all duration-300 ${
                phase === 'SHAKING' ? 'animate-bounce scale-105' : 'hover:scale-105 hover:rotate-1'
              }`}
            >
              <div className="h-full w-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                <Gift className={`h-16 w-16 text-purple-400 ${phase === 'SHAKING' ? 'animate-spin' : 'animate-pulse'}`} />
                <span className="text-[10px] font-bold text-cyan-300 font-mono mt-2">
                  {phase === 'SHAKING' ? 'UNLOCKING...' : 'TAP TO UNLOCK'}
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenCapsule}
              disabled={phase === 'SHAKING'}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-glow-purple transition-all active:scale-95"
            >
              {phase === 'SHAKING' ? 'CRACKING CAPSULE...' : 'OPEN LOOT CAPSULE'}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase font-mono flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" /> REWARD UNLOCKED
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                +{droppedReward?.xp} XP SECURED!
              </h3>
            </div>

            {/* Unlocked Reward Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-950/60 to-slate-900/90 border border-purple-500/50 shadow-glow-purple">
              <Crown className="h-8 w-8 text-amber-400 mx-auto mb-2 animate-bounce" />
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                SPECIAL OPERATOR TITLE:
              </span>
              <div className="text-base font-extrabold text-white tracking-wide mt-1">
                "{droppedReward?.title}"
              </div>
            </div>

            <button
              onClick={handleClaim}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-extrabold text-xs shadow-glow-emerald transition-all active:scale-95"
            >
              CLAIM & EQUIP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
