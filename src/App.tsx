import React from 'react';
import { TitanProvider, useTitan } from './context/TitanContext';
import { NavigationSidebar } from './components/layout/NavigationSidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
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
import { NeuralHologramScanner } from './components/hologram/NeuralHologramScanner';
import { SettingsModal } from './components/modals/SettingsModal';
import { BackupModal } from './components/modals/BackupModal';
import { DeviceSyncModal } from './components/modals/DeviceSyncModal';
import { QuizModal } from './components/modals/QuizModal';
import { VictoryRewardModal } from './components/modals/VictoryRewardModal';
import { ActiveAlarmModal } from './components/modals/ActiveAlarmModal';
import { Shield } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activeTab, isSyncModalOpen, setIsSyncModalOpen } = useTitan();

  return (
    <div className="min-h-screen flex bg-[#04060a] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Left Desktop Sidebar (X / Linear Style) */}
      <NavigationSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sleek Top Navigation Bar */}
        <HeaderHUD />

        {/* Missed Day Penalty Alert Banner */}
        <DecayPenaltyBanner />

        {/* Dynamic Viewport Canvas */}
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 w-full space-y-6">
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
          {activeTab === 'hologram' && <NeuralHologramScanner />}
          {activeTab === 'finance' && <FinanceHub />}
          {activeTab === 'alarms' && <AlarmHub />}
          {activeTab === 'quests' && <DailyQuests />}
          {activeTab === 'curriculum' && <CurriculumEngine />}
        </main>

        {/* Minimalist Modern Footer */}
        <footer className="border-t border-white/[0.06] bg-[#05070d]/60 backdrop-blur-md py-6 px-6 text-xs text-slate-500">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span>TITAN PROTOCOL • 99.9% PERCENTILE ENGINE</span>
            </div>

            <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
              <span>Φ(z) Gaussian Normal Integration</span>
              <span>•</span>
              <span>100% Client Persistence</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Real-Time Sync Active</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation (Instagram Style) */}
      <MobileBottomNav />

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
