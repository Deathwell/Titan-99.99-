import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  Flame,
  Sparkles,
  RotateCcw,
  BookOpen,
  HelpCircle,
  TrendingUp,
  X,
  Trophy,
  Gift
} from 'lucide-react';
import { useTitan, DailyAccomplishmentType } from '../../context/TitanContext';
import { SYLLABUS_TOPICS } from '../../lib/defaultData';

interface DopamineToast {
  id: string;
  text: string;
  subtext: string;
  isUndo?: boolean;
}

export const DailyDopamineHub: React.FC = () => {
  const {
    toggleDailyAccomplishment,
    setActiveQuizTopic,
    openVictoryModal,
    todayRewardClaim,
    workoutLogs,
    financeLogs
  } = useTitan();

  const [toasts, setToasts] = useState<DopamineToast[]>([]);

  // Check what was recorded today
  const todayStr = new Date().toISOString().split('T')[0];
  const completedTodayWorkouts = workoutLogs.filter(w => w.timestamp.startsWith(todayStr));
  const completedTodayFinance = financeLogs.filter(f => f.timestamp.startsWith(todayStr));

  const hasDoneEndurance = completedTodayWorkouts.some(w => w.pillar === 'ENDURANCE');
  const hasDoneStrength = completedTodayWorkouts.some(w => w.pillar === 'STRENGTH');
  const hasDoneModeling = completedTodayFinance.some(f => f.discipline === 'PRIVATE_EQUITY' || f.discipline === 'INVESTMENT_BANKING');
  const hasDoneQuant = completedTodayFinance.some(f => f.discipline === 'QUANT_DERIVATIVES' || f.discipline === 'FACTOR_RISK');

  const completedCount = (hasDoneEndurance ? 1 : 0) + (hasDoneStrength ? 1 : 0) + (hasDoneModeling ? 1 : 0) + (hasDoneQuant ? 1 : 0);
  const allCompleted = completedCount === 4;

  const triggerToast = (text: string, subtext: string, isUndo = false) => {
    const newToast: DopamineToast = {
      id: `toast-${Date.now()}`,
      text,
      subtext,
      isUndo
    };
    setToasts(prev => [newToast, ...prev.slice(0, 2)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3200);
  };

  const handleToggle = (type: DailyAccomplishmentType) => {
    const isRecorded = toggleDailyAccomplishment(type);

    if (type === 'ENDURANCE') {
      if (isRecorded) {
        triggerToast('⚡ 1-HOUR ENDURANCE RECORDED!', 'Locked today’s session (+0.4% VO2 / +350 XP)');
      } else {
        triggerToast('↺ Endurance Session Unrecorded', 'Reverted today’s endurance gain & XP', true);
      }
    } else if (type === 'STRENGTH') {
      if (isRecorded) {
        triggerToast('⚡ 1-HOUR STRENGTH RECORDED!', 'Locked today’s session (+Power Ratio / +350 XP)');
      } else {
        triggerToast('↺ Strength Session Unrecorded', 'Reverted today’s strength gain & XP', true);
      }
    } else if (type === 'MODELING') {
      if (isRecorded) {
        triggerToast('⚡ 1-HOUR FINANCE MODELING RECORDED!', 'Locked today’s drill (+2 pts / +350 XP)');
      } else {
        triggerToast('↺ Finance Modeling Unrecorded', 'Reverted today’s score gain & XP', true);
      }
    } else if (type === 'QUANT') {
      if (isRecorded) {
        triggerToast('⚡ 1-HOUR QUANT DERIVATIVES RECORDED!', 'Locked today’s drill (+2 pts / +350 XP)');
      } else {
        triggerToast('↺ Quant Derivatives Unrecorded', 'Reverted today’s score gain & XP', true);
      }
    }
  };

  return (
    <div className="space-y-4 font-mono relative">
      {/* Floating Dopamine Toast Notifications */}
      <div className="fixed top-20 right-6 z-50 space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`rounded-xl border p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-300 text-xs flex items-center gap-3 pointer-events-auto ${
              toast.isUndo
                ? 'border-rose-500/80 bg-slate-950/95 text-rose-200 shadow-glow-amber'
                : 'border-emerald-400 bg-slate-950/95 text-emerald-300 shadow-glow-emerald'
            }`}
          >
            <div className={`p-2 rounded-lg ${toast.isUndo ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {toast.isUndo ? <RotateCcw className="h-4 w-4" /> : <Sparkles className="h-4 w-4 animate-spin" />}
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">{toast.text}</div>
              <div className="text-slate-300 text-xs font-sans mt-0.5">{toast.subtext}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Victorious 100% Protocol Reward Unlocked Banner */}
      {allCompleted && (
        <div className="rounded-2xl border border-purple-500/80 bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-purple-950/90 p-5 shadow-glow-purple backdrop-blur-xl animate-in fade-in flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-900/80 border border-purple-400 text-2xl shadow-lg">
              {todayRewardClaim ? todayRewardClaim.icon : '🏆'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-900 text-purple-200 text-[10px] font-black tracking-wider border border-purple-400">
                  100% DAILY CONQUEST
                </span>
                <span className="text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> REWARD UNLOCKED
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-1">
                {todayRewardClaim
                  ? `TONIGHT'S REWARD: ${todayRewardClaim.icon} ${todayRewardClaim.title.toUpperCase()}`
                  : 'ALL 4 MISSIONS COMPLETE! CLAIM YOUR NIGHTLY REWARD'}
              </h3>
              <p className="text-xs text-purple-200 font-sans mt-0.5">
                {todayRewardClaim
                  ? 'Guilt-free indulgence active for tonight. Relax with zero procrastination anxiety!'
                  : 'You dominated your daily protocol. What do you feel like indulging in tonight?'}
              </p>
            </div>
          </div>

          <button
            onClick={openVictoryModal}
            className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs shadow-glow-purple flex items-center gap-2 transition-all transform active:scale-95 whitespace-nowrap"
          >
            <Gift className="h-4 w-4" />
            <span>{todayRewardClaim ? 'Change / View Reward' : 'Claim Nightly Reward'}</span>
          </button>
        </div>
      )}

      {/* Main Mission Header */}
      <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/80 p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-800/40 text-titan-cyan">
                <Zap className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-wider">
                  TODAY'S DAILY ACCOMPLISHMENTS
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Record each daily pillar once per day. Complete all 4 to unlock tonight's guilt-free reward!
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-lg border border-titan-cyan/40 bg-cyan-950/40 font-mono text-xs">
              <span className="text-slate-400">TODAY'S PROGRESS: </span>
              <strong className="text-titan-cyan text-sm">{completedCount}/4 COMPLETED</strong>
              <span className="text-slate-400 ml-1">({Math.round((completedCount / 4) * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* Daily Progress Bar */}
        <div className="mt-4 w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-titan-cyan via-titan-emerald to-purple-500 h-full transition-all duration-700"
            style={{ width: `${(completedCount / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* 4 Interactive Single-Day Toggle Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: 1 Hr Endurance */}
        <div
          className={`rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between group ${
            hasDoneEndurance
              ? 'border-emerald-500/60 bg-emerald-950/25 shadow-glow-emerald'
              : 'border-titan-cardBorder bg-titan-card/70 hover:border-titan-cyan/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl border text-base ${hasDoneEndurance ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300' : 'bg-cyan-950/80 border-cyan-700/50 text-titan-cyan'}`}>
                  🏃
                </div>
                <div>
                  <span className="text-[10px] font-bold text-titan-cyan tracking-wider">PHYSIQUE CORE</span>
                  <h4 className="text-sm font-bold text-white">1 HOUR ENDURANCE (CARDIO)</h4>
                </div>
              </div>

              {hasDoneEndurance ? (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900 border border-emerald-400 text-emerald-200 text-xs font-black shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" /> RECORDED TODAY
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold">
                  PENDING
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 font-sans mt-3 leading-relaxed">
              Zone 2 aerobic base building (running, rowing, assault bike) to enhance VO2 Max and mitochondrial density.
            </p>

            <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
              <span>⏱️ 60 Mins</span>
              <span>•</span>
              <span>🔥 ~600 kcal</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">+350 XP</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {hasDoneEndurance ? (
              <button
                onClick={() => handleToggle('ENDURANCE')}
                className="w-full py-2.5 rounded-xl border border-rose-800/70 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
              >
                <X className="h-4 w-4" />
                <span>Unrecord Today (Undo)</span>
              </button>
            ) : (
              <button
                onClick={() => handleToggle('ENDURANCE')}
                className="w-full py-2.5 rounded-xl bg-titan-cyan hover:bg-cyan-400 text-black font-extrabold text-xs shadow-glow-cyan flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
              >
                <Zap className="h-4 w-4" />
                <span>Tap to Record Today (+0.4% VO2)</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 2: 1 Hr Heavy Strength */}
        <div
          className={`rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between group ${
            hasDoneStrength
              ? 'border-emerald-500/60 bg-emerald-950/25 shadow-glow-emerald'
              : 'border-titan-cardBorder bg-titan-card/70 hover:border-titan-cyan/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl border text-base ${hasDoneStrength ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300' : 'bg-emerald-950/80 border-emerald-700/50 text-titan-emerald'}`}>
                  🏋️
                </div>
                <div>
                  <span className="text-[10px] font-bold text-titan-emerald tracking-wider">PHYSIQUE CORE</span>
                  <h4 className="text-sm font-bold text-white">1 HOUR HEAVY STRENGTH</h4>
                </div>
              </div>

              {hasDoneStrength ? (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900 border border-emerald-400 text-emerald-200 text-xs font-black shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" /> RECORDED TODAY
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold">
                  PENDING
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 font-sans mt-3 leading-relaxed">
              Compound resistance training (bench, squat, deadlift, overhead push) to drive relative bodyweight power.
            </p>

            <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
              <span>⏱️ 60 Mins</span>
              <span>•</span>
              <span>⚡ Heavy Power</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">+350 XP</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {hasDoneStrength ? (
              <button
                onClick={() => handleToggle('STRENGTH')}
                className="w-full py-2.5 rounded-xl border border-rose-800/70 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
              >
                <X className="h-4 w-4" />
                <span>Unrecord Today (Undo)</span>
              </button>
            ) : (
              <button
                onClick={() => handleToggle('STRENGTH')}
                className="w-full py-2.5 rounded-xl bg-titan-emerald hover:bg-emerald-400 text-black font-extrabold text-xs shadow-glow-emerald flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
              >
                <Zap className="h-4 w-4" />
                <span>Tap to Record Today (+Power)</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 3: 1 Hr Finance Modeling & LBO */}
        <div
          className={`rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between group ${
            hasDoneModeling
              ? 'border-emerald-500/60 bg-emerald-950/25 shadow-glow-emerald'
              : 'border-titan-cardBorder bg-titan-card/70 hover:border-amber-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl border text-base ${hasDoneModeling ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300' : 'bg-amber-950/80 border-amber-700/50 text-amber-400'}`}>
                  📊
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-400 tracking-wider">FINANCE MASTERY</span>
                  <h4 className="text-sm font-bold text-white">1 HR MODELING & LBO DRILL</h4>
                </div>
              </div>

              {hasDoneModeling ? (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900 border border-emerald-400 text-emerald-200 text-xs font-black shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" /> RECORDED TODAY
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold">
                  PENDING
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 font-sans mt-3 leading-relaxed">
              3-Statement integration, DCF valuation, circular debt schedules, and LBO 75% excess cash sweep waterfalls.
            </p>

            <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
              <span>⏱️ 60 Mins</span>
              <span>•</span>
              <span>📈 Wall Street Norms</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">+350 XP</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {hasDoneModeling ? (
              <button
                onClick={() => handleToggle('MODELING')}
                className="w-full py-2.5 rounded-xl border border-rose-800/70 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
              >
                <X className="h-4 w-4" />
                <span>Unrecord Today (Undo)</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleToggle('MODELING')}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-glow-amber flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
                >
                  <Zap className="h-4 w-4" />
                  <span>Tap to Record (+2 Pts)</span>
                </button>
                <button
                  onClick={() => {
                    const syl = SYLLABUS_TOPICS.find(s => s.id === 'syl-01') || SYLLABUS_TOPICS[0];
                    setActiveQuizTopic(syl);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold whitespace-nowrap"
                >
                  Quiz Drill
                </button>
              </>
            )}
          </div>
        </div>

        {/* Card 4: 1 Hr Quant Derivatives & Greeks */}
        <div
          className={`rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between group ${
            hasDoneQuant
              ? 'border-emerald-500/60 bg-emerald-950/25 shadow-glow-emerald'
              : 'border-titan-cardBorder bg-titan-card/70 hover:border-purple-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl border text-base ${hasDoneQuant ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300' : 'bg-purple-950/80 border-purple-700/50 text-purple-300'}`}>
                  🧠
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-300 tracking-wider">FINANCE MASTERY</span>
                  <h4 className="text-sm font-bold text-white">1 HR QUANT & DERIVATIVES</h4>
                </div>
              </div>

              {hasDoneQuant ? (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900 border border-emerald-400 text-emerald-200 text-xs font-black shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" /> RECORDED TODAY
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold">
                  PENDING
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 font-sans mt-3 leading-relaxed">
              Black-Scholes surfaces, high-order Greeks (Vanna, Volga), StatArb cointegration, and rate curve models.
            </p>

            <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
              <span>⏱️ 60 Mins</span>
              <span>•</span>
              <span>⚡ Quant Desk Rigor</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">+350 XP</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {hasDoneQuant ? (
              <button
                onClick={() => handleToggle('QUANT')}
                className="w-full py-2.5 rounded-xl border border-rose-800/70 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
              >
                <X className="h-4 w-4" />
                <span>Unrecord Today (Undo)</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleToggle('QUANT')}
                  className="flex-1 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-extrabold text-xs shadow-glow-purple flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
                >
                  <Zap className="h-4 w-4" />
                  <span>Tap to Record (+2 Pts)</span>
                </button>
                <button
                  onClick={() => {
                    const syl = SYLLABUS_TOPICS.find(s => s.id === 'syl-02') || SYLLABUS_TOPICS[0];
                    setActiveQuizTopic(syl);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold whitespace-nowrap"
                >
                  Quiz Drill
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
