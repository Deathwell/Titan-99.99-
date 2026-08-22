import React, { useState, useEffect } from 'react';
import {
  Shield,
  Settings,
  Flame,
  Calendar,
  TrendingUp,
  Award,
  Sparkles,
  Gift,
  CheckCircle2
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { DailyStoryReelModal } from '../modals/DailyStoryReelModal';
import { MysteryLootModal, isMysteryDropClaimedToday } from '../modals/MysteryLootModal';

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
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);
  const [isLootOpen, setIsLootOpen] = useState<boolean>(false);
  const [claimedToday, setClaimedToday] = useState<boolean>(false);

  const isSynced = syncStatus === 'SYNCED';

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
      setClaimedToday(isMysteryDropClaimedToday());
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#05070d]/80 backdrop-blur-xl px-4 lg:px-8 py-3 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Instagram Story Avatar & Date */}
          <div className="flex items-center gap-3">
            {/* Pulsing Daily Story Ring Avatar */}
            <button
              onClick={() => setIsStoryOpen(true)}
              className="relative p-0.5 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-400 shadow-glow-cyan hover:scale-105 active:scale-95 transition-all group"
              title="View Daily 24h Story Reel"
            >
              <div className="h-9 w-9 rounded-full bg-black flex items-center justify-center text-xs font-black text-white group-hover:bg-slate-900 transition-colors">
                {profile.level}
              </div>
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 border-2 border-black animate-ping" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 border-2 border-black" />
            </button>

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
            <div
              onClick={() => setIsStoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs cursor-pointer hover:bg-amber-500/20 transition-all active:scale-95"
            >
              <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <strong className="text-amber-300 font-bold font-mono">
                {profile.streakDays}d
              </strong>
              <span className="text-slate-400 text-[11px] hidden sm:inline">Streak</span>
            </div>

            {/* Mystery Loot Pill (1/1 Per Day) */}
            <button
              onClick={() => setIsLootOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all active:scale-95 ${
                claimedToday
                  ? 'bg-white/[0.03] border-white/[0.08] text-slate-400'
                  : 'bg-purple-500/15 border-purple-500/40 text-purple-300 shadow-glow-purple hover:bg-purple-500/25'
              }`}
              title={claimedToday ? 'Daily Drop Claimed (1/1)' : 'Open Daily Mystery Drop (1/1 Available)'}
            >
              {claimedToday ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Drop Claimed</span>
                </>
              ) : (
                <>
                  <Gift className="h-3.5 w-3.5 text-purple-400 animate-bounce" />
                  <span className="hidden sm:inline">Daily Drop (1/1)</span>
                </>
              )}
            </button>
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

      {/* Modals */}
      <DailyStoryReelModal isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
      <MysteryLootModal isOpen={isLootOpen} onClose={() => {
        setIsLootOpen(false);
        setClaimedToday(isMysteryDropClaimedToday());
      }} />
    </>
  );
};
