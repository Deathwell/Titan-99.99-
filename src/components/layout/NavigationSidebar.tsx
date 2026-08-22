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
  Command
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

interface NavItem {
  id: 'overview' | 'hologram' | 'quests' | 'charts';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  keycap: string;
  badge?: string;
}

export const NavigationSidebar: React.FC = () => {
  const {
    profile,
    activeTab,
    setActiveTab,
    setIsSettingsOpen,
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
    { id: 'hologram', label: 'Body Scanner', icon: Eye, keycap: '2', badge: 'AI' },
    { id: 'quests', label: 'Quests & Badges', icon: CheckCircle2, keycap: '3', badge: pendingQuestsCount > 0 ? `${pendingQuestsCount}` : undefined },
    { id: 'charts', label: 'Analytics & Profile', icon: BarChart3, keycap: '4' }
  ];

  // Listen for 1, 2, 3, 4 keyboard shortcuts (Linear pattern)
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
    <aside className="hidden md:flex flex-col justify-between w-60 lg:w-64 h-screen sticky top-0 border-r border-white/[0.06] bg-[#08090c]/95 backdrop-blur-2xl p-3 select-none z-30 font-sans">
      {/* Top Workspace Header (Linear Style) */}
      <div className="space-y-4">
        {/* Workspace Brand Dropdown */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[#5e6ad2] to-[#56b6f7] flex items-center justify-center shadow-sm">
              <Shield className="h-3.5 w-3.5 text-white stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white tracking-tight">Titan Protocol</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-400 font-mono">
                99.9%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSound();
              }}
              className="p-1 rounded text-slate-400 hover:text-white"
              title={profile.soundEnabled ? 'Mute' : 'Unmute'}
            >
              {profile.soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-[#56b6f7]" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Linear Quick Command Search Bar */}
        <div
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-slate-400 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[11px] text-slate-400 font-medium">Search & Jump...</span>
          </div>
          <kbd className="linear-kbd">⌘K</kbd>
        </div>

        {/* 4 Clean Primary Navigation Rows */}
        <nav className="space-y-0.5 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-white/[0.08] text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'text-[#8a8f98] hover:text-[#ededef] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-[#56b6f7]' : 'text-[#8a8f98] group-hover:text-[#ededef]'}`} />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono ${
                      isActive ? 'bg-[#5e6ad2] text-white' : 'bg-white/[0.06] text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <kbd className="linear-kbd opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.keycap}
                  </kbd>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Tray (Linear Style) */}
      <div className="pt-3 border-t border-white/[0.06] space-y-2">
        {/* Streak & Sync Indicator */}
        <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${isSynced ? 'bg-[#30a46c]' : 'bg-slate-500'}`} />
            <span className="text-[11px] text-slate-400 font-medium">{isSynced ? 'Synced' : 'Local'}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
            <Flame className="h-3.5 w-3.5 fill-amber-400" />
            <span>{profile.streakDays}d</span>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#5e6ad2] to-[#7c88f2] flex items-center justify-center text-white font-bold text-xs shrink-0">
              {profile.level}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">
                {profile.callsign || 'Operator'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate">
                Level {profile.level}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setIsBackupOpen(true)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.06]"
              title="Backup"
            >
              <Database className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.06]"
              title="Settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
