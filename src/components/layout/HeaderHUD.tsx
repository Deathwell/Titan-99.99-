import React, { useState, useEffect } from 'react';
import {
  Shield,
  Settings,
  Flame,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

export const HeaderHUD: React.FC = () => {
  const {
    profile,
    composite,
    syncStatus,
    setIsSettingsOpen,
    setIsSyncModalOpen
  } = useTitan();

  const [dateStr, setDateStr] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('');

  const isSynced = syncStatus === 'SYNCED';

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#05070d]/80 backdrop-blur-xl px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Branding & Date */}
        <div className="flex items-center gap-3">
          <div className="md:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-glow-cyan">
              <Shield className="h-4 w-4 text-black stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">TITAN</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Calendar className="h-3.5 w-3.5 text-cyan-400" />
            <span>{dateStr}</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-slate-300">{timeStr}</span>
          </div>
        </div>

        {/* Center: Hero Rank & Streak Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Percentile Rank Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-xs">
            <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-400 font-medium hidden xs:inline">Rank:</span>
            <strong className="text-cyan-300 font-bold font-mono">
              Top {(100 - (composite?.percentileGlobal || 50)).toFixed(1)}%
            </strong>
          </div>

          {/* Streak Flame Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs">
            <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <strong className="text-amber-300 font-bold font-mono">
              {profile.streakDays}d
            </strong>
            <span className="text-slate-400 text-[11px] hidden sm:inline">Streak</span>
          </div>

          {/* Level XP Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs">
            <Award className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-slate-400 font-medium">Tier:</span>
            <strong className="text-purple-300 font-bold">Lvl {profile.level}</strong>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              isSynced
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
            title="Sync Devices"
          >
            <span className={`h-2 w-2 rounded-full ${isSynced ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="hidden sm:inline font-medium">{isSynced ? 'Synced' : 'Pair'}</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
