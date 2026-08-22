import React, { useState } from 'react';
import {
  TrendingUp,
  LineChart,
  Compass,
  Settings,
  Shield,
  Activity,
  AlarmClock,
  Database,
  ArrowRightLeft,
  GraduationCap
} from 'lucide-react';
import { ProgressionChart } from './ProgressionChart';
import { BellCurveChart } from './BellCurveChart';
import { RadarMetricChart } from './RadarMetricChart';
import { AlarmHub } from '../hubs/AlarmHub';
import { CurriculumEngine } from '../recommendations/CurriculumEngine';
import { BlackMarkDossier } from '../achievements/BlackMarkDossier';
import { useTitan } from '../../context/TitanContext';

export const AnalyticsProfileView: React.FC = () => {
  const {
    profile,
    composite,
    alarms,
    analyticsSubTab,
    setAnalyticsSubTab,
    setIsSettingsOpen,
    setIsBackupOpen,
    setIsSyncModalOpen
  } = useTitan();

  const activeAlarmsCount = alarms.filter(a => a.isEnabled).length;
  const activeBlackMarksCount = (profile.blackMarks || []).filter(m => m.status === 'ACTIVE_INFRACTION').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Sub-Navigation Pills (Clean & Zero Duplication) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-1.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setAnalyticsSubTab('CHARTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              analyticsSubTab === 'CHARTS'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📊 Bell Curves & Percentile Analytics
          </button>
          
          <button
            onClick={() => setAnalyticsSubTab('ALARMS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              analyticsSubTab === 'ALARMS'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <AlarmClock className="h-3.5 w-3.5 text-rose-400" />
            <span>Tactical Alarms</span>
            {activeAlarmsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-black text-[9px] font-mono font-bold">
                {activeAlarmsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAnalyticsSubTab('DOSSIER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              analyticsSubTab === 'DOSSIER'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>⚔️ Discipline Dossier</span>
            {activeBlackMarksCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold animate-pulse">
                {activeBlackMarksCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAnalyticsSubTab('CURRICULUM')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              analyticsSubTab === 'CURRICULUM'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <GraduationCap className="h-4 w-4 text-purple-400" />
            <span>Curriculum & Knowledge</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/10"
          >
            <Settings className="h-4 w-4 text-rose-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Viewport Content */}
      {analyticsSubTab === 'CHARTS' && (
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

      {analyticsSubTab === 'ALARMS' && <AlarmHub />}
      {analyticsSubTab === 'DOSSIER' && <BlackMarkDossier />}
      {analyticsSubTab === 'CURRICULUM' && <CurriculumEngine />}
    </div>
  );
};
