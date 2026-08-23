import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Skull,
  Flame,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Zap,
  Info,
  Scale,
  Gavel,
  FileText
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';

export const BlackMarkDossier: React.FC = () => {
  const { profile, openTribunalModal } = useTitan();
  const blackMarks = profile.blackMarks || [];
  const tribunalHistory = profile.tribunalHistory || [];

  const activeMarks = blackMarks.filter(m => m.status === 'ACTIVE_INFRACTION');
  const expungedMarks = blackMarks.filter(m => m.status === 'EXPUNGED');

  const currentStreak = profile.streakDays || 0;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c12]/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl font-sans space-y-5 select-none">
      {/* Header with Authoritative Discipline Seal */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border shrink-0 ${
            activeMarks.length === 0
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
          }`}>
            {activeMarks.length === 0 ? (
              <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
            ) : (
              <Skull className="h-5 w-5 stroke-[2.5]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black tracking-widest uppercase font-mono px-2 py-0.5 rounded border border-white/10 bg-white/[0.04] text-zinc-300">
                OPERATOR DISCIPLINE DOSSIER
              </span>
              <span className={`text-xs font-mono font-bold ${
                activeMarks.length === 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {activeMarks.length === 0 ? 'IMMACULATE INTEGRITY' : `${activeMarks.length} ACTIVE INFRACTION(S)`}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              The Indelible Black Mark Registry
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={openTribunalModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-950/80 to-amber-950/80 hover:from-rose-900 hover:to-amber-900 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Scale className="h-3.5 w-3.5 text-amber-400" />
            <span>⚖️ Face AI Tribunal</span>
          </button>

          {activeMarks.length === 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>0 Black Marks</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <AlertTriangle className="h-3.5 w-3.5 animate-bounce" />
              <span>{activeMarks.length} Mark(s)</span>
            </div>
          )}
        </div>
      </div>

      {/* Protocol Discipline Law Explainer */}
      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-300 leading-relaxed font-sans space-y-1">
        <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-[11px]">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>THE UNCOMPROMISING TITAN LAW OF DISCIPLINE:</span>
        </div>
        <p className="text-[11px] text-zinc-400 pl-5">
          Every unexcused missed calendar day permanently stamps a <strong className="text-white">Black Mark</strong> onto your permanent Operator record, erases previous gains, and resets your streak to 0. You can submit legitimate medical emergencies to the <strong className="text-amber-400">AI Tribunal</strong> for a 24h pardon, while weak rationalizations are rejected with prejudice.
        </p>
      </div>

      {/* Active Infractions List */}
      {activeMarks.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-white/[0.08] rounded-xl bg-black/20">
          <ShieldCheck className="h-10 w-10 text-emerald-400/60 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white">Your Record is Flawless</h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Zero missed days recorded. You are upholding supreme operational consistency on the road to the Top 0.1%.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono block">
            ACTIVE DISCIPLINE INFRACTIONS:
          </span>

          {activeMarks.map((mark, idx) => {
            const daysRemaining = Math.max(0, 30 - currentStreak);
            const progressPercent = Math.min(100, Math.round((currentStreak / 30) * 100));

            return (
              <div
                key={mark.id || idx}
                className="p-4 rounded-xl border border-rose-500/40 bg-[#170a0e]/90 shadow-md space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-600 text-rose-300 text-[10px] font-extrabold font-mono">
                      BLACK MARK #{idx + 1}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {mark.dateTriggered}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-rose-400">
                    Penalty: -{mark.penaltyXP} XP
                  </span>
                </div>

                <div className="text-xs text-zinc-300 font-medium">
                  {mark.reason || 'Consecutive Missed Day Inactivity'}
                </div>

                {/* Expungement Redemption Progress Bar */}
                <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-400">EXPUNGEMENT REDEMPTION PROGRESS:</span>
                    <span className="text-white font-bold">
                      {currentStreak} / 30 Streak Days ({daysRemaining} days remaining)
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-black/60 border border-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tribunal Rulings & Excuses Ledger */}
      {tribunalHistory.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Gavel className="h-3.5 w-3.5 text-amber-400" />
              <span>AI TRIBUNAL HEARINGS LEDGER ({tribunalHistory.length})</span>
            </span>
          </div>

          <div className="space-y-2">
            {tribunalHistory.map((item) => {
              const isPardon = item.verdict.verdictType === 'PARDON_GRANTED';
              const isBS = item.verdict.verdictType === 'BULLSHIT_REJECTED';

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                    isPardon
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                      : isBS
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-100'
                      : 'bg-amber-950/20 border-amber-500/30 text-amber-100'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold font-mono border ${
                        isPardon
                          ? 'bg-emerald-900/60 border-emerald-400 text-emerald-300'
                          : isBS
                          ? 'bg-rose-900/80 border-rose-500 text-rose-300'
                          : 'bg-amber-900/60 border-amber-400 text-amber-300'
                      }`}>
                        {item.verdict.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {item.date} • {item.categoryLabel}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold ${
                      isPardon ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {item.verdict.xpAdjustment === 0 ? '0 XP (Waived)' : `${item.verdict.xpAdjustment} XP`}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-300 font-sans italic bg-black/40 p-2 rounded-lg border border-white/[0.05]">
                    "{item.userExplanation}"
                  </div>

                  <div className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                    <strong>Judge Ruling:</strong> {item.verdict.verdictReason}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expunged History (If any) */}
      {expungedMarks.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-white/[0.08]">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider font-mono block">
            HISTORICALLY EXPUNGED INFRACTIONS ({expungedMarks.length}):
          </span>
          <div className="space-y-1.5">
            {expungedMarks.map((m, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Infraction on {m.dateTriggered} (EXPUNGED via 30d Streak)</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold">REDEEMED</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
