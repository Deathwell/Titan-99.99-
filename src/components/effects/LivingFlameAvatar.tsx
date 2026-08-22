import React, { useEffect, useState } from 'react';
import { Flame, Clock, Sparkles } from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

export const LivingFlameAvatar: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { profile } = useTitan();
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diffMs = endOfDay.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeftStr(`${hours}h ${mins}m`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      onClick={onClick}
      className="relative flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent border border-amber-500/20 cursor-pointer group hover:border-amber-500/40 transition-all select-none"
    >
      {/* Living Flame Icon with Ambient Fire Glow */}
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 shadow-glow-amber group-hover:scale-105 transition-transform">
        <Flame className="h-6 w-6 text-black fill-black animate-pulse" />
        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-400 animate-ping" />
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-white tracking-tight flex items-center gap-1">
            {profile.streakDays} DAY STREAK
            <Sparkles className="h-3 w-3 text-amber-400" />
          </span>
          <span className="text-[10px] font-bold text-amber-300 font-mono">
            ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 font-medium">
          <Clock className="h-3 w-3 text-amber-400/80" />
          <span>Protects at midnight ({timeLeftStr} left)</span>
        </div>
      </div>
    </div>
  );
};
