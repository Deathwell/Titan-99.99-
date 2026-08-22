import React from 'react';
import { ThreatClockBanner } from './ThreatClockBanner';
import { DopamineHero } from './DopamineHero';
import { DailyDopamineHub } from '../action/DailyDopamineHub';
import { OperatorBadgeWall } from '../achievements/OperatorBadgeWall';
import { ProgressionChart } from '../charts/ProgressionChart';
import { BellCurveChart } from '../charts/BellCurveChart';
import { RadarMetricChart } from '../charts/RadarMetricChart';
import {
  CheckSquare,
  Square,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { triggerGlobalConfetti } from '../effects/ConfettiCanvas';
import { soundEngine } from '../../lib/audio';

export const OverviewDashboard: React.FC = () => {
  const { quests, toggleQuest, setActiveTab } = useTitan();

  const pendingQuests = quests.filter(q => !q.completed).slice(0, 3);

  const handleQuestToggle = (e: React.MouseEvent, id: string, wasCompleted: boolean) => {
    if (!wasCompleted) {
      triggerGlobalConfetti(e.clientX, e.clientY);
      soundEngine.playQuestComplete();
    }
    toggleQuest(id);
  };

  return (
    <div className="space-y-6">
      {/* 1. Loss Aversion Threat Clock Ticker */}
      <ThreatClockBanner />

      {/* 2. Grand Glowing Dopamine Core & Rank Hero */}
      <DopamineHero />

      {/* 3. Today's 1-Tap Daily Accomplishments & Nightly Rewards */}
      <DailyDopamineHub />

      {/* 4. Collectible Identity Badges & Achievement Wall */}
      <OperatorBadgeWall />

      {/* 5. Real-Time Analytics & Empirical Distributions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Historical Progression & Live Bell Curve */}
        <div className="lg:col-span-8 space-y-6">
          <ProgressionChart />
          <BellCurveChart />
        </div>

        {/* Right Column: Multi-Axial Radar Matrix & Daily Quests Feed */}
        <div className="lg:col-span-4 space-y-6">
          <RadarMetricChart />

          {/* Quick Active Quests Pod */}
          <div className="social-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-amber-400" /> DAILY MISSIONS FEED
              </h3>
              <button
                onClick={() => setActiveTab('quests')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingQuests.length > 0 ? (
                pendingQuests.map(q => (
                  <div
                    key={q.id}
                    onClick={(e) => handleQuestToggle(e, q.id, q.completed)}
                    className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-cyan-500/40 cursor-pointer transition-all flex items-start gap-3 group active:scale-[0.98]"
                  >
                    <Square className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 mt-0.5 shrink-0 transition-colors" />
                    <div className="text-xs flex-1">
                      <div className="font-semibold text-white leading-tight group-hover:text-cyan-300 transition-colors">
                        {q.title}
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono mt-1 flex items-center gap-1">
                        <Zap className="h-3 w-3" /> +{q.xpReward} XP
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-emerald-400 font-mono flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 animate-bounce" />
                  <span className="font-bold">ALL DAILY MISSIONS COMPLETED!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
