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
  Search,
  Command,
  ChevronRight
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
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#08090c]/90 backdrop-blur-2xl px-4 lg:px-8 py-2.5 transition-all font-sans">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Breadcrumbs (Linear Style) */}
          <div className="flex items-center gap-2">
            {/* Story Ring Avatar */}
            <button
              onClick={() => setIsStoryOpen(true)}
              className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#5e6ad2] to-[#56b6f7] hover:scale-105 active:scale-95 transition-all"
              title="Daily 24h Story Reel"
            >
              <div className="h-7 w-7 rounded-full bg-[#08090c] flex items-center justify-center text-[11px] font-bold text-white">
                {profile.level}
              </div>
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#56b6f7] border-2 border-[#08090c]" />
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8a8f98]">
              <span className="text-white font-semibold">Titan</span>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <span className="text-slate-300 font-medium">{tabLabels[activeTab] || 'Workspace'}</span>
            </div>
          </div>

          {/* Center: Global Status Badges */}
          <div className="flex items-center gap-2">
            {/* Global Percentile Rank */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs">
              <TrendingUp className="h-3.5 w-3.5 text-[#56b6f7]" />
              <span className="text-[#8a8f98] hidden xs:inline">Rank:</span>
              <span className="text-white font-bold font-mono">
                Top {(100 - (composite?.percentileGlobal || 50)).toFixed(1)}%
              </span>
            </div>

            {/* Streak Flame Pill */}
            <div
              onClick={() => setIsStoryOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs cursor-pointer hover:bg-amber-500/20 transition-all"
            >
              <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-amber-300 font-bold font-mono">{profile.streakDays}d</span>
            </div>

            {/* Mystery Loot Pill */}
            <button
              onClick={() => setIsLootOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
                claimedToday
                  ? 'bg-white/[0.02] border-white/[0.06] text-slate-400'
                  : 'bg-[#5e6ad2]/15 border-[#5e6ad2]/35 text-[#7c88f2] hover:bg-[#5e6ad2]/25'
              }`}
            >
              {claimedToday ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-[#30a46c]" />
                  <span className="hidden sm:inline">Claimed</span>
                </>
              ) : (
                <>
                  <Gift className="h-3 w-3 text-[#7c88f2]" />
                  <span className="hidden sm:inline">Drop 1/1</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-1.5">
            {/* Tactical Alarms */}
            <button
              onClick={() => setActiveTab('charts')}
              className={`p-1.5 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
                activeAlarmsCount > 0
                  ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
              title="Tactical Alarms"
            >
              <AlarmClock className="h-3.5 w-3.5 text-rose-400" />
              {activeAlarmsCount > 0 && (
                <span className="hidden sm:inline font-mono font-bold text-[10px]">
                  {activeAlarmsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsSyncModalOpen(true)}
              className={`px-2 py-1 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
                isSynced
                  ? 'bg-emerald-950/30 border-[#30a46c]/30 text-[#30a46c]'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white'
              }`}
              title="Sync Devices"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isSynced ? 'bg-[#30a46c]' : 'bg-slate-500'}`} />
              <span className="hidden sm:inline text-[11px] font-medium">{isSynced ? 'Synced' : 'Pair'}</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all"
              title="Settings (⌘,)"
            >
              <Settings className="h-3.5 w-3.5" />
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
