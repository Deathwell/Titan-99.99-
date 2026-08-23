import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Flame,
  Award,
  Zap,
  Shield,
  Dumbbell,
  LineChart,
  CheckCircle2,
  Calendar,
  Sparkles,
  Gift,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { OperatorBadgeWall } from '../achievements/OperatorBadgeWall';
import { soundEngine } from '../../lib/audio';

export const DailyQuests: React.FC = () => {
  const {
    quests,
    toggleQuest,
    profile,
    workoutLogs,
    financeLogs,
    setActiveTab,
    openVictoryModal,
    todayRewardClaim
  } = useTitan();

  const [filter, setFilter] = useState<'ALL' | 'PHYSIQUE' | 'FINANCE' | 'PENDING'>('ALL');

  // Compute live duration from today's real logs on the Today page
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkout = workoutLogs.find(w => w.timestamp.startsWith(todayStr));
  const todayFinance = financeLogs.find(f => f.timestamp.startsWith(todayStr));

  const workoutMinutes = todayWorkout?.durationMinutes || 0;
  const financeMinutes = todayFinance?.durationMinutes || 0;

  // Auto-sync status: Quests automatically reflect slider values!
  const isPhysiqueSatisfied = workoutMinutes > 0;
  const isFinanceSatisfied = financeMinutes > 0;

  const isQuestDone = (questId: string, category: 'PHYSIQUE' | 'FINANCE' | 'SYSTEM', baseCompleted: boolean) => {
    if (category === 'PHYSIQUE') return isPhysiqueSatisfied || baseCompleted;
    if (category === 'FINANCE') return isFinanceSatisfied || baseCompleted;
    return baseCompleted;
  };

  const completedCount = quests.filter(q => isQuestDone(q.id, q.category, q.completed)).length;
  const totalCount = quests.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allCompleted = isPhysiqueSatisfied && isFinanceSatisfied;

  const filteredQuests = quests.filter(q => {
    const done = isQuestDone(q.id, q.category, q.completed);
    if (filter === 'PHYSIQUE') return q.category === 'PHYSIQUE';
    if (filter === 'FINANCE') return q.category === 'FINANCE';
    if (filter === 'PENDING') return !done;
    return true;
  });

  const handleQuestCardClick = (quest: any) => {
    // Take operator directly to the unified slider on the Today page
    setActiveTab('overview');
    soundEngine.playClick(800);
  };

  return (
    <div className="space-y-6 select-none font-sans">
      {/* 1. Header Banner */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d14]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-sm">
              <CheckSquare className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
                  UNIFIED SINGLE-INPUT ENGINE
                </span>
                <span className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1">
                  <Sliders className="h-3 w-3 text-cyan-400" />
                  SYNCED WITH TODAY SLIDERS
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                Tactical Daily Quest Protocol
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-950/30 font-mono text-xs">
              <span className="text-zinc-400">STATUS: </span>
              <strong className="text-amber-400 text-sm font-bold">{completedCount}/{totalCount} SATISFIED</strong>
              <span className="text-zinc-500 ml-1">({completionRate}%)</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/[0.05] h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 h-full transition-all duration-500 shadow-sm"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        {/* Unified Sync Info Callout */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-sans text-zinc-300">
          <span className="flex items-center gap-2">
            <span className="text-cyan-400 font-mono font-bold">⚡ Zero Double-Logging:</span>
            <span>Dragging the sliders on the Today page automatically completes these daily quests!</span>
          </span>
          <button
            onClick={() => setActiveTab('overview')}
            className="text-cyan-400 hover:text-cyan-300 font-mono font-bold text-[11px] flex items-center gap-1 shrink-0 ml-2"
          >
            <span>Open Today Sliders</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 2. Victorious 100% Protocol Reward Unlocked Banner */}
      {allCompleted && (
        <div className="rounded-2xl border-2 border-purple-500/70 bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-purple-950/90 p-5 shadow-[0_0_30px_rgba(168,85,247,0.3)] backdrop-blur-xl animate-in fade-in flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-900/80 border border-purple-400 text-2xl shadow-lg">
              {todayRewardClaim ? todayRewardClaim.icon : '🏆'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-900 text-purple-200 text-[10px] font-mono font-bold tracking-wider border border-purple-400">
                  100% DAILY PROTOCOL CONQUEST
                </span>
                <span className="text-emerald-300 text-xs font-bold flex items-center gap-1 font-mono">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin" /> GUILT-FREE REWARD READY
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-1">
                {todayRewardClaim
                  ? `TONIGHT'S REWARD: ${todayRewardClaim.icon} ${todayRewardClaim.title.toUpperCase()}`
                  : 'ALL MISSIONS COMPLETE! CLAIM YOUR NIGHTLY REWARD'}
              </h3>
              <p className="text-xs text-purple-200 mt-0.5">
                {todayRewardClaim
                  ? 'Guilt-free indulgence active for tonight. Relax with zero anxiety!'
                  : 'You dominated your daily protocol. What do you feel like indulging in tonight?'}
              </p>
            </div>
          </div>

          <button
            onClick={openVictoryModal}
            className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs shadow-glow-purple flex items-center gap-2 transition-all transform active:scale-95 whitespace-nowrap"
          >
            <Gift className="h-4 w-4" />
            <span>{todayRewardClaim ? 'Change Reward' : 'Claim Nightly Reward (+150 XP)'}</span>
          </button>
        </div>
      )}

      {/* 3. Filter Tabs & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center rounded-xl border border-white/[0.08] bg-black/40 p-1">
          {(['ALL', 'PHYSIQUE', 'FINANCE', 'PENDING'] as const).map(f => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                soundEngine.playClick(750);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all font-bold ${
                filter === f
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Flame className="h-4 w-4 fill-amber-400" /> {profile.streakDays}-Day Active Streak
          </span>
        </div>
      </div>

      {/* 4. Quest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredQuests.map(quest => {
          const isPhysique = quest.category === 'PHYSIQUE';
          const isDone = isQuestDone(quest.id, quest.category, quest.completed);
          const loggedMins = isPhysique ? workoutMinutes : financeMinutes;

          return (
            <div
              key={quest.id}
              onClick={() => handleQuestCardClick(quest)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all relative overflow-hidden group ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-white/[0.08] bg-[#0c0d14]/70 hover:border-amber-500/40 hover:bg-[#0c0d14]/90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-950" />
                    ) : (
                      <Square className="h-5 w-5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                          isPhysique
                            ? 'bg-rose-950/60 border border-rose-800 text-rose-300'
                            : 'bg-amber-950/60 border border-amber-800 text-amber-300'
                        }`}
                      >
                        {quest.category}
                      </span>

                      <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono text-zinc-400 border border-white/[0.08]">
                        {quest.difficulty}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-white mt-1.5">
                      {quest.title}
                    </h3>

                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      {quest.description}
                    </p>

                    {isDone ? (
                      <span className="text-[10px] text-emerald-400 font-mono mt-2 block font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Completed via Today Slider ({loggedMins}m logged)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500 font-mono mt-2 block group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                        <span>Click to log minutes on Today page</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 font-mono">
                  <span className="px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-950/40 text-amber-300 text-[11px] font-bold flex items-center gap-1">
                    <Zap className="h-3 w-3" /> +{quest.xpReward} XP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Collectible 3D Holographic Badges Section */}
      <OperatorBadgeWall />
    </div>
  );
};
