import React from 'react';
import { TitanProvider, useTitan } from './context/TitanContext';
import { NavigationSidebar } from './components/layout/NavigationSidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { HeaderHUD } from './components/layout/HeaderHUD';
import { OverviewDashboard } from './components/layout/OverviewDashboard';
import { NeuralHologramScanner } from './components/hologram/NeuralHologramScanner';
import { DailyQuests } from './components/quests/DailyQuests';
import { AnalyticsProfileView } from './components/charts/AnalyticsProfileView';
import { SettingsModal } from './components/modals/SettingsModal';
import { BackupModal } from './components/modals/BackupModal';
import { DeviceSyncModal } from './components/modals/DeviceSyncModal';
import { QuizModal } from './components/modals/QuizModal';
import { VictoryRewardModal } from './components/modals/VictoryRewardModal';
import { ActiveAlarmModal } from './components/modals/ActiveAlarmModal';
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { MobilePushSetupModal } from './components/modals/MobilePushSetupModal';
import { ConfettiCanvas } from './components/effects/ConfettiCanvas';
import { WelcomeOnboardingModal } from './components/onboarding/WelcomeOnboardingModal';
import { DecayPenaltyBanner } from './components/layout/DecayPenaltyBanner';
import { Shield } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const {
    activeTab,
    isSyncModalOpen,
    setIsSyncModalOpen,
    isMobilePushSetupOpen,
    setIsMobilePushSetupOpen,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen
  } = useTitan();

  return (
    <div className="min-h-screen flex bg-[#04060a] text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* 30-Second First-Time Onboarding for New Users */}
      <WelcomeOnboardingModal />

      {/* Global Particle Confetti Overlay */}
      <ConfettiCanvas />

      {/* Left Desktop Sidebar (Clean X / Linear Style) */}
      <NavigationSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sleek Top Navigation Bar */}
        <HeaderHUD />

        {/* Dynamic Inactivity Punishment Banner (If Triggered) */}
        <DecayPenaltyBanner />

        {/* 4 Clean Primary Tab Canvases */}
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 w-full">
          {activeTab === 'overview' && <OverviewDashboard />}
          {activeTab === 'hologram' && <NeuralHologramScanner />}
          {activeTab === 'quests' && <DailyQuests />}
          {activeTab === 'charts' && <AnalyticsProfileView />}
        </main>

        {/* Minimalist Modern Footer */}
        <footer className="border-t border-white/[0.06] bg-[#05070d]/60 backdrop-blur-md py-6 px-6 text-xs text-slate-500">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <Shield className="h-4 w-4 text-rose-400" />
              <span>TITAN PROTOCOL • 99.9% PERCENTILE ENGINE</span>
            </div>

            <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
              <span>Zero-Friction Daily Habit Tracking</span>
              <span>•</span>
              <span>100% Private Client Storage</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation (Instagram Style) */}
      <MobileBottomNav />

      {/* Global Modals */}
      <CommandPaletteModal isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      <SettingsModal />
      <BackupModal />
      <DeviceSyncModal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} />
      <MobilePushSetupModal isOpen={isMobilePushSetupOpen} onClose={() => setIsMobilePushSetupOpen(false)} />
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
