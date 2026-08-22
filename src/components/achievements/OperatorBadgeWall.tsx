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
import { triggerGlobalConfetti } from '../effects/ConfettiCanvas';
import { soundEngine } from '../../lib/audio';

export const OperatorBadgeWall: React.FC = () => {
  const { metrics, profile, composite, workoutLogs, financeLogs } = useTitan();
  const [filter, setFilter] = useState<'ALL' | 'PHYSIQUE' | 'FINANCE' | 'DISCIPLINE' | 'TITAN'>('ALL');

  const badges = evaluateOperatorBadges(metrics, profile, composite, workoutLogs, financeLogs);
  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  const filteredBadges = badges.filter(b => {
    if (filter === 'ALL') return true;
    return b.category === filter;
  });

  const handleBadgeClick = (e: React.MouseEvent, isUnlocked: boolean) => {
    if (isUnlocked) {
      triggerGlobalConfetti(e.clientX, e.clientY);
      soundEngine.playMilestoneFanfare();
    } else {
      soundEngine.playClick(600);
    }
  };

  return (
    <div className="social-card p-5 sm:p-7 space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-glow-purple">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                COLLECTIBLE IDENTITY BADGES
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-bold font-mono">
                {unlockedCount}/{badges.length} UNLOCKED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Physical stamina, Wall Street modeling & relentless discipline milestones.
            </p>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs">
          {(['ALL', 'PHYSIQUE', 'FINANCE', 'DISCIPLINE', 'TITAN'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all text-xs font-semibold ${
                filter === tab
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'ALL' ? `All (${badges.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Holographic Foil Badge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBadges.map(badge => {
          const isUnlocked = badge.isUnlocked;

          return (
            <div
              key={badge.id}
              onClick={(e) => handleBadgeClick(e, isUnlocked)}
              className={`group relative rounded-2xl border p-4 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between select-none ${
                isUnlocked
                  ? 'bg-gradient-to-b from-purple-950/30 via-slate-900/60 to-black/80 border-purple-500/40 hover:border-purple-400 hover:scale-[1.03] shadow-glow-purple'
                  : 'bg-white/[0.02] border-white/[0.05] opacity-60 hover:opacity-85 hover:border-white/[0.12] hover:scale-[1.01]'
              }`}
            >
              {/* Holographic Rainbow Sheen */}
              {isUnlocked && (
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500" />
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl transition-transform group-hover:scale-125 duration-300">
                    {badge.icon}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                      badge.rarity === 'LEGENDARY'
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                        : badge.rarity === 'EPIC'
                        ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                        : 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                    }`}
                  >
                    {badge.rarity}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    {badge.title}
                    {isUnlocked && <Sparkles className="h-3 w-3 text-purple-400 shrink-0" />}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Unlock Condition / Status Bar */}
              <div className="mt-4 pt-3 border-t border-white/[0.06]">
                {isUnlocked ? (
                  <div className="flex items-center justify-between text-[11px] text-purple-300 font-semibold font-mono">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> UNLOCKED
                    </span>
                    <span>{badge.currentValDisplay}</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Requirement
                      </span>
                      <span>{badge.targetValDisplay}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block truncate">
                      {badge.requirement}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
