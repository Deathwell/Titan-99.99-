import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  RotateCw,
  Download,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Sparkles,
  QrCode,
  Share2,
  Copy,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';

interface HolographicIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HolographicIdCardModal: React.FC<HolographicIdCardModalProps> = ({ isOpen, onClose }) => {
  const { profile, metrics, composite } = useTitan();

  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = -((y - centerY) / centerY) * 16;
    const rY = ((x - centerX) / centerX) * 16;

    setRotateX(rX);
    setRotateY(rY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.5 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  const toggleFlip = () => {
    setIsFlipped(prev => !prev);
    soundEngine.playClick(850);
  };

  const handleCopyHash = () => {
    const hash = `TITAN-ID-${profile.operatorId || 'OP-999'}-${profile.xp || 0}XP-${profile.callsign || 'OPERATOR'}`;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    soundEngine.playClick(900);
    setTimeout(() => setCopied(false), 2000);
  };

  // High-Resolution 1200x750 Canvas Card Export
  const handleDownloadCard = () => {
    setIsExporting(true);
    soundEngine.playMilestoneFanfare();

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background Obsidian Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 750);
    bgGrad.addColorStop(0, '#06080f');
    bgGrad.addColorStop(0.5, '#0a0d17');
    bgGrad.addColorStop(1, '#04060a');
    ctx.fillStyle = bgGrad;
    ctx.roundRect(0, 0, 1200, 750, 40);
    ctx.fill();

    // 2. Cyberpunk Borders
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 690);

    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(38, 38, 1124, 674);

    // 3. Header Text
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('TITAN PROTOCOL // OPERATOR DOSSIER', 60, 85);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px monospace';
    ctx.fillText('GLOBAL 8.15B BENCHMARK SPECIFICATION', 60, 115);

    // 4. Callsign & Level
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText(profile.callsign || 'TITAN OPERATOR', 60, 200);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(`LEVEL ${profile.level || 1} • STREAK: ${profile.streakDays || 0} DAYS`, 60, 240);

    // 5. Global Rank
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px monospace';
    const rankStr = `GLOBAL RANK #${composite.globalRank.toLocaleString()} / 8.15B`;
    ctx.fillText(rankStr, 60, 330);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px monospace';
    const topPct = (100 - composite.percentileGlobal).toFixed(3);
    ctx.fillText(`PERCENTILE: TOP ${topPct}% (${composite.tier.name})`, 60, 370);

