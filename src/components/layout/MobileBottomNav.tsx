import React from 'react';
import {
  Activity,
  Eye,
  CheckSquare,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

interface MobileTabItem {
  id: 'overview' | 'hologram' | 'clueless' | 'quests' | 'charts';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isSpecial?: boolean;
  badge?: string;
}

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, quests } = useTitan();

  const pendingQuestsCount = quests.filter(q => !q.completed).length;

  const tabs: MobileTabItem[] = [
    { id: 'overview', label: 'Today', icon: Activity },
    { id: 'hologram', label: 'Scanner', icon: Eye, isSpecial: true },
    { id: 'clueless', label: 'Clueless?', icon: HelpCircle },
    { id: 'quests', label: 'Trophies', icon: CheckSquare },
    { id: 'charts', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090d]/95 backdrop-blur-2xl border-t border-white/[0.08] px-6 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isSpecial) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative -top-3 flex flex-col items-center group"
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-gradient-to-tr from-rose-500 to-red-600 shadow-md scale-110'
                    : 'bg-zinc-800/90 border border-rose-500/30 text-rose-300'
                }`}>
                  <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-rose-400'}`} />
                </div>
                <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
                  isActive ? 'text-rose-400' : 'text-zinc-400'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center py-1 px-3 relative transition-all group"
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-rose-400' : 'text-zinc-400'
                }`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-1 tracking-tight ${
                isActive ? 'text-white font-bold' : 'text-zinc-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
