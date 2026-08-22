import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Flame,
  Award,
  Zap,
  Plus,
  Shield,
  Dumbbell,
  LineChart,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { MetricKey } from '../../types/titan';
import { OperatorBadgeWall } from '../achievements/OperatorBadgeWall';

export const DailyQuests: React.FC = () => {
  const { quests, toggleQuest, profile, gainXP } = useTitan();
  const [filter, setFilter] = useState<'ALL' | 'PHYSIQUE' | 'FINANCE' | 'PENDING'>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New quest inputs
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'PHYSIQUE' | 'FINANCE'>('PHYSIQUE');
  const [newXp, setNewXp] = useState(300);

  const completedCount = quests.filter(q => q.completed).length;
  const totalCount = quests.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredQuests = quests.filter(q => {
    if (filter === 'PHYSIQUE') return q.category === 'PHYSIQUE';
    if (filter === 'FINANCE') return q.category === 'FINANCE';
    if (filter === 'PENDING') return !q.completed;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-950/70 border border-amber-800/40 text-amber-400">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wider">
                  TACTICAL DAILY QUEST PROTOCOL
                </h2>
                <p className="text-xs text-slate-400">
                  Disciplined daily execution protocol to compound physiological & financial percentiles.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-950/30 font-mono text-xs">
              <span className="text-slate-400">STATUS: </span>
              <strong className="text-amber-400 text-sm">{completedCount}/{totalCount} COMPLETED</strong>
              <span className="text-slate-500 ml-1">({completionRate}%)</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 via-emerald-400 to-titan-cyan h-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center rounded-lg border border-slate-800 bg-titan-surface p-1">
          {(['ALL', 'PHYSIQUE', 'FINANCE', 'PENDING'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded transition-all ${
                filter === f
                  ? 'bg-amber-500 text-black font-bold shadow-glow-amber'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1 text-amber-400">
            <Flame className="h-4 w-4 fill-amber-400" /> {profile.streakDays}-Day Active Streak
          </span>
        </div>
      </div>

      {/* Quest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuests.map(quest => {
          const isPhysique = quest.category === 'PHYSIQUE';
          const isTitanTier = quest.difficulty === 'TITAN';

          return (
            <div
              key={quest.id}
              onClick={() => toggleQuest(quest.id)}
              className={`cursor-pointer rounded-xl border p-4 transition-all relative overflow-hidden group ${
                quest.completed
                  ? 'border-emerald-500/40 bg-emerald-950/10 opacity-75'
                  : isTitanTier
                  ? 'border-purple-500/50 bg-titan-card/80 hover:border-purple-400 shadow-glow-purple'
                  : 'border-titan-cardBorder bg-titan-card/60 hover:border-titan-cyan/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {quest.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-950" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-600 group-hover:text-titan-cyan transition-colors" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          isPhysique
                            ? 'bg-cyan-950/60 border border-cyan-800 text-cyan-300'
                            : 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                        }`}
                      >
                        {quest.category}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          isTitanTier
                            ? 'bg-purple-950 border border-purple-600 text-purple-300'
                            : 'text-slate-500 border border-slate-800'
                        }`}
                      >
                        {quest.difficulty}
                      </span>
                    </div>

                    <h3
                      className={`text-sm font-bold mt-2 ${
                        quest.completed
                          ? 'line-through text-slate-500'
                          : 'text-white group-hover:text-titan-cyan transition-colors'
                      }`}
                    >
                      {quest.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {quest.description}
                    </p>

                    {quest.completedAt && (
                      <span className="text-[10px] text-emerald-400/80 font-mono mt-2 block">
                        ✓ Completed {quest.completedAt}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 font-mono">
                  <span className="px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-950/40 text-amber-300 text-xs font-bold flex items-center gap-1">
                    <Zap className="h-3 w-3" /> +{quest.xpReward} XP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collectible 3D Holographic Badges Section */}
      <OperatorBadgeWall />
    </div>
  );
};
