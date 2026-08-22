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
  Radio,
  Zap
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { CountUpNumber } from '../effects/CountUpNumber';
import { DailyStoryReelModal } from '../modals/DailyStoryReelModal';
import { MysteryLootModal, isMysteryDropClaimedToday } from '../modals/MysteryLootModal';

export const HeaderHUD: React.FC = () => {
  const {
    activeTab,
    profile,
    syncStatus,
    syncCode,
    pairedDevices,
    alarms,
    openAlarmsTab,
    setIsSyncModalOpen,
    setIsSettingsOpen
  } = useTitan();

  const activeAlarmsCount = alarms.filter(a => a.isEnabled).length;

  const [dateStr, setDateStr] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('');
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);
  const [isLootOpen, setIsLootOpen] = useState<boolean>(false);

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
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#09090d]/90 backdrop-blur-2xl px-4 lg:px-8 py-2.5 transition-all font-sans">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Clean Breadcrumbs & Level Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStoryOpen(true)}
              className="relative p-0.5 rounded-full bg-gradient-to-tr from-rose-500 via-red-600 to-amber-500 hover:scale-105 active:scale-95 transition-all shadow-sm"
              title="Daily Story Reel"
            >
              <div className="h-7 w-7 rounded-full bg-[#0e0e13] flex items-center justify-center text-[11px] font-bold text-white">
                {profile.level}
              </div>
            </button>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-white font-bold tracking-tight">TITAN</span>
              <ChevronRight className="h-3 w-3 text-zinc-500" />
              <span className="text-rose-400 font-semibold">{tabLabels[activeTab] || 'Cockpit'}</span>
            </div>
          </div>

          {/* Right: Total XP Earned & Utility Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Total XP Earned Badge (Top Right Corner) */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border border-amber-500/30 text-amber-300 shadow-sm backdrop-blur-md">
              <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="text-[10px] text-amber-200/70 font-semibold hidden xs:inline">Total XP:</span>
              <span className="font-mono font-bold text-xs text-white">
                <CountUpNumber end={profile.xp} decimals={0} suffix=" XP" />
              </span>
            </div>

            {/* Tactical Alarms Button */}
            <button
              onClick={openAlarmsTab}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                activeAlarmsCount > 0
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  : 'bg-white/[0.03] border-white/[0.07] text-zinc-400 hover:text-white'
              }`}
              title="Tactical Alarms"
            >
              <AlarmClock className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-[11px]">
                {activeAlarmsCount > 0 ? `${activeAlarmsCount}` : 'Alarms'}
              </span>
            </button>

            {/* Cloud Sync Status */}
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                isSynced
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 shadow-sm'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
              }`}
              title="Cloud Sync & Paired Devices"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isSynced ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden sm:inline text-[11px] font-mono">
                {isSynced
                  ? pairedDevices.length > 1
                    ? `LINKED (${pairedDevices.length} DEVS)`
                    : 'SYNCED'
                  : 'OFFLINE'}
              </span>
            </button>

            {/* Settings Cog */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.07] transition-all"
              title="Settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Story Reel Modal */}
      <DailyStoryReelModal isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
      {/* Mystery Loot Modal */}
      <MysteryLootModal isOpen={isLootOpen} onClose={() => setIsLootOpen(false)} />
    </>
  );
};
