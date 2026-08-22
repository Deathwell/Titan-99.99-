import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
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
  Unlink,
  Camera,
  CameraOff,
  CheckCircle2,
  Lock
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
  const [isCameraScanning, setIsCameraScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://titan-protocol.vercel.app';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&bgcolor=030712&color=06b6d4&data=${encodeURIComponent(`${currentHost}/?sync=${syncCode || ''}`)}`;

  // Stop camera on unmount or modal close
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraScanning(false);
    setScanError(null);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  const handleStartCamera = async () => {
    setScanError(null);
    setIsCameraScanning(true);
    soundEngine.playClick(850);

    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode: { ideal: 'environment' } }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Critical for iOS Safari
        await videoRef.current.play();
        requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setScanError('Camera permission denied or camera not found. You can still type the Sync Key below!');
      setIsCameraScanning(false);
      soundEngine.playAlert();
    }
  };

  const tickScan = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (qrResult && qrResult.data) {
            handleScannedQRData(qrResult.data);
            return;
          }
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tickScan);
  };

  const handleScannedQRData = async (data: string) => {
    stopCamera();
    soundEngine.playMilestoneFanfare();

    let extractedCode = data.trim();
    if (extractedCode.includes('sync=')) {
      try {
        const url = new URL(extractedCode);
        const codeParam = url.searchParams.get('sync');
        if (codeParam) {
          extractedCode = codeParam;
        }
      } catch {
        const match = extractedCode.match(/sync=([A-Za-z0-9_-]+)/);
        if (match && match[1]) {
          extractedCode = match[1];
        }
      }
    }

    extractedCode = extractedCode.toUpperCase();
    setIsLinking(true);
    await connectSyncCode(extractedCode);
    setIsLinking(false);
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in font-mono">
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-cyan-500/80 bg-gradient-to-b from-slate-950 via-slate-900 to-black p-5 sm:p-7 shadow-glow-cyan"
      >
        {/* Top Close Button */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute right-4 top-4 p-2 rounded-full border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all z-10"
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
                TITAN CLOUD LINK
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/60 text-cyan-300 font-bold">
                PERMANENT SYNC
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Alarms, workouts, daily accomplishments and percentiles stay synchronized forever across all paired devices.
            </p>
          </div>
        </div>

        {/* Live Persistent Status Pill */}
        <div className="mt-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${syncStatus === 'SYNCED' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-cyan-400" />
              {syncStatus === 'SYNCED' ? 'PERMANENT CLOUD LINK ACTIVE' : 'STANDALONE (NOT PAIRED)'}
            </span>
          </div>
          {lastSyncedAt && (
            <span className="text-[10px] text-cyan-400">Live: {lastSyncedAt}</span>
          )}
        </div>

        {/* Direct In-App Camera QR Code Scanner Viewfinder */}
        {isCameraScanning ? (
          <div className="mt-5 rounded-2xl border-2 border-cyan-400/80 bg-black p-4 relative overflow-hidden flex flex-col items-center">
            <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden border-2 border-cyan-500 bg-slate-950">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Holographic Targeting Reticle */}
              <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-xl pointer-events-none" />
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-glow-cyan" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-44 w-44 border-2 border-cyan-400/60 rounded-2xl animate-pulse" />
              </div>
            </div>

            <p className="mt-3 text-xs text-cyan-300 font-bold tracking-wider animate-pulse flex items-center gap-1.5">
              <Camera className="h-4 w-4" /> Point camera at Desktop QR Code...
            </p>

            <button
              onClick={stopCamera}
              className="mt-3 px-4 py-1.5 rounded-xl border border-rose-800 bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-bold transition-all"
            >
              Cancel Camera Scan
            </button>
          </div>
        ) : (
          /* Mobile 1-Tap Camera Scan Button */
          <div className="mt-4">
            <button
              onClick={handleStartCamera}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-black text-sm shadow-glow-cyan flex items-center justify-center gap-2 transition-all"
            >
              <Camera className="h-5 w-5 animate-bounce" />
              <span>SCAN DESKTOP QR CODE WITH CAMERA</span>
            </button>
            {scanError && (
              <p className="mt-2 text-[11px] text-rose-400 text-center">{scanError}</p>
            )}
          </div>
        )}

        {/* Two Pairing Options */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Your Device Sync Code / QR */}
          <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/20 p-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-cyan-300 font-bold block mb-1">
                YOUR OPERATOR SYNC KEY
              </span>
              <p className="text-[11px] text-slate-400 font-sans">
                Scan this QR code from your phone app or copy the code.
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
                        className="h-32 w-32 rounded-lg border border-cyan-500/40"
                      />
                      <span className="text-[10px] text-cyan-400 font-bold mt-1.5">Scan from Mobile App</span>
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
                MANUAL PAIRING CODE
              </span>
              <p className="text-[11px] text-slate-400 font-sans">
                Type the 6-character code from your other device to connect permanently.
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
                  {isLinking ? 'Linking Devices...' : 'Pair & Remember Forever'}
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
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Auto-Remembered: Never needs re-pairing</span>
          </span>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
