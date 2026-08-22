import React, { useState } from 'react';
import {
  TrendingUp,
  LineChart,
  Dumbbell,
  Compass,
  Settings,
  Shield,
  Activity,
  AlarmClock,
  Database,
  ArrowRightLeft,
  Bell
} from 'lucide-react';
import { ProgressionChart } from './ProgressionChart';
import { BellCurveChart } from './BellCurveChart';
import { RadarMetricChart } from './RadarMetricChart';
import { PhysiqueHub } from '../hubs/PhysiqueHub';
import { FinanceHub } from '../hubs/FinanceHub';
import { AlarmHub } from '../hubs/AlarmHub';
import { CurriculumEngine } from '../recommendations/CurriculumEngine';
import { useTitan } from '../../context/TitanContext';

export const AnalyticsProfileView: React.FC = () => {
  const {
    profile,
    composite,
    alarms,
    setIsSettingsOpen,
    setIsBackupOpen,
    setIsSyncModalOpen
  } = useTitan();

  const [activeSubTab, setActiveSubTab] = useState<'CHARTS' | 'ALARMS' | 'PHYSIQUE' | 'FINANCE' | 'CURRICULUM'>('CHARTS');
  const activeAlarmsCount = alarms.filter(a => a.isEnabled).length;

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveSubTab('CHARTS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'CHARTS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Bell Curves & Radar
          </button>
          <button
            onClick={() => setActiveSubTab('ALARMS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'ALARMS'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlarmClock className="h-3.5 w-3.5 text-rose-400" />
            <span>Tactical Alarms</span>
            {activeAlarmsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-black text-[9px] font-bold">
                {activeAlarmsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('PHYSIQUE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'PHYSIQUE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💪 Physique Data
          </button>
          <button
            onClick={() => setActiveSubTab('FINANCE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'FINANCE'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📈 Wealth Logs
          </button>
          <button
            onClick={() => setActiveSubTab('CURRICULUM')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'CURRICULUM'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎓 Curriculum
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <Settings className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Viewport Content */}
      {activeSubTab === 'CHARTS' && (
        <div className="space-y-6">
          <ProgressionChart />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <BellCurveChart />
            </div>
            <div className="lg:col-span-5">
              <RadarMetricChart />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'ALARMS' && <AlarmHub />}
      {activeSubTab === 'PHYSIQUE' && <PhysiqueHub />}
      {activeSubTab === 'FINANCE' && <FinanceHub />}
      {activeSubTab === 'CURRICULUM' && <CurriculumEngine />}
    </div>
  );
};
