import React, { useState } from 'react';
import {
  TrendingUp,
  LineChart,
  Dumbbell,
  Compass,
  Settings,
  Shield,
  Activity,
  Database,
  ArrowRightLeft,
  Bell
} from 'lucide-react';
import { ProgressionChart } from './ProgressionChart';
import { BellCurveChart } from './BellCurveChart';
import { RadarMetricChart } from './RadarMetricChart';
import { PhysiqueHub } from '../hubs/PhysiqueHub';
import { FinanceHub } from '../hubs/FinanceHub';
import { CurriculumEngine } from '../recommendations/CurriculumEngine';
import { useTitan } from '../../context/TitanContext';

export const AnalyticsProfileView: React.FC = () => {
  const {
    profile,
    composite,
    setIsSettingsOpen,
    setIsBackupOpen,
    setIsSyncModalOpen
  } = useTitan();

  const [activeSubTab, setActiveSubTab] = useState<'CHARTS' | 'PHYSIQUE' | 'FINANCE' | 'CURRICULUM'>('CHARTS');

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('CHARTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'CHARTS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Bell Curves & Radar
          </button>
          <button
            onClick={() => setActiveSubTab('PHYSIQUE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'PHYSIQUE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💪 Physique Data
          </button>
          <button
            onClick={() => setActiveSubTab('FINANCE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'FINANCE'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📈 Wealth Logs
          </button>
          <button
            onClick={() => setActiveSubTab('CURRICULUM')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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

      {activeSubTab === 'PHYSIQUE' && <PhysiqueHub />}
      {activeSubTab === 'FINANCE' && <FinanceHub />}
      {activeSubTab === 'CURRICULUM' && <CurriculumEngine />}
    </div>
  );
};
