import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Clock,
  Flame,
  Zap,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Skull
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';

export const ThreatClockBanner: React.FC = () => {
  const { workoutLogs, financeLogs, profile, simulateMissedDays } = useTitan();

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time remaining until midnight local time (end of day)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0); // 00:00:00 next day

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

  // Check if today has at least 1 log or completed task
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkouts = workoutLogs.filter(w => w.timestamp.startsWith(todayStr) && (w.durationMinutes || 0) > 0);
  const todayFinance = financeLogs.filter(f => f.timestamp.startsWith(todayStr) && (f.durationMinutes || 0) > 0);

  const hasLoggedToday = todayWorkouts.length > 0 || todayFinance.length > 0;

  // Dynamic Time Color Ramp: Starts as Dark Green (24h) and gets progressively REDDER every hour as it approaches 0!
  const totalSecondsLeft = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
  const timeFraction = Math.max(0, Math.min(1, totalSecondsLeft / 86400));
  // 150 = Emerald Green (at 24h), 45 = Amber (at 12h), 0 = Blood Red (at 0h)
  const dynamicHue = Math.round(timeFraction * 150);
  const isUrgent = timeLeft.hours < 6;

  const timerColor = `hsl(${dynamicHue}, 100%, ${isUrgent ? 55 : 45}%)`;
  const timerBg = `hsla(${dynamicHue}, 100%, 12%, 0.5)`;
  const timerBorder = `hsla(${dynamicHue}, 100%, 45%, ${0.3 + (1 - timeFraction) * 0.4})`;
  const timerGlow = `0 0 ${Math.round(8 + (1 - timeFraction) * 16)}px hsla(${dynamicHue}, 100%, 50%, ${0.25 + (1 - timeFraction) * 0.45})`;

  const padZero = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 transition-all duration-300 font-sans relative overflow-hidden select-none ${
        hasLoggedToday
          ? 'bg-[#0e1612]/90 border-emerald-500/30 shadow-lg'
          : isUrgent
          ? 'bg-[#1c0a0e]/95 border-rose-500/70 shadow-[0_0_30px_rgba(244,63,94,0.25)] animate-pulse'
          : 'bg-[#140e12]/90 shadow-md'
      }`}
      style={{
        borderColor: !hasLoggedToday ? timerBorder : undefined
      }}
    >
      {/* Background Left Laser Accent - Transitions from Green to Blood Red */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-1 transition-colors duration-500 ${isUrgent && !hasLoggedToday ? 'animate-pulse' : ''}`}
        style={{
          backgroundColor: hasLoggedToday ? '#10b981' : timerColor,
          boxShadow: `0 0 10px ${hasLoggedToday ? '#10b981' : timerColor}`
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-1">
        {/* Left: Warning & Compounding Gain Erasure Rule */}
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
              hasLoggedToday
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : isUrgent
                ? 'bg-rose-500/25 border-rose-500/60 text-rose-400 animate-bounce'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300'
            }`}
            style={{
              borderColor: !hasLoggedToday ? timerBorder : undefined,
              color: !hasLoggedToday ? timerColor : undefined
            }}
          >
            {hasLoggedToday ? (
              <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
            ) : isUrgent ? (
              <Skull className="h-5 w-5 stroke-[2.5]" />
            ) : (
              <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] font-black tracking-widest uppercase font-mono px-2 py-0.5 rounded border transition-colors"
                style={{
                  backgroundColor: hasLoggedToday ? 'rgba(6, 78, 59, 0.6)' : timerBg,
                  borderColor: hasLoggedToday ? 'rgba(16, 185, 129, 0.4)' : timerBorder,
                  color: hasLoggedToday ? '#6ee7b7' : timerColor
                }}
              >
                {hasLoggedToday ? '🛡️ GAINS SECURED FOR TODAY' : '⚠️ INACTIVITY THREAT: COMPOUNDING GAIN ERASURE ACTIVE'}
              </span>
            </div>

            <p className="text-xs text-zinc-300 font-normal leading-relaxed">
              {hasLoggedToday ? (
                <>
                  Your streak and percentile gains for today are <strong>shielded from the decay engine</strong>. Excellent execution!
                </>
              ) : (
                <>
                  <strong>Discipline Law:</strong> If you miss 1 day, your <strong>previous 1 day of gains & XP gets erased</strong>. If you miss 2 days, your <strong>previous 2 days get erased</strong> and streak resets to 0.
                </>
              )}
            </p>

            {/* Test Simulation Controls */}
            {!hasLoggedToday && (
              <div className="pt-1 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => simulateMissedDays(1)}
                  className="px-2 py-0.5 rounded bg-rose-950/50 hover:bg-rose-900/80 border border-rose-500/30 text-rose-300 text-[10px] font-mono font-semibold transition-all"
                  title="Simulate 1 missed day to test the decay penalty"
                >
                  ⚡ Test Decay: Simulate 1 Missed Day
                </button>
                <button
                  onClick={() => simulateMissedDays(2)}
                  className="px-2 py-0.5 rounded bg-rose-950/50 hover:bg-rose-900/80 border border-rose-500/30 text-rose-300 text-[10px] font-mono font-semibold transition-all"
                  title="Simulate 2 missed days"
                >
                  Simulate 2 Missed Days
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Dynamic Countdown Clock - Shifts Green -> Yellow -> Orange -> Blood Red every hour */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
          <div
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border font-mono text-xs shadow-inner transition-all duration-500"
            style={{
              backgroundColor: timerBg,
              borderColor: timerBorder,
              boxShadow: timerGlow
            }}
          >
            <Clock
              className={`h-4 w-4 transition-colors ${isUrgent ? 'animate-spin' : ''}`}
              style={{ color: timerColor }}
            />
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                DAY CLOSES IN:
              </span>
              <span
                className="text-sm font-black tracking-widest transition-colors"
                style={{ color: timerColor }}
              >
                {padZero(timeLeft.hours)}:{padZero(timeLeft.minutes)}:{padZero(timeLeft.seconds)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
