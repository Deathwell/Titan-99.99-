import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Flame,
  TrendingUp,
  Award,
  Zap,
  Users,
  Shield,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';
import { triggerGlobalConfetti } from '../effects/ConfettiCanvas';

interface DailyStoryReelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyStoryReelModal: React.FC<DailyStoryReelModalProps> = ({ isOpen, onClose }) => {
  const { profile, composite, metrics } = useTitan();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const totalSlides = 3;
  const slideDurationMs = 5000;

  useEffect(() => {
    if (!isOpen) {
      setCurrentSlide(0);
      setProgress(0);
      return;
    }

    soundEngine.playStorySlideTransition();

    const interval = 50; // update every 50ms
    const step = (interval / slideDurationMs) * 100;

    const timer = setInterval(() => {
      if (isPaused) return;

      setProgress(prev => {
        if (prev + step >= 100) {
          if (currentSlide < totalSlides - 1) {
            setCurrentSlide(c => c + 1);
            soundEngine.playStorySlideTransition();
            return 0;
          } else {
            clearInterval(timer);
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, currentSlide, isPaused, onClose]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(c => c + 1);
      setProgress(0);
      soundEngine.playStorySlideTransition();
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(c => c - 1);
      setProgress(0);
      soundEngine.playStorySlideTransition();
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerGlobalConfetti(e.clientX, e.clientY);
    soundEngine.playMilestoneFanfare();
    alert('Story Snapshot generated! Ready to share to Instagram & X.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="w-full max-w-md h-[90vh] max-h-[720px] rounded-3xl border border-white/[0.12] bg-[#070912] overflow-hidden flex flex-col justify-between relative shadow-[0_0_50px_rgba(0,242,254,0.15)]">
        {/* Top Story Progress Bars (Instagram Style) */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{
                  width: idx < currentSlide ? '100%' : idx === currentSlide ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Top User Header */}
        <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-400 p-0.5 shadow-glow-cyan">
              <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white">
                {profile.level}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                {profile.callsign || 'Operator-01'}
                <Sparkles className="h-3 w-3 text-cyan-400" />
              </div>
              <span className="text-[10px] text-slate-400">Daily Titan Drop • 24h Reel</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Story Slide Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10 select-none">
          {currentSlide === 0 && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="h-28 w-28 mx-auto rounded-full bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center shadow-glow-cyan">
                <TrendingUp className="h-12 w-12 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">24H PERFORMANCE DELTA</span>
                <h3 className="text-3xl font-black text-white mt-1">
                  TOP {(100 - (composite?.percentileGlobal || 50)).toFixed(1)}%
                </h3>
                <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  Your physiological stamina and capital growth outrank {(composite?.humansDefeated / 1000000).toFixed(1)} Million humans worldwide today.
                </p>
              </div>
            </div>
          )}

          {currentSlide === 1 && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="h-28 w-28 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-400 flex items-center justify-center shadow-glow-amber">
                <Flame className="h-14 w-14 text-amber-400 animate-pulse fill-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">RELENTLESS STREAK FUEL</span>
                <h3 className="text-4xl font-black text-white mt-1">
                  {profile.streakDays} DAYS ALIVE
                </h3>
                <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  Decay penalty locked. Keep your daily quest momentum active before midnight to protect your compound multipliers!
                </p>
              </div>
            </div>
          )}

          {currentSlide === 2 && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="h-28 w-28 mx-auto rounded-full bg-purple-500/10 border-2 border-purple-400 flex items-center justify-center shadow-glow-purple">
                <Award className="h-12 w-12 text-purple-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">TITAN PROTOCOL LEVEL</span>
                <h3 className="text-3xl font-black text-white mt-1">
                  LEVEL {profile.level} OPERATOR
                </h3>
                <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                  {profile.xp} Lifetime XP. You are 1 step closer to the 99.9th percentile apex elite tier.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tap Navigator Overlays */}
        <div className="absolute inset-0 z-0 flex">
          <div onClick={handlePrev} className="w-1/3 h-full cursor-w-resize" />
          <div onClick={handleNext} className="w-2/3 h-full cursor-e-resize" />
        </div>

        {/* Bottom Action Footer */}
        <div className="relative z-20 p-6 pt-0 flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="flex-1 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.12] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Share2 className="h-4 w-4 text-cyan-400" /> Share Story
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs shadow-glow-cyan transition-all active:scale-95"
          >
            {currentSlide === totalSlides - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};
