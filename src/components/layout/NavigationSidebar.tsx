import React, { useEffect } from 'react';
import {
  Inbox,
  Eye,
  CheckCircle2,
  BarChart3,
  Shield,
  Settings,
  Volume2,
  VolumeX,
  Database,
  Search,
  Flame,
  ChevronDown,
  Sparkles,
  Command,
  Crown
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

interface NavItem {
  id: 'overview' | 'hologram' | 'quests' | 'charts';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  keycap: string;
  badge?: string;
  badgeColor?: string;
}

export const NavigationSidebar: React.FC = () => {
  const {
    profile,
    activeTab,
    setActiveTab,
    setIsSettingsOpen,
    setIsCommandPaletteOpen,
    setIsBackupOpen,
    setIsSyncModalOpen,
    syncStatus,
    toggleSound,
    quests
  } = useTitan();

  const isSynced = syncStatus === 'SYNCED';
  const pendingQuestsCount = quests.filter(q => !q.completed).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Today', icon: Inbox, keycap: '1' },
    { id: 'hologram', label: 'Body Scanner', icon: Eye, keycap: '2', badge: 'AI LIVE', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40' },
    { id: 'quests', label: 'Trophies & Badges', icon: Crown, keycap: '3' },
    { id: 'charts', label: 'Analytics & Profile', icon: BarChart3, keycap: '4' }
  ];

  // Listen for 1, 2, 3, 4 keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;
      if (e.key === '1') setActiveTab('overview');
      else if (e.key === '2') setActiveTab('hologram');
      else if (e.key === '3') setActiveTab('quests');
      else if (e.key === '4') setActiveTab('charts');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 border-r border-white/[0.08] bg-[#09090d]/95 backdrop-blur-2xl p-4 select-none z-30 font-sans">
      {/* Top Brand Header */}
      <div className="space-y-5">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#ff2e4d] animate-pulse" />
            <div>
              <span className="text-xs font-black text-white tracking-wider font-mono block">
                TITAN PROTOCOL
              </span>
              <span className="text-[9px] text-zinc-400 font-mono tracking-widest block uppercase">
                99.9% APEX SYSTEM
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSound();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title={profile.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {profile.soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-rose-400" /> : <VolumeX className="h-3.5 w-3.5 text-zinc-500" />}
          </button>
        </div>

        {/* Quick Search Bar */}
        <div
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-xs text-zinc-300 cursor-pointer transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-[11px] text-zinc-400 font-medium">Search Protocol...</span>
          </div>
          <kbd className="linear-kbd">⌘K</kbd>
        </div>

        {/* 4 Primary Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500/20 via-red-600/10 to-transparent text-white border border-rose-500/35'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-rose-400' : 'text-zinc-400 group-hover:text-white'}`} />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold font-mono border ${item.badgeColor || 'bg-white/10 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                  <kbd className="linear-kbd opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.keycap}
                  </kbd>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Tray */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        {/* Device Sync & Streak Badge */}
        <div className="flex items-center justify-between px-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${isSynced ? 'bg-emerald-400 shadow-sm' : 'bg-zinc-500'}`} />
            <span className="text-[11px] text-zinc-300 font-semibold">{isSynced ? 'Cloud Synced' : 'Offline Mode'}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
            <Flame className="h-3.5 w-3.5 fill-amber-400 animate-pulse" />
            <span className="font-mono">{profile.streakDays}d</span>
          </div>
        </div>

        {/* User Card */}
        <div
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-rose-500 to-red-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {profile.callsign?.charAt(0) || 'A'}
            </div>
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-rose-400 transition-colors">
                {profile.callsign || 'Operator'}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono block">
                Tier {profile.level} • {profile.xp} XP
              </span>
            </div>
          </div>

          <Settings className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  );
};
