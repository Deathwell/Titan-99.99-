import React from 'react';
import {
  Activity,
  Eye,
  CheckSquare,
  TrendingUp
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

interface MobileTabItem {
  id: 'overview' | 'hologram' | 'quests' | 'charts';
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
    { id: 'quests', label: 'Quests', icon: CheckSquare, badge: pendingQuestsCount > 0 ? `${pendingQuestsCount}` : undefined },
    { id: 'charts', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060810]/95 backdrop-blur-2xl border-t border-white/[0.08] px-6 py-2">
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
                    ? 'bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-glow-cyan scale-110'
                    : 'bg-slate-800/90 border border-cyan-500/40 text-cyan-300'
                }`}>
                  <Icon className={`h-6 w-6 ${isActive ? 'text-black' : 'text-cyan-400'}`} />
                </div>
                <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
                  isActive ? 'text-cyan-400' : 'text-slate-400'
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
                  isActive ? 'text-cyan-400' : 'text-slate-400'
                }`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-cyan-500 text-black text-[9px] font-bold flex items-center justify-center font-mono">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-1 tracking-tight ${
                isActive ? 'text-white font-bold' : 'text-slate-400'
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
