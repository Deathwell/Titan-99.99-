import React, { useState } from 'react';
import {
  X,
  Bell,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Zap,
  Download,
  Shield,
  Send,
  Copy,
  Check,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { tacticalPushService } from '../../lib/pushNotifications';
import { soundEngine } from '../../lib/audio';

interface MobilePushSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobilePushSetupModal: React.FC<MobilePushSetupModalProps> = ({ isOpen, onClose }) => {
  const { profile } = useTitan();
  const [copied, setCopied] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [topic, setTopic] = useState(() => tacticalPushService.getStoredRelayTopic());

  if (!isOpen) return null;

  const ntfyUrl = `https://ntfy.sh/${topic}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ntfyUrl);
    setCopied(true);
    soundEngine.playClick(800);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTest = async () => {
    setTestSent(true);
    soundEngine.playMilestoneFanfare();
    await tacticalPushService.sendMobilePushRelay({
      title: '🚨 TITAN PROTOCOL • MOBILE ACCOUNTABILITY LINK',
      body: 'Tactical mobile push is ACTIVE! You will receive loss-aversion ultimatums and mission alerts even when your browser is closed.',
      priority: 5,
      tags: ['shield', 'zap', 'fire']
    }, topic);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans select-none">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0c0c12]/98 p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Smartphone className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                SYSTEM LINK // 24/7 ACCOUNTABILITY
              </span>
              <h3 className="text-base font-extrabold text-white">
                Mobile Push & Lockscreen Alarms
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Method 1: Progressive Web App (Add to Home Screen) */}
        <div className="p-4 rounded-xl border border-cyan-500/25 bg-cyan-950/20 space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs font-mono">
            <Download className="h-4 w-4" />
            <span>METHOD 1: INSTALL AS NATIVE APP (PWA)</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            Install TITAN directly onto your phone’s home screen without downloading from the App Store / Play Store:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-zinc-300 pt-1">
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <span className="text-cyan-400 font-bold block">📱 Android (Chrome):</span>
              <span>Tap <strong>⋮ (3 dots)</strong> in top right $\to$ tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <span className="text-cyan-400 font-bold block">🍏 iPhone (Safari):</span>
              <span>Tap <strong>Share (box with arrow)</strong> $\to$ scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
            </div>
          </div>
        </div>

        {/* Method 2: Zero-Setup Instant Mobile Push Relay (ntfy.sh) */}
        <div className="p-4 rounded-xl border border-rose-500/30 bg-[#160a0f]/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono">
              <Flame className="h-4 w-4" />
              <span>METHOD 2: INSTANT PHONE RELAY (LOCKED SCREEN)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
              100% FREE • 0 LOGIN
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            Receive high-priority sound and vibration alerts on your phone <strong className="text-white">even if your browser is closed and phone is locked</strong>:
          </p>

          {/* Dedicated Private Channel */}
          <div className="p-3 rounded-lg bg-black/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>YOUR PRIVATE PUSH TOPIC:</span>
              <span className="text-rose-400 font-bold">{topic}</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={ntfyUrl}
                className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs font-mono text-zinc-300 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono font-bold text-white transition-all shrink-0 flex items-center gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Action Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <a
              href={ntfyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs transition-all shadow-md"
            >
              <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Open & Subscribe on Phone</span>
            </a>

            <button
              onClick={handleSendTest}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition-all border ${
                testSent
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500'
              }`}
            >
              <Send className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>{testSent ? 'Ping Dispatched!' : 'Send Test Phone Ping'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-zinc-300 transition-all border border-white/10"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
