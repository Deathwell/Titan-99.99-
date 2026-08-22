import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Clock,
  Flame,
  Sparkles,
  Zap
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

export const ThreatClockBanner: React.FC = () => {
  const { workoutLogs, financeLogs, profile } = useTitan();

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time remaining until midnight local time
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0); // Next 00:00:00

      const diffMs = Math.max(0, midnight.getTime() - now.getTime());
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if today has at least 1 log or 4/4 completed
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkouts = workoutLogs.filter(w => w.timestamp.startsWith(todayStr));
  const todayFinance = financeLogs.filter(f => f.timestamp.startsWith(todayStr));

  const hasLoggedToday = todayWorkouts.length > 0 || todayFinance.length > 0;
  const isUrgent = timeLeft.hours < 6 && !hasLoggedToday;

  const padZero = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      className={`rounded-2xl border p-4 shadow-xl backdrop-blur-xl transition-all font-mono ${
        hasLoggedToday
          ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
          : isUrgent
          ? 'border-rose-500 bg-rose-950/40 text-rose-200 shadow-glow-amber animate-pulse'
          : 'border-amber-500/40 bg-amber-950/25 text-amber-200'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              hasLoggedToday
                ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300'
                : isUrgent
                ? 'bg-rose-900/80 border-rose-500 text-rose-200 animate-bounce'
                : 'bg-amber-900/60 border-amber-500 text-amber-300'
            }`}
          >
            {hasLoggedToday ? (
              <ShieldCheck className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase">
                {hasLoggedToday ? '🛡️ GAINS SECURED FOR TODAY' : '⚠️ LOSS AVERSION THREAT ACTIVE'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-900/80 text-[9px] font-bold text-slate-300 border border-slate-700">
                DISCIPLINE RULE
              </span>
            </div>

            <p className="text-xs font-sans mt-0.5 text-slate-300">
              {hasLoggedToday ? (
                <>
                  Your streak and gains for today are <strong>shielded from decay</strong>. Excellent execution!
                </>
              ) : (
                <>
                  Inactivity threat: Missing today will <strong>erase previous day's gains</strong> & reset streak.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Live Clock Ticker */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-4 w-4 text-titan-cyan animate-spin" />
            <span>DAY CLOSE IN:</span>
          </div>

          <div className="text-sm font-black font-mono tracking-widest text-white">
            <span className={isUrgent ? 'text-rose-400' : 'text-titan-cyan'}>
              {padZero(timeLeft.hours)}:{padZero(timeLeft.minutes)}:{padZero(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
