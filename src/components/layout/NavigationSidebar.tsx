import React from 'react';
import {
  Activity,
  TrendingUp,
  Dumbbell,
  Eye,
  LineChart,
  AlarmClock,
  CheckSquare,
  Compass,
  Shield,
  Settings,
  Volume2,
  VolumeX,
  Database,
  ArrowRightLeft,
  Flame,
  Zap,
  Sparkles
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { LivingFlameAvatar } from '../effects/LivingFlameAvatar';

interface NavItem {
  id: 'overview' | 'charts' | 'physique' | 'hologram' | 'finance' | 'alarms' | 'quests' | 'curriculum';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  accent?: string;
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
    alarms,
    quests
  } = useTitan();

  const isSynced = syncStatus === 'SYNCED';
  const activeAlarmsCount = alarms.filter(a => a.isEnabled).length;
  const pendingQuestsCount = quests.filter(q => !q.completed).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Feed & Status', icon: Activity },
    { id: 'hologram', label: 'Neural Hologram', icon: Eye, badge: 'AI', accent: 'text-cyan-400' },
    { id: 'physique', label: 'Physique & Body', icon: Dumbbell, accent: 'text-emerald-400' },
    { id: 'charts', label: 'Analytics & Curve', icon: TrendingUp },
    { id: 'finance', label: 'Finance Mastery', icon: LineChart, accent: 'text-amber-400' },
    { id: 'alarms', label: 'Tactical Alarms', icon: AlarmClock, badge: activeAlarmsCount > 0 ? `${activeAlarmsCount}` : undefined },
    { id: 'quests', label: 'Quest Protocol', icon: CheckSquare, badge: pendingQuestsCount > 0 ? `${pendingQuestsCount}` : undefined },
    { id: 'curriculum', label: 'Curriculum', icon: Compass }
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 border-r border-white/[0.08] bg-[#05070d]/90 backdrop-blur-2xl p-4 lg:p-6 select-none z-30">
      {/* Top Brand Logo */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-glow-cyan">
              <Shield className="h-5 w-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white">TITAN</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-bold">
                  99.9%
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Protocol OS v2.7</p>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            title={profile.soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {profile.soundEnabled ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-white font-semibold border-l-2 border-cyan-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : item.accent || 'text-slate-400'}`} />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    isActive ? 'bg-cyan-400 text-black shadow-glow-cyan' : 'bg-white/[0.08] text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Living Streak Flame & Bottom Profile Tray */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        {/* Living Fire Avatar Widget */}
        <LivingFlameAvatar />

        {/* Sync Status Banner */}
        <button
          onClick={() => setIsSyncModalOpen(true)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all text-xs"
        >
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isSynced ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-slate-300 font-medium">{isSynced ? 'Cloud Synced' : 'Offline / Standalone'}</span>
          </div>
          <ArrowRightLeft className="h-3.5 w-3.5 text-slate-400" />
        </button>

        {/* Operator Profile Card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-glow-purple">
              {profile.level}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                {profile.callsign || 'Operator-01'}
                <Flame className="h-3 w-3 text-amber-400 shrink-0" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                Streak: {profile.streakDays}d • Level {profile.level}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsBackupOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
              title="Backup Data"
            >
              <Database className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
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
