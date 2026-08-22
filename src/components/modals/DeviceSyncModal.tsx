import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Radio,
  ArrowRightLeft,
  X,
  Sparkles,
  QrCode,
  ShieldCheck,
  Unlink
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';

interface DeviceSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceSyncModal: React.FC<DeviceSyncModalProps> = ({ isOpen, onClose }) => {
  const {
    syncCode,
    syncStatus,
    lastSyncedAt,
    generateNewSyncKey,
    connectSyncCode,
    disconnectSync,
    forcePushCloud,
    forcePullCloud
  } = useTitan();

  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [showQR, setShowQR] = useState(true);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://titan-protocol.vercel.app';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=030712&color=06b6d4&data=${encodeURIComponent(`${currentHost}/?sync=${syncCode || ''}`)}`;

  const handleCopy = () => {
    if (syncCode) {
      navigator.clipboard.writeText(syncCode);
      setCopied(true);
      soundEngine.playClick(950);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnectInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setIsLinking(true);
    soundEngine.playClick(750);
    const success = await connectSyncCode(inputCode.trim().toUpperCase());
    setIsLinking(false);

    if (success) {
      soundEngine.playMilestoneFanfare();
      setInputCode('');
    } else {
      soundEngine.playAlert();
    }
  };

  const handleGenerateNew = () => {
    generateNewSyncKey();
    soundEngine.playQuestComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in font-mono">
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-xl rounded-3xl border-2 border-cyan-500/80 bg-gradient-to-b from-slate-950 via-slate-900 to-black p-6 sm:p-8 shadow-glow-cyan"
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 shadow-glow-cyan">
            <ArrowRightLeft className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white tracking-wider">
                REAL-TIME CROSS-DEVICE CLOUD SYNC
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/60 text-cyan-300 font-bold">
                PC ⇄ MOBILE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Instantly mirror alarms, daily accomplishments, percentiles, and XP between PC and Phone in real-time.
            </p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${syncStatus === 'SYNCED' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span className="text-slate-300 font-bold">
              STATUS: {syncStatus === 'SYNCED' ? 'LIVE CLOUD LINK ACTIVE' : 'STANDALONE (NOT PAIRED)'}
            </span>
          </div>
          {lastSyncedAt && (
            <span className="text-[10px] text-cyan-400">Synced: {lastSyncedAt}</span>
          )}
        </div>

        {/* Two Pairing Options */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Your Device Sync Code / QR */}
          <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-cyan-300 font-bold block mb-1">
                OPTION 1: YOUR OPERATOR SYNC KEY
              </span>
              <p className="text-[11px] text-slate-400 font-sans">
                Enter this code on your other device or scan the QR code to link instantly.
              </p>

              {syncCode ? (
                <div className="mt-3">
                  <div className="flex items-center justify-between bg-slate-900 border border-cyan-500/50 rounded-xl px-3 py-2">
                    <span className="text-sm font-black text-cyan-300 tracking-widest">{syncCode}</span>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-200 text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* QR Code Container */}
                  {showQR && (
                    <div className="mt-3 flex flex-col items-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <img
                        src={qrUrl}
                        alt="Device Pairing QR"
                        className="h-28 w-28 rounded-lg border border-cyan-500/40"
                      />
                      <span className="text-[10px] text-slate-400 mt-1">Scan with Phone Camera</span>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleGenerateNew}
                  className="mt-3 w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-glow-cyan transition-all"
                >
                  Generate New Sync Key
                </button>
              )}
            </div>

            {syncCode && (
              <div className="mt-3 flex items-center justify-between text-[10px]">
                <button
                  onClick={handleGenerateNew}
                  className="text-slate-400 hover:text-white underline"
                >
                  Regenerate Key
                </button>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="text-cyan-300 hover:underline"
                >
                  {showQR ? 'Hide QR' : 'Show QR'}
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Link with Existing Code */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-emerald-300 font-bold block mb-1">
                OPTION 2: LINK EXISTING DEVICE
              </span>
              <p className="text-[11px] text-slate-400 font-sans">
                If your other device has a Sync Key, paste it here to connect both devices immediately.
              </p>

              <form onSubmit={handleConnectInput} className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="e.g. TITAN-784X"
                  value={inputCode}
                  onChange={e => setInputCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-mono uppercase tracking-wider focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLinking || !inputCode.trim()}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-glow-emerald transition-all disabled:opacity-50"
                >
                  {isLinking ? 'Linking Channels...' : 'Pair & Sync Now'}
                </button>
              </form>
            </div>

            {syncStatus === 'SYNCED' && (
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={forcePushCloud}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500 text-cyan-300 text-[10px] font-bold hover:bg-cyan-900"
                >
                  Push State
                </button>
                <button
                  onClick={forcePullCloud}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-[10px] font-bold hover:bg-slate-700"
                >
                  Pull State
                </button>
                <button
                  onClick={disconnectSync}
                  className="p-1 text-rose-400 hover:text-rose-300 text-[10px]"
                  title="Disconnect Sync"
                >
                  <Unlink className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>End-to-End Real-Time WebSocket Streaming Active</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
