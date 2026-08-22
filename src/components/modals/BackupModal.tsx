import React, { useRef, useState } from 'react';
import {
  X,
  Database,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileJson,
  RotateCcw
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';

export const BackupModal: React.FC = () => {
  const {
    isBackupOpen,
    setIsBackupOpen,
    exportData,
    importData,
    resetAllData
  } = useTitan();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  if (!isBackupOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        const success = importData(text);
        if (success) {
          setImportStatus('Backup restored successfully! All telemetry re-synchronized.');
          setTimeout(() => {
            setImportStatus(null);
            setIsBackupOpen(false);
          }, 1200);
        } else {
          setImportStatus('Error: Invalid backup file format.');
        }
      } catch {
        setImportStatus('Error: Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = () => {
    resetAllData();
    setIsResetConfirmOpen(false);
    setIsBackupOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-titan-cardBorder bg-titan-surface p-6 shadow-2xl font-mono text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-800 text-titan-cyan">
              <Database className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wider">
              PERSISTENCE & DATA MANAGEMENT
            </h3>
          </div>
          <button
            onClick={() => setIsBackupOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs">
          {/* Export Box */}
          <div className="p-4 rounded-xl border border-slate-800 bg-titan-card flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Download className="h-4 w-4 text-titan-cyan" /> EXPORT JSON BACKUP
              </h4>
              <p className="text-slate-400 mt-1 text-[11px]">
                Save complete operational history, logs, quests, and current percentile baselines to a standalone JSON file.
              </p>
            </div>
            <button
              onClick={exportData}
              className="px-4 py-2 rounded-lg bg-titan-cyan hover:bg-cyan-400 text-black font-bold whitespace-nowrap shadow-glow-cyan"
            >
              Export JSON
            </button>
          </div>

          {/* Import Box */}
          <div className="p-4 rounded-xl border border-slate-800 bg-titan-card flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-titan-emerald" /> RESTORE FROM BACKUP
              </h4>
              <p className="text-slate-400 mt-1 text-[11px]">
                Load previously saved telemetry file to synchronize across machines or recover previous state.
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg bg-titan-emerald hover:bg-emerald-400 text-black font-bold whitespace-nowrap shadow-glow-emerald"
              >
                Import JSON
              </button>
            </div>
          </div>

          {importStatus && (
            <div className="p-3 rounded-lg border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Factory Reset */}
          <div className="pt-4 border-t border-slate-800">
            {!isResetConfirmOpen ? (
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="w-full py-2.5 rounded-lg border border-rose-900/60 bg-rose-950/20 text-rose-400 hover:bg-rose-900/40 font-bold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to Factory Baseline Data</span>
              </button>
            ) : (
              <div className="p-4 rounded-xl border border-rose-600 bg-rose-950/50 space-y-3">
                <div className="flex items-center gap-2 text-rose-300 font-bold">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Confirm Factory Reset?</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  This will clear all logs and restore default preset values. Ensure you have exported a JSON backup first.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsResetConfirmOpen(false)}
                    className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFactoryReset}
                    className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
