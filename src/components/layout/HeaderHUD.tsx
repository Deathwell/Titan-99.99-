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
  CheckCircle2,
  AlarmClock,
  ChevronRight,
  Radio
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { DailyStoryReelModal } from '../modals/DailyStoryReelModal';
import { MysteryLootModal, isMysteryDropClaimedToday } from '../modals/MysteryLootModal';

export const HeaderHUD: React.FC = () => {
  const {
    profile,
    composite,
    syncStatus,
    alarms,
    activeTab,
    setActiveTab,
    setIsSettingsOpen,
    setIsSyncModalOpen
  } = useTitan();

  const activeAlarmsCount = alarms.filter(a => a.isEnabled).length;

  const [dateStr, setDateStr] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('');
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);
  const [isLootOpen, setIsLootOpen] = useState<boolean>(false);
  const [claimedToday, setClaimedToday] = useState<boolean>(false);

  const isSynced = syncStatus === 'SYNCED';

  const tabLabels: Record<string, string> = {
    overview: 'Today',
    hologram: 'Body Scanner',
    quests: 'Quests & Badges',
    charts: 'Analytics & Profile'
  };

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
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#060913]/90 backdrop-blur-2xl px-4 lg:px-8 py-3 transition-all font-sans shadow-lg">
        {/* Luminous Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00f0ff] via-[#8c52ff] to-transparent opacity-70" />

        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Breadcrumbs & Story Avatar */}
          <div className="flex items-center gap-3">
            {/* Holographic Story Ring Avatar */}
            <button
              onClick={() => setIsStoryOpen(true)}
              className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#00f0ff] via-[#8c52ff] to-[#e5b95c] shadow-matrix-cyan hover:scale-105 active:scale-95 transition-all"
              title="Daily 24h Story Reel"
            >
              <div className="h-8 w-8 rounded-full bg-[#05070e] flex items-center justify-center text-xs font-black text-white border border-white/10">
                {profile.level}
              </div>
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#00f0ff] border-2 border-black animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#00f0ff] border-2 border-black" />
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300">
              <span className="text-white font-extrabold tracking-tight">TITAN</span>
              <ChevronRight className="h-3 w-3 text-cyan-400" />
              <span className="text-cyan-300 font-semibold">{tabLabels[activeTab] || 'Cockpit'}</span>
            </div>
          </div>

          {/* Center: Luxury Status Indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Percentile Rank Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-xs shadow-sm">
              <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-slate-300 hidden xs:inline text-[11px] font-medium">Rank:</span>
              <span className="text-white font-extrabold font-mono">
                Top {(100 - (composite?.percentileGlobal || 50)).toFixed(1)}%
              </span>
            </div>

            {/* Porsche Gold Streak Pill */}
            <div
              onClick={() => setIsStoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/35 text-xs cursor-pointer hover:bg-amber-500/25 transition-all shadow-sm"
            >
              <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="text-amber-300 font-black font-mono">{profile.streakDays}d</span>
            </div>

            {/* Mystery Loot Pill */}
            <button
              onClick={() => setIsLootOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold transition-all ${
                claimedToday
                  ? 'bg-white/[0.04] border-white/10 text-slate-400'
                  : 'bg-gradient-to-r from-amber-500/20 to-purple-600/20 border-amber-400/50 text-amber-300 shadow-porsche-gold hover:scale-105'
              }`}
            >
              {claimedToday ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Vault Claimed</span>
                </>
              ) : (
                <>
                  <Gift className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
                  <span className="hidden sm:inline">Vault (1/1)</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Controls & Alarms */}
          <div className="flex items-center gap-2">
            {/* AMG Crimson Tactical Alarms */}
            <button
              onClick={() => setActiveTab('charts')}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
                activeAlarmsCount > 0
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 shadow-amg-crimson'
                  : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
              title="Tactical Alarms"
            >
              <AlarmClock className="h-4 w-4 text-rose-400" />
              {activeAlarmsCount > 0 && (
                <span className="hidden sm:inline font-mono font-bold text-[11px]">
                  {activeAlarmsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsSyncModalOpen(true)}
              className={`px-2.5 py-1.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
                isSynced
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-cyber-emerald'
                  : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Sync Devices"
            >
              <span className={`h-2 w-2 rounded-full ${isSynced ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="hidden sm:inline font-semibold text-[11px]">{isSynced ? 'Synced' : 'Pair'}</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition-all"
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
