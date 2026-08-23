import React from 'react';
import { LogOut, ShieldAlert, Download, X, AlertTriangle } from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const { profile, resetAllData, exportData, disconnectSync } = useTitan();

  if (!isOpen) return null;

  const handlePureLogout = () => {
    soundEngine.playAlert();
    try {
      disconnectSync();
      localStorage.removeItem('titan_onboarding_completed');
      localStorage.removeItem('titan_current_device_id');
      resetAllData();
      onClose();
      // Brief reload to cleanly initialize onboarding flow
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  const handleBackupAndLogout = () => {
    soundEngine.playClick(1000);
    exportData();
    setTimeout(() => {
      handlePureLogout();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e0e14] border border-rose-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                Terminate Operator Session
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                Operator: <span className="text-rose-300 font-semibold">{profile.callsign}</span> • Tier {profile.level}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick(600);
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/25 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-200/90 leading-relaxed">
            Logging out will disconnect active device pairing and return the terminal to the setup state.
            You can export an encrypted JSON backup file before logging out.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleBackupAndLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
          >
            <Download className="h-4 w-4" />
            <span>Download Backup & Logout</span>
          </button>

          <button
            onClick={handlePureLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Without Backup</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick(600);
              onClose();
            }}
            className="w-full py-2 text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
          >
            Cancel & Return to Cockpit
          </button>
        </div>
      </div>
    </div>
  );
};