    // 6. Dual Domain Highlights
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`TOTAL OPERATOR XP: ${profile.xp.toLocaleString()} XP`, 60, 440);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px monospace';
    ctx.fillText(`VO2 Max: ${metrics.vo2Max || 45} ml/kg/min | Body Fat: ${metrics.bodyFatPercent || 15}%`, 60, 480);
    ctx.fillText(`Financial Modeling: ${metrics.financialModeling || 50}% | LBO Structuring: ${metrics.transactionStructuring || 50}%`, 60, 515);

    // 7. Security Hash & Footer
    ctx.fillStyle = '#475569';
    ctx.font = '16px monospace';
    ctx.fillText(`ID HASH: OP-SHA256-${Date.now().toString(36).toUpperCase()}-VERIFIED-0-MARKS`, 60, 670);

    // 8. Trigger Download
    const link = document.createElement('a');
    link.download = `TITAN_OPERATOR_DOSSIER_${profile.callsign || 'OPERATOR'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setIsExporting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fade-in font-sans select-none">
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-xl flex flex-col items-center space-y-5"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 3D Holographic Card Container */}
        <div
          className="w-full aspect-[1.6/1] max-w-md perspective-[1000px] cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={toggleFlip}
        >
          <div
            ref={cardRef}
            className="relative w-full h-full rounded-3xl transition-transform duration-300 transform-style-3d shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.15] overflow-hidden"
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`
            }}
          >
            {/* Iridescent Holographic Foil Glare Sheen */}
            <div
              className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-200 mix-blend-color-dodge"
              style={{
                opacity: glarePos.opacity,
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(56,189,248,0.7) 0%, rgba(244,63,94,0.4) 30%, rgba(168,85,247,0.3) 60%, transparent 80%)`
              }}
            />

            {/* Micro-Circuit Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40 z-10" />

            {/* ================= FRONT FACE ================= */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0d18] via-[#090a10] to-[#04060a] p-6 flex flex-col justify-between backface-hidden z-20 border border-cyan-500/30 rounded-3xl">
              {/* Card Top Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
                    <Flame className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-widest text-rose-400 block uppercase">
                      TITAN PROTOCOL // OPERATOR CARD
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      SPECIES BENCHMARK REGISTRY
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>VERIFIED 0-MARKS</span>
                </div>
              </div>

              {/* Center Identity & Rank */}
              <div className="space-y-2 my-auto">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {profile.callsign || 'TITAN OPERATOR'}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 font-bold">
                    LEVEL {profile.level || 1}
                  </span>
                  <span>•</span>
                  <span>{profile.xp?.toLocaleString() || 0} TOTAL XP</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">{profile.streakDays || 0}D STREAK</span>
                </div>

                <div className="pt-2 border-t border-white/[0.08] flex items-baseline justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
                      GLOBAL SPECIES RANK:
                    </span>
                    <span className="text-lg sm:text-xl font-black font-mono text-emerald-400">
                      #{composite.globalRank.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block">
                      PERCENTILE:
                    </span>
                    <span className="text-sm font-bold font-mono text-cyan-300">
                      TOP {(100 - composite.percentileGlobal).toFixed(3)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-2 border-t border-white/[0.06]">
                <span>HASH: OP-999-VERIFIED</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <RotateCw className="h-3 w-3 animate-spin" />
                  CLICK TO FLIP REAR AUDIT
                </span>
              </div>
            </div>

            {/* ================= BACK FACE ================= */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#0c0a14] via-[#090a10] to-[#04060a] p-6 flex flex-col justify-between backface-hidden z-20 border border-purple-500/30 rounded-3xl"
              style={{ transform: 'rotateY(180deg)' }}
            >
              {/* Back Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase">
                  BIOMETRIC & QUANTITATIVE AUDIT
                </span>
                <span className="text-[9px] font-mono text-zinc-400">
                  TOP 0.1% SPECIES MATRIX
                </span>
              </div>

              {/* Metrics Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2 my-auto text-xs font-mono">
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-zinc-400 block text-[9px]">VO2 MAX AEROBIC:</span>
                  <span className="text-white font-bold">{metrics.vo2Max || 45} ml/kg/min</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-zinc-400 block text-[9px]">BODY FAT %:</span>
                  <span className="text-emerald-400 font-bold">{metrics.bodyFatPercent || 15}%</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-zinc-400 block text-[9px]">FINANCE MODELING:</span>
                  <span className="text-amber-400 font-bold">{metrics.financialModeling || 50}%</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-zinc-400 block text-[9px]">DEAL STRUCTURING:</span>
                  <span className="text-cyan-400 font-bold">{metrics.transactionStructuring || 50}%</span>
                </div>
              </div>

              {/* Cryptographic Seal */}
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
                <span>CRYPTOGRAPHIC SEAL: VALID</span>
                <span className="text-purple-400 font-bold">CLICK TO FLIP FRONT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full max-w-md">
          <button
            onClick={toggleFlip}
            className="flex-1 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all"
          >
            <RotateCw className="h-4 w-4 text-cyan-400" />
            <span>Flip Card Face</span>
          </button>

          <button
            onClick={handleDownloadCard}
            disabled={isExporting}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-purple-600 to-rose-600 hover:from-cyan-500 hover:to-rose-500 text-white font-extrabold text-xs font-mono flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Download className="h-4 w-4" />
            <span>{isExporting ? 'Generating...' : 'Export High-Res PNG'}</span>
          </button>
        </div>

        {/* Copy Shareable Hash */}
        <button
          onClick={handleCopyHash}
          className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied Operator ID Hash!' : 'Copy Shareable Identity Hash'}</span>
        </button>
      </div>
    </div>
  );
};
