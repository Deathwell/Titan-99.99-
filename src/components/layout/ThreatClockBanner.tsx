import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Clock,
  Flame,
  Zap,
  Radio,
  Users,
  TrendingDown,
  TrendingUp,
  Skull,
  ShieldAlert,
  ArrowDownRight
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';

export const ThreatClockBanner: React.FC = () => {
  const { workoutLogs, financeLogs, profile } = useTitan();

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [overtakeCount, setOvertakeCount] = useState<number>(734);

  // Live countdown until midnight local time
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      const diffMs = Math.max(0, midnight.getTime() - now.getTime());
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });

      // Dynamic calculation: simulated contenders active based on hour of day
      const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const calculatedOvertakes = Math.floor(500 + (secondsSinceMidnight / 86400) * 1200);
      setOvertakeCount(calculatedOvertakes);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if today has at least 1 protocol logged
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkouts = workoutLogs.filter(w => w.timestamp.startsWith(todayStr) && (w.durationMinutes || 0) > 0);
  const todayFinance = financeLogs.filter(f => f.timestamp.startsWith(todayStr) && (f.durationMinutes || 0) > 0);

  const hasLoggedToday = todayWorkouts.length > 0 || todayFinance.length > 0;
  const isUrgent = timeLeft.hours < 6 && !hasLoggedToday;

  const padZero = (n: number) => n.toString().padStart(2, '0');

  const handleRadarClick = () => {
    soundEngine.playClick(hasLoggedToday ? 880 : 320);
  };

  return (
    <div
      onClick={handleRadarClick}
      className={`rounded-xl border p-4 sm:p-5 transition-all duration-300 font-sans relative overflow-hidden select-none cursor-pointer group ${
        hasLoggedToday
          ? 'bg-[#0f1713]/90 border-emerald-500/30 hover:border-emerald-500/50 shadow-lg'
          : isUrgent
          ? 'bg-[#1a0c10]/95 border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.18)] animate-pulse'
          : 'bg-[#140f12]/90 border-amber-500/30 hover:border-amber-500/50 shadow-md'
      }`}
    >
      {/* Background Subtle Laser Indicator */}
      <div className={`absolute top-0 left-0 bottom-0 w-1 ${
        hasLoggedToday ? 'bg-emerald-400' : isUrgent ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'
      }`} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-1">
        {/* Left: Authoritative Warning Header */}
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-105 ${
            hasLoggedToday
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : isUrgent
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-bounce'
              : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
          }`}>
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
              <span className={`text-[10px] font-black tracking-widest uppercase font-mono px-2 py-0.5 rounded border ${
                hasLoggedToday
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : isUrgent
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 animate-pulse'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              }`}>
                {hasLoggedToday ? '● PROTOCOL SECURED • ZERO DECAY' : isUrgent ? '⚠️ CRITICAL INACTIVITY THREAT' : '⚠️ INACTIVITY DECAY WARNING'}
              </span>

              {!hasLoggedToday && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-rose-400/90 font-bold">
                  <Users className="h-3 w-3" />
                  <span>{overtakeCount} contenders trained today</span>
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-300 font-normal leading-relaxed">
              {hasLoggedToday ? (
                <>
                  Daily standards executed. Your <strong className="text-white font-semibold">Top Percentile rank</strong> and <strong className="text-emerald-300 font-mono">{profile.streakDays}d streak</strong> are fortified against decay.
                </>
              ) : (
                <>
                  Zero protocols logged. At midnight, <strong className="text-rose-400 font-semibold">Rank Decay</strong> will dock <strong className="text-rose-300 font-mono">-150 XP</strong> and drop your global standing.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right: Live Ticker & Quick Status */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-white/[0.08] font-mono text-xs">
            <Clock className={`h-3.5 w-3.5 ${hasLoggedToday ? 'text-emerald-400' : isUrgent ? 'text-rose-400 animate-spin' : 'text-amber-400'}`} />
            <span className="text-[10px] text-zinc-400">DEADLINE:</span>
            <span className={`font-bold tracking-wider ${hasLoggedToday ? 'text-emerald-400' : isUrgent ? 'text-rose-400' : 'text-amber-300'}`}>
              {padZero(timeLeft.hours)}:{padZero(timeLeft.minutes)}:{padZero(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
