import React from 'react';
import { TitanProvider, useTitan } from './context/TitanContext';
import { HeaderHUD } from './components/layout/HeaderHUD';
import { DecayPenaltyBanner } from './components/layout/DecayPenaltyBanner';
import { OverviewDashboard } from './components/layout/OverviewDashboard';
import { ProgressionChart } from './components/charts/ProgressionChart';
import { BellCurveChart } from './components/charts/BellCurveChart';
import { RadarMetricChart } from './components/charts/RadarMetricChart';
import { PhysiqueHub } from './components/hubs/PhysiqueHub';
import { FinanceHub } from './components/hubs/FinanceHub';
import { AlarmHub } from './components/hubs/AlarmHub';
import { DailyQuests } from './components/quests/DailyQuests';
import { CurriculumEngine } from './components/recommendations/CurriculumEngine';
import { SettingsModal } from './components/modals/SettingsModal';
import { BackupModal } from './components/modals/BackupModal';
import { DeviceSyncModal } from './components/modals/DeviceSyncModal';
import { QuizModal } from './components/modals/QuizModal';
import { VictoryRewardModal } from './components/modals/VictoryRewardModal';
import { ActiveAlarmModal } from './components/modals/ActiveAlarmModal';
import { Terminal } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activeTab, isSyncModalOpen, setIsSyncModalOpen } = useTitan();

  return (
    <div className="min-h-screen flex flex-col justify-between cockpit-grid">
      <div>
        {/* Tactical Header HUD */}
        <HeaderHUD />

        {/* Missed Day Decay Punishment Alert Banner */}
        <DecayPenaltyBanner />

        {/* Dynamic Main Workspace */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
          {activeTab === 'overview' && <OverviewDashboard />}

          {activeTab === 'charts' && (
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

          {activeTab === 'physique' && <PhysiqueHub />}
          {activeTab === 'finance' && <FinanceHub />}
          {activeTab === 'alarms' && <AlarmHub />}
          {activeTab === 'quests' && <DailyQuests />}
          {activeTab === 'curriculum' && <CurriculumEngine />}
        </main>
      </div>

      {/* Tactical Footer & Normative Math Citations */}
      <footer className="border-t border-slate-800/80 bg-titan-surface/60 backdrop-blur-md py-6 mt-12 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal className="h-4 w-4 text-titan-cyan" />
            <span>TITAN PROTOCOL // HIGH-PERFORMANCE PERCENTILE TRACKER</span>
          </div>

          <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-4">
            <span>Φ(z) Error Function Gaussian Integration</span>
            <span>•</span>
            <span>Decay Punishment Code: 1 Missed Day = 1 Day Gain Erased</span>
            <span>•</span>
            <span>Real-Time Cross-Device Cloud Sync Active</span>
          </div>

          <div className="text-[11px] text-slate-400">
            PERSISTENCE: <span className="text-emerald-400">LOCAL + CLOUD SYNC ACTIVE</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <SettingsModal />
      <BackupModal />
      <DeviceSyncModal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} />
      <QuizModal />
      <VictoryRewardModal />
      <ActiveAlarmModal />
    </div>
  );
};

export default function App() {
  return (
    <TitanProvider>
      <DashboardContent />
    </TitanProvider>
  );
}
