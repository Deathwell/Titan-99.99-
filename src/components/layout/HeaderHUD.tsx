import React, { useState, useEffect } from 'react';
import {
  Shield,
  Volume2,
  VolumeX,
  Settings,
  Database,
  Flame,
  Zap,
  Activity,
  Award,
  TrendingUp,
  Dumbbell,
  LineChart,
  CheckSquare,
  Compass,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Calendar,
  Clock,
  AlarmClock,
  BellRing,
  ArrowRightLeft
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

interface NavItem {
  id: 'overview' | 'charts' | 'physique' | 'finance' | 'alarms' | 'quests' | 'curriculum';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const HeaderHUD: React.FC = () => {
  const {
    profile,
    activeTab,
    setActiveTab,
    setIsSettingsOpen,
    setIsBackupOpen,
    isSyncModalOpen,
    setIsSyncModalOpen,
    syncStatus,
    toggleSound,
    composite,
    alarms,
    resetAllData,
    loadDemoMode,
    simulateMissedDays
  } = useTitan();

  const [dateStr, setDateStr] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('');
  const [utcStr, setUtcStr] = useState<string>('');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase());
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
      setUtcStr(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentLevelXP = Math.pow(profile.level - 1, 2) * 12;
  const nextLevelXP = Math.pow(profile.level, 2) * 12;
  const levelProgress = Math.min(100, Math.max(0, ((profile.xp - currentLevelXP) / (nextLevelXP - currentLevelXP || 1)) * 100));

  const activeAlarmsCount = alarms.filter(a => a.isEnabled).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'OVERVIEW', icon: Activity },
    { id: 'charts', label: 'ANALYTICS & BELL CURVE', icon: TrendingUp },
    { id: 'physique', label: 'PHYSIQUE HUB', icon: Dumbbell },
    { id: 'finance', label: 'FINANCE HUB', icon: LineChart },
    { id: 'alarms', label: 'TACTICAL ALARMS', icon: AlarmClock, badge: activeAlarmsCount > 0 ? `${activeAlarmsCount}` : undefined },
    { id: 'quests', label: 'QUEST PROTOCOL', icon: CheckSquare },
    { id: 'curriculum', label: 'TACTICAL CURRICULUM', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-titan-cardBorder bg-titan-bg/95 backdrop-blur-md">
      {/* Top Telemetry Strip with Real-Time Clock & Date */}
      <div className="border-b border-slate-800/80 bg-black/50 px-4 py-1 text-xs text-titan-slate flex flex-wrap items-center justify-between gap-2 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-titan-cyan">
            <span className="h-2 w-2 rounded-full bg-titan-cyan animate-ping inline-block" />
            <span className="h-2 w-2 rounded-full bg-titan-cyan inline-block -ml-3.5" />
            TITAN PROTOCOL OS v2.6
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400 flex items-center gap-1">
            <Calendar className="h-3 w-3 text-titan-cyan" /> {dateStr}
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-emerald-400">
            {profile.isFreshStart ? 'INITIAL DAY 0 BASELINE' : 'SEASONED OPERATOR TRACE'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">LAST ACTIVE:</span>
            <span className="text-slate-300 font-bold">{profile.lastActiveDate || 'Today'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-white font-bold">{timeStr}</span>
            <span className="text-slate-500 text-[10px]">({utcStr})</span>
          </div>
        </div>
      </div>

      {/* Main Tactical Header */}
      <div className="px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Branding & Operator ID */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-titan-cyan/50 bg-titan-surface shadow-glow-cyan">
            <Shield className="h-6 w-6 text-titan-cyan" />
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-titan-card border border-purple-500 text-[9px] font-bold text-purple-300">
              {profile.level}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-wider text-white">
                TITAN <span className="text-titan-cyan text-glow-cyan">PROTOCOL</span>
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-titan-cardBorder bg-titan-surface text-titan-slate font-bold">
                ELITE PERCENTILE TRACKER
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>CALLSIGN: <strong className="text-white tracking-widest">{profile.callsign}</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">STATUS: <span className="text-emerald-400 font-bold">{profile.streakDays > 0 ? `${profile.streakDays}d Streak Active` : 'Day 0 Start'}</span></span>
            </div>
          </div>
        </div>

        {/* Center-Right: Level, XP, Streak, Decay Simulator & Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Daily Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-950/20 text-amber-300 shadow-sm">
            <Flame className={`h-4 w-4 ${profile.streakDays > 0 ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-slate-600'}`} />
            <div className="text-xs">
              <span className="font-bold text-sm text-amber-300">{profile.streakDays}</span>
              <span className="text-[10px] text-amber-400/80 ml-1">STREAK</span>
            </div>
          </div>

          {/* Level & XP Progress */}
          <div className="hidden lg:flex flex-col gap-1 px-3 py-1.5 rounded-lg border border-titan-cardBorder bg-titan-surface min-w-[130px]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-titan-cyan flex items-center gap-1 font-bold">
                <Zap className="h-3 w-3" /> LVL {profile.level}
              </span>
              <span className="text-slate-400 text-[10px]">{profile.xp.toLocaleString()} XP</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-titan-cyan to-titan-emerald h-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>

          {/* Decay & Punishment Simulator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-800/60 bg-rose-950/30 text-rose-300 hover:border-rose-500 text-xs font-mono font-bold transition-all"
              title="Test punishment protocol: simulate missed days and gain erasure"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
              <span className="hidden sm:inline">PUNISHMENT ENGINE</span>
            </button>

            {isSimulatorOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-rose-700 bg-titan-card/95 p-3.5 shadow-2xl backdrop-blur-xl z-50 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <span className="font-bold text-rose-300 flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" /> DECAY & PENALTY ENGINE
                  </span>
                  <button
                    onClick={() => setIsSimulatorOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mb-3 font-sans leading-relaxed">
                  Rule: <strong>1 Missed Day = 1 Previous Day's Gains Erased</strong>. Missing multiple days erases corresponding active work days.
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      simulateMissedDays(1);
                      setIsSimulatorOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-rose-950/60 border border-rose-800 hover:border-rose-500 text-rose-200 text-[11px] flex items-center justify-between"
                  >
                    <span>⚠️ Miss 1 Day (Erase 1d Gain)</span>
                    <span className="text-[10px] text-rose-400 font-bold">-1 Day</span>
                  </button>

                  <button
                    onClick={() => {
                      simulateMissedDays(2);
                      setIsSimulatorOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-rose-950/60 border border-rose-800 hover:border-rose-500 text-rose-200 text-[11px] flex items-center justify-between"
                  >
                    <span>⚠️ Miss 2 Days (Erase 2d Gains)</span>
                    <span className="text-[10px] text-rose-400 font-bold">-2 Days</span>
                  </button>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        resetAllData();
                        setIsSimulatorOpen(false);
                      }}
                      className="flex-1 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold text-center"
                    >
                      Fresh Start (Day 0)
                    </button>
                    <button
                      onClick={() => {
                        loadDemoMode();
                        setIsSimulatorOpen(false);
                      }}
                      className="flex-1 py-1.5 rounded bg-purple-950 border border-purple-700 hover:bg-purple-900 text-purple-200 text-[10px] font-bold text-center"
                    >
                      Load Demo 98.8%
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            title={profile.soundEnabled ? 'Audio Feedback: ON' : 'Audio Feedback: MUTED'}
            className={`p-2 rounded-lg border transition-all ${
              profile.soundEnabled
                ? 'border-titan-cyan/50 bg-titan-cyan/10 text-titan-cyan shadow-glow-cyan'
                : 'border-titan-cardBorder bg-titan-surface text-slate-500 hover:text-slate-300'
            }`}
          >
            {profile.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Real-Time Cloud Sync */}
          <button
            onClick={() => setIsSyncModalOpen(true)}
            title="Real-Time Cross-Device Cloud Sync (PC ⇄ Phone)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-semibold ${
              syncStatus === 'SYNCED'
                ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 shadow-glow-emerald'
                : 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400'
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5 animate-pulse" />
            <span className="hidden sm:inline">SYNC</span>
            {syncStatus === 'SYNCED' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 -ml-0.5" />}
          </button>

          {/* Data Backup */}
          <button
            onClick={() => setIsBackupOpen(true)}
            title="Export / Import JSON Data Backup"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-titan-cardBorder bg-titan-surface hover:border-titan-cyan/50 text-slate-300 hover:text-white transition-all text-xs font-semibold"
          >
            <Database className="h-3.5 w-3.5 text-titan-cyan" />
            <span className="hidden sm:inline">DATA</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Adjust Baselines & Weights"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-titan-cardBorder bg-titan-surface hover:border-titan-cyan/50 text-slate-300 hover:text-white transition-all text-xs font-semibold"
          >
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">CONFIG</span>
          </button>
        </div>
      </div>

      {/* Cockpit Navigation Tabs */}
      <nav className="flex overflow-x-auto border-t border-slate-800/80 px-4 sm:px-6 no-scrollbar bg-titan-surface/50">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-xs font-bold tracking-wider transition-all border-b-2 ${
                isActive
                  ? 'border-titan-cyan text-titan-cyan bg-titan-cyan/5 text-glow-cyan'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-titan-cyan' : 'text-slate-500'}`} />
              {item.label}
              {item.badge && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 border border-rose-500 text-rose-300 text-[9px] font-black">
                  {item.badge}
                </span>
              )}
              {item.id === 'curriculum' && composite.weakestMetric && (
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
