import React, { useState } from 'react';
import {
  Award,
  Lock,
  CheckCircle2,
  Sparkles,
  Flame,
  Shield,
  Dumbbell,
  LineChart,
  Crown,
  ChevronRight
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { evaluateOperatorBadges } from '../../lib/badgeEngine';

export const OperatorBadgeWall: React.FC = () => {
  const { metrics, profile, composite, workoutLogs, financeLogs } = useTitan();
  const [filter, setFilter] = useState<'ALL' | 'PHYSIQUE' | 'FINANCE' | 'DISCIPLINE' | 'TITAN'>('ALL');

  const badges = evaluateOperatorBadges(metrics, profile, composite, workoutLogs, financeLogs);
  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  const filteredBadges = badges.filter(b => {
    if (filter === 'ALL') return true;
    return b.category === filter;
  });

  return (
    <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 sm:p-6 shadow-xl backdrop-blur-md font-mono space-y-5">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-600 text-purple-300 shadow-glow-purple">
            <Award className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-wider">
              OPERATOR IDENTITY BADGES & ACHIEVEMENTS
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              12 Real-World Milestones in Physiological Stamina, Wall Street Modeling & Relentless Discipline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg border border-purple-500/40 bg-purple-950/40 text-xs">
            <span className="text-slate-400">UNLOCKED: </span>
            <strong className="text-purple-300 text-sm font-bold">{unlockedCount} / {badges.length}</strong>
            <span className="text-slate-400 ml-1">({Math.round((unlockedCount / badges.length) * 100)}%)</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {(['ALL', 'PHYSIQUE', 'FINANCE', 'DISCIPLINE', 'TITAN'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${
              filter === tab
                ? 'border-purple-500 bg-purple-950/80 text-purple-200 shadow-glow-purple'
                : 'border-slate-800 bg-titan-card text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {tab === 'ALL' ? `ALL (${badges.length})` : tab}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBadges.map(badge => {
          const isUnlocked = badge.isUnlocked;

          return (
            <div
              key={badge.id}
              className={`rounded-2xl border p-4 transition-all relative overflow-hidden flex flex-col justify-between group ${
                isUnlocked
                  ? 'border-purple-500/60 bg-gradient-to-b from-purple-950/40 via-slate-900/80 to-titan-bg shadow-glow-purple'
                  : 'border-slate-800/80 bg-titan-card/50 opacity-80 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{badge.icon}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider ${
                        badge.rarity === 'LEGENDARY'
                          ? 'bg-amber-950/80 border border-amber-500 text-amber-300'
                          : badge.rarity === 'EPIC'
                          ? 'bg-purple-950/80 border border-purple-500 text-purple-300'
                          : 'bg-cyan-950/80 border border-cyan-700 text-cyan-300'
                      }`}
                    >
                      {badge.rarity}
                    </span>

                    {isUnlocked ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="p-1 rounded bg-slate-800 text-slate-500">
                        <Lock className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </div>

                <h4 className={`text-xs font-black mt-3 ${isUnlocked ? 'text-white' : 'text-slate-300'}`}>
                  {badge.title}
                </h4>

                <p className="text-[11px] text-slate-400 font-sans mt-1 leading-snug">
                  {badge.description}
                </p>

                <div className="mt-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[10px] text-slate-300">
                  <span className="text-slate-500 block text-[9px] font-bold">REQUIREMENT:</span>
                  <span className="font-bold text-cyan-300">{badge.requirement}</span>
                </div>
              </div>

              {/* Progress Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[10px] mb-1.5">
                  <span className="text-slate-400">
                    {isUnlocked ? 'COMPLETED' : `PROGRESS: ${badge.progressPercent}%`}
                  </span>
                  <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {badge.currentValDisplay} / {badge.targetValDisplay}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      isUnlocked
                        ? 'bg-emerald-400 shadow-glow-emerald'
                        : 'bg-purple-500'
                    }`}
                    style={{ width: `${badge.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
