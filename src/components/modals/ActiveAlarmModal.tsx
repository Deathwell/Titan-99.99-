import React, { useEffect } from 'react';
import {
  BellRing,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  AlarmClock,
  Bot,
  X
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

export const ActiveAlarmModal: React.FC = () => {
  const { activeAlarmRinging, dismissAlarm, snoozeAlarm, updateAlarm } = useTitan();

  // Escape key closes and silences
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissAlarm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dismissAlarm]);

  if (!activeAlarmRinging) return null;

  const handleSilenceAndDisable = () => {
    updateAlarm(activeAlarmRinging.id, { isEnabled: false });
    dismissAlarm();
  };

  return (
    <div
      onClick={dismissAlarm}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in font-mono"
    >
      {/* Holographic glowing rings */}
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl animate-ping" />
      <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />

      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-3xl border-2 border-cyan-500 bg-gradient-to-b from-slate-950 via-slate-900 to-black p-6 sm:p-8 shadow-glow-cyan text-center"
      >
        {/* Top-Right Quick Close Button */}
        <button
          onClick={dismissAlarm}
          className="absolute right-4 top-4 p-2 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shadow-md"
          title="Close and Silence"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Holographic AI Core Pulse Beacon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-950/90 border-2 border-cyan-400 text-cyan-300 shadow-glow-cyan animate-pulse">
          <Bot className="h-10 w-10 animate-bounce" />
        </div>

        {/* Time Tag */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-500/80 text-cyan-300 text-xs font-black tracking-widest uppercase shadow-sm">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span>F.R.I.D.A.Y. COMMAND CHRONO // {activeAlarmRinging.time24h}</span>
        </div>

        {/* Protocol Title */}
        <h2 className="text-xl sm:text-2xl font-black text-white mt-3 tracking-wider">
          {activeAlarmRinging.label.toUpperCase()}
        </h2>

        {/* Custom Voice Message Display */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 shadow-inner">
          <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
            <Volume2 className="h-3.5 w-3.5 animate-pulse" />
            <span>F.R.I.D.A.Y. OPERATOR VOICE TRANSMISSION:</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-100 font-sans leading-relaxed">
            "{activeAlarmRinging.voiceMessage}"
          </p>
        </div>

        {/* Sound & Speech Status Notice */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>F.R.I.D.A.Y. voice annunciator transmitting</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleSilenceAndDisable}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-rose-800 bg-rose-950/60 hover:bg-rose-900 text-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <VolumeX className="h-4 w-4 text-rose-400" />
            <span>Turn Off & Set Standby</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2.5 justify-end">
            <button
              onClick={() => snoozeAlarm(5)}
              className="py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Clock className="h-4 w-4 text-amber-400" />
              <span>Snooze</span>
            </button>

            <button
              onClick={dismissAlarm}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-black text-xs shadow-glow-cyan flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
            >
              <Zap className="h-4 w-4" />
              <span>Acknowledge (+50 XP)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
