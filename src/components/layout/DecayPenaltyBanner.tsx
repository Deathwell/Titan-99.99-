import React from 'react';
import {
  AlertTriangle,
  Flame,
  RotateCcw,
  X,
  Zap,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

export const DecayPenaltyBanner: React.FC = () => {
  const { activeDecayAlert, dismissDecayAlert, setActiveTab, clearDecayPenalty } = useTitan();

  if (!activeDecayAlert) return null;

  return (
    <div className="mx-4 sm:mx-6 mt-4 rounded-xl border border-rose-600/80 bg-rose-950/80 p-4 text-rose-100 shadow-2xl backdrop-blur-md font-mono animate-in slide-in-from-top duration-300">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-900/80 border border-rose-500 text-rose-300 mt-0.5">
            <ShieldAlert className="h-5 w-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-900 text-rose-300 text-[10px] font-extrabold border border-rose-600">
                PUNISHMENT PROTOCOL ACTIVATED
              </span>
              <span className="text-xs text-rose-300 font-bold">
                {activeDecayAlert.missedDaysCount} MISSED CALENDAR DAY(S) DETECTED
              </span>
            </div>

            <h3 className="text-sm font-extrabold text-white mt-1">
              PENALTY APPLIED: {activeDecayAlert.erasedDaysCount} PREVIOUS ACTIVE DAY(S) OF GAINS ERASED
            </h3>

            <p className="text-xs text-rose-200/90 mt-1 max-w-3xl leading-relaxed font-sans">
              As per the TITAN protocol discipline code, missed days roll back prior progress. Your streak has been reset to <strong className="text-white">0 days</strong> and your percentile curve for <strong className="text-white font-mono">[{activeDecayAlert.erasedDates.join(', ') || 'Recent gains'}]</strong> has been reverted.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-rose-300">
                Deducted Penalty: <strong className="text-rose-400">-{activeDecayAlert.xpDeducted} XP</strong>
              </span>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => {
                  dismissDecayAlert();
                  setActiveTab('physique');
                }}
                className="text-white hover:underline font-bold flex items-center gap-1"
              >
                <span>Log Session Today to Rebuild Gains</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearDecayPenalty}
            className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-[11px] text-rose-200"
          >
            Acknowledge & Clear
          </button>
          <button
            onClick={dismissDecayAlert}
            className="p-1 rounded text-rose-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
