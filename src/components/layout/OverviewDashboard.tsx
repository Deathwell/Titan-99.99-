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
  Compass,
  TrendingUp,
  Activity,
  Flame,
  Award
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

export const OverviewDashboard: React.FC = () => {
  const { quests, toggleQuest, setActiveTab } = useTitan();

  const pendingQuests = quests.filter(q => !q.completed).slice(0, 3);

  return (
    <div className="space-y-8 font-mono">
      {/* 1. Loss Aversion Threat Clock Ticker */}
      <ThreatClockBanner />

      {/* 2. Grand Glowing Dopamine Core, Rank Hero & Humans Defeated Planetary Scale */}
      <DopamineHero />

      {/* 3. Today's 1-Tap Daily Accomplishments & Nightly Reward Unlocker */}
      <DailyDopamineHub />

      {/* 4. Unlockable Operator Identity Badges & Achievement Wall */}
      <OperatorBadgeWall />

      {/* 5. Real-Time Analytics & Empirical Distributions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Historical Progression & Live Bell Curve */}
        <div className="lg:col-span-8 space-y-6">
          <ProgressionChart />
          <BellCurveChart />
        </div>

        {/* Right Column: Multi-Axial Radar Matrix & Tactical Quest Protocol */}
        <div className="lg:col-span-4 space-y-6">
          <RadarMetricChart />

          {/* Quick Active Quests Pod */}
          <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-amber-400" /> DAILY MISSIONS PROTOCOL
              </h3>
              <button
                onClick={() => setActiveTab('quests')}
                className="text-[11px] text-titan-cyan hover:underline font-mono flex items-center gap-0.5"
              >
                All Quests <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {pendingQuests.length > 0 ? (
                pendingQuests.map(q => (
                  <div
                    key={q.id}
                    onClick={() => toggleQuest(q.id)}
                    className="p-3 rounded-lg border border-slate-800 bg-titan-card/60 hover:border-titan-cyan/40 cursor-pointer transition-all flex items-start gap-2.5 group"
                  >
                    <Square className="h-4 w-4 text-slate-500 group-hover:text-titan-cyan mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <div className="font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors">{q.title}</div>
                      <div className="text-[10px] text-amber-400 font-mono mt-1 flex items-center gap-1">
                        <Zap className="h-3 w-3" /> +{q.xpReward} XP
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-emerald-400 font-mono flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> ALL DAILY MISSIONS EXECUTED!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
