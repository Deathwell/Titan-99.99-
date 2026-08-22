import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Camera,
  Upload,
  Zap,
  Sliders,
  Eye,
  Activity,
  Layers,
  RotateCcw,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Shield,
  Dumbbell,
  Scale,
  Flame,
  ArrowRight,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import {
  biometricVisionEngine,
  BiometricAnalysisResult
} from '../../lib/biometricVisionEngine';
import {
  hologramMorphEngine,
  HologramRenderMode
} from '../../lib/hologramMorphEngine';
import { soundEngine } from '../../lib/audio';

export const NeuralHologramScanner: React.FC = () => {
  const { metrics, profile, updateMetrics } = useTitan();

  // Ingestion & Scan State
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>('/samples/sample_user_photo.jpg');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepText, setScanStepText] = useState<string>('');
  const [scanResult, setScanResult] = useState<BiometricAnalysisResult | null>(null);

  // Hologram Morph Controls
  const [targetBodyFat, setTargetBodyFat] = useState<number>(20.0);
  const [renderMode, setRenderMode] = useState<HologramRenderMode>('CYBER_HOLO');
  const [showScanlines, setShowScanlines] = useState<boolean>(true);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [showMuscleOverlay, setShowMuscleOverlay] = useState<boolean>(true);
  const [showHudRings, setShowHudRings] = useState<boolean>(true);

  // Viewport interaction
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [isAdopted, setIsAdopted] = useState<boolean>(false);

  // Camera capture modal state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isolatedImgElementRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scanlineOffsetRef = useRef<number>(0);
  const rotationAngleRef = useRef<number>(0);

  // Execute AI biometric scan on image
  const processImage = useCallback(async (src: string) => {
    setIsScanning(true);
    setIsAdopted(false);
    setScanStepText('INITIATING NEURAL VISION SCANNER...');
    soundEngine.playJarvisHudPing();

    try {
      await new Promise(r => setTimeout(r, 400));
      setScanStepText('SEGMENTING SILHOUETTE & REMOVING BACKGROUND...');

      await new Promise(r => setTimeout(r, 450));
      setScanStepText('CALCULATING FACIAL ADIPOSITY & WAIST-TO-SHOULDER RATIOS...');

      const result = await biometricVisionEngine.analyzeBiometricPhoto(
        src,
        profile.bodyWeightKg || metrics.bodyWeightKg || 80,
        profile.heightCm || 180
      );

      await new Promise(r => setTimeout(r, 350));
      setScanStepText('SYNTHESIZING 3D CYBERNETIC HOLOGRAM...');

      setScanResult(result);
      setTargetBodyFat(result.estimatedBodyFatPercent);

      // Preload isolated cutout image element
      const isoImg = new Image();
      isoImg.onload = () => {
        isolatedImgElementRef.current = isoImg;
        setIsScanning(false);
        soundEngine.playMilestoneFanfare();
      };
      isoImg.src = result.isolatedSubjectDataUrl;
    } catch (err) {
      console.error('Scan error:', err);
      setIsScanning(false);
      soundEngine.playAlert();
    }
  }, [profile.bodyWeightKg, profile.heightCm, metrics.bodyWeightKg]);

  // Initial scan on mount
  useEffect(() => {
    processImage(selectedImageSrc);
    return () => {
      stopCamera();
    };
  }, []);

  // Animation render loop
  useEffect(() => {
    let active = true;

    const renderLoop = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      const isolatedImg = isolatedImgElementRef.current;

      if (canvas && isolatedImg && scanResult) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          scanlineOffsetRef.current = (scanlineOffsetRef.current + 1.2) % 100;
          rotationAngleRef.current += 0.008;

          hologramMorphEngine.renderMorphedHologram(
            ctx,
            canvas.width,
            canvas.height,
            isolatedImg,
            scanResult.landmarks,
            {
              baselineBodyFat: scanResult.estimatedBodyFatPercent,
              targetBodyFat,
              mode: renderMode,
              showScanlines,
              showHudRings,
              showWireframe,
              showMuscleOverlay,
              scanlineOffset: scanlineOffsetRef.current,
              rotationAngle: rotationAngleRef.current,
              zoomLevel,
              panX,
              panY
            }
          );
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scanResult, targetBodyFat, renderMode, showScanlines, showHudRings, showWireframe, showMuscleOverlay, zoomLevel, panX, panY]);

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const dataUrl = ev.target.result as string;
          setSelectedImageSrc(dataUrl);
          processImage(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera Handling
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      alert('Could not access camera. Please allow camera permissions.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      stopCamera();
      setSelectedImageSrc(dataUrl);
      processImage(dataUrl);
    }
  };

  // Adopt Scanned Body Fat into Titan Protocol
  const handleAdoptBodyFat = () => {
    if (!scanResult) return;
    updateMetrics({ bodyFatPercent: scanResult.estimatedBodyFatPercent });
    setIsAdopted(true);
    soundEngine.playQuestComplete();
  };

  // Projected body composition at current slider position
  const currentWeight = profile.bodyWeightKg || metrics.bodyWeightKg || 80;
  const currentLeanMass = scanResult ? scanResult.estimatedLeanMassKg : (currentWeight * (1 - targetBodyFat / 100));
  const projectedTotalWeight = Number((currentLeanMass / (1 - targetBodyFat / 100)).toFixed(1));
  const projectedFatMass = Number((projectedTotalWeight * (targetBodyFat / 100)).toFixed(1));

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner HUD */}
      <div className="rounded-xl border border-titan-cardBorder bg-titan-surface/90 p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-titan-cyan shadow-glow-cyan">
              <Eye className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wider flex items-center gap-2">
                  NEURAL BIOMETRIC HOLOGRAM SCANNER
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/60 text-[10px] text-titan-cyan font-bold animate-pulse">
                  AI VISION v2.6
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                AI Visual Adiposity Estimation • Subject Background Isolation • 60FPS Real-Time Morph Simulation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-all">
              <Upload className="h-4 w-4 text-titan-cyan" />
              Upload Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={startCamera}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              <Camera className="h-4 w-4 text-emerald-400" />
              Live Camera
            </button>

            <button
              onClick={() => {
                setSelectedImageSrc('/samples/sample_user_photo.jpg');
                processImage('/samples/sample_user_photo.jpg');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600/80 text-cyan-300 text-xs font-bold transition-all shadow-glow-cyan"
            >
              <RefreshCw className="h-4 w-4" />
              Sample Photo
            </button>
          </div>
        </div>

        {/* Scanning Progress Overlay */}
        {isScanning && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-titan-cyan mb-1.5">
              <span className="flex items-center gap-2 font-bold">
                <span className="h-2 w-2 rounded-full bg-titan-cyan animate-ping inline-block" />
                {scanStepText}
              </span>
              <span className="font-bold">PROCESSING NEURAL MESH...</span>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-cyan-900/50">
              <div className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 animate-pulse w-full" />
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Central Hologram Viewport (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-titan-cardBorder bg-black/80 shadow-2xl overflow-hidden relative backdrop-blur-xl flex flex-col items-center justify-center min-h-[520px]">
            {/* Viewport Header Controls */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-lg p-1">
                {(['CYBER_HOLO', 'NEURAL_GREEN', 'ANATOMICAL_XRAY', 'PHOTOREALISTIC'] as HologramRenderMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      setRenderMode(m);
                      soundEngine.playClick(850);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      renderMode === m
                        ? 'bg-titan-cyan text-black shadow-glow-cyan'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m === 'CYBER_HOLO' && 'CYBER CYAN'}
                    {m === 'NEURAL_GREEN' && 'MATRIX GREEN'}
                    {m === 'ANATOMICAL_XRAY' && 'BIO X-RAY'}
                    {m === 'PHOTOREALISTIC' && 'REALISTIC'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-slate-300 text-xs">
                <button
                  onClick={() => setZoomLevel(z => Math.min(2.0, z + 0.15))}
                  className="p-1 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(z => Math.max(0.6, z - 0.15))}
                  className="p-1 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1.0);
                    setPanX(0);
                    setPanY(0);
                  }}
                  className="p-1 hover:text-white"
                  title="Reset View"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Central Hologram Canvas */}
            <canvas
              ref={canvasRef}
              width={700}
              height={560}
              className="w-full h-auto max-h-[560px] object-contain rounded-lg"
            />

            {/* Floating Telemetry Tag */}
            <div className="absolute bottom-3 left-3 z-10 bg-slate-950/80 border border-cyan-500/40 rounded-lg px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md">
              <span className="text-slate-400">SIMULATED ADIPOSITY: </span>
              <strong className="text-titan-cyan text-sm">{targetBodyFat.toFixed(1)}%</strong>
              <span className="ml-2 text-[10px] text-slate-500">
                ({targetBodyFat < (scanResult?.estimatedBodyFatPercent || 20) ? 'DEFICIT / CUT' : 'SURPLUS / BULK'})
              </span>
            </div>

            {/* Toggles Strip */}
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-lg p-1.5 text-[10px]">
              <button
                onClick={() => setShowScanlines(!showScanlines)}
                className={`px-2 py-0.5 rounded border transition-all ${
                  showScanlines ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'border-slate-800 text-slate-500'
                }`}
              >
                Scanlines
              </button>
              <button
                onClick={() => setShowWireframe(!showWireframe)}
                className={`px-2 py-0.5 rounded border transition-all ${
                  showWireframe ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'border-slate-800 text-slate-500'
                }`}
              >
                Wireframe
              </button>
              <button
                onClick={() => setShowMuscleOverlay(!showMuscleOverlay)}
                className={`px-2 py-0.5 rounded border transition-all ${
                  showMuscleOverlay ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'border-slate-800 text-slate-500'
                }`}
              >
                Ab Cuts
              </button>
            </div>
          </div>

          {/* Real-Time Body Fat Morph Slider Control */}
          <div className="rounded-xl border border-titan-cardBorder bg-titan-card/80 p-5 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-titan-cyan" />
                <span className="text-xs font-bold text-white tracking-wider">
                  BODY FAT PROJECTION SLIDER (5.0% - 60.0%)
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-titan-cyan drop-shadow-md">
                  {targetBodyFat.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400">
                  {targetBodyFat <= 9.0 ? 'STAGE SHREDDED' : targetBodyFat <= 13.0 ? 'ATHLETIC ELITE' : targetBodyFat <= 17.0 ? 'LEAN OPTIMAL' : targetBodyFat <= 25.0 ? 'AVERAGE' : 'ADIPOSE'}
                </span>
              </div>
            </div>

            <input
              type="range"
              min="5.0"
              max="60.0"
              step="0.1"
              value={targetBodyFat}
              onChange={(e) => {
                setTargetBodyFat(parseFloat(e.target.value));
              }}
              className="w-full accent-titan-cyan cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />

            {/* Quick-Jump Presets */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-800/80">
              {[
                { label: '8% Apex', val: 8.0, color: 'text-rose-300 bg-rose-950/40 border-rose-800/60' },
                { label: '12% Athletic', val: 12.0, color: 'text-emerald-300 bg-emerald-950/40 border-emerald-800/60' },
                { label: '15% Lean', val: 15.0, color: 'text-cyan-300 bg-cyan-950/40 border-cyan-800/60' },
                { label: '20% Baseline', val: 20.0, color: 'text-slate-300 bg-slate-800 border-slate-700' },
                { label: '30% Adipose', val: 30.0, color: 'text-amber-300 bg-amber-950/40 border-amber-800/60' },
                { label: '50% Massive', val: 50.0, color: 'text-orange-300 bg-orange-950/40 border-orange-800/60' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => {
                    setTargetBodyFat(p.val);
                    soundEngine.playClick(900);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold hover:scale-105 transition-all ${p.color} ${
                    Math.abs(targetBodyFat - p.val) < 0.5 ? 'ring-1 ring-white' : ''
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Telemetry & Biometric Diagnostics (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Scan Verdict Card */}
          <div className="rounded-xl border border-titan-cardBorder bg-titan-card/80 p-5 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Crosshair className="h-4 w-4 text-titan-cyan" /> AI BIOMETRIC DIAGNOSTIC
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600 text-[10px] text-emerald-300 font-bold">
                {scanResult?.confidenceScore.toFixed(1)}% CONFIDENCE
              </span>
            </div>

            {scanResult ? (
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] text-slate-400">DETECTED BODY FAT ESTIMATE:</div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-3xl font-extrabold text-white">
                      {scanResult.estimatedBodyFatPercent.toFixed(1)}%
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs font-bold">
                      {scanResult.categoryLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-2 leading-relaxed">
                    {scanResult.description}
                  </p>
                </div>

                {/* Anthropometric Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">WAIST-TO-SHOULDER</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {scanResult.waistToShoulderRatio}x
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">ABDOMINAL CURVATURE</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {scanResult.abdominalCurvatureRatio}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">ESTIMATED FAT MASS</div>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">
                      {scanResult.estimatedFatMassKg} kg
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">LEAN MUSCLE MASS</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">
                      {scanResult.estimatedLeanMassKg} kg
                    </div>
                  </div>
                </div>

                {/* 1-Click Adopt Button */}
                <button
                  onClick={handleAdoptBodyFat}
                  disabled={isAdopted}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    isAdopted
                      ? 'bg-emerald-900/60 border border-emerald-500 text-emerald-200'
                      : 'bg-titan-cyan hover:bg-cyan-400 text-black shadow-glow-cyan'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isAdopted ? 'ADOPTED TO TITAN METRICS (ACTIVE)' : 'SYNC SCANNED BF% TO TITAN METRICS'}
                </button>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                Upload or select a photo to begin biometric analysis.
              </div>
            )}
          </div>

          {/* Morph Projection & Transformation Roadmap */}
          <div className="rounded-xl border border-titan-cardBorder bg-titan-card/80 p-5 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-400" /> SIMULATION PROJECTION METRICS
              </span>
              <span className="text-[10px] text-slate-400 font-bold">TARGET: {targetBodyFat.toFixed(1)}%</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-slate-400">Projected Body Weight:</span>
                <strong className="text-white text-sm">{projectedTotalWeight} kg</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-slate-400">Projected Fat Mass:</span>
                <strong className="text-amber-400 text-sm">{projectedFatMass} kg</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-slate-400">Preserved Lean Muscle:</span>
                <strong className="text-emerald-400 text-sm">{currentLeanMass.toFixed(1)} kg</strong>
              </div>

              {scanResult && scanResult.estimatedBodyFatPercent > 12.0 && (
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Fat Loss to 10% Titan Apex:</span>
                    <strong className="text-cyan-300">{scanResult.fatLossRequiredKg} kg</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Target Deficit Protocol:</span>
                    <strong className="text-rose-400">-{scanResult.dailyCaloricDeficitKcal} kcal/day</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Estimated Timeline:</span>
                    <strong className="text-emerald-300">~{scanResult.estimatedWeeksTo10Percent} weeks</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Camera Snapshot Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-titan-cyan/50 bg-slate-900 p-5 shadow-glow-cyan text-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="h-4 w-4 text-titan-cyan" /> CAPTURE FULL-BODY / TORSO SNAP
              </h3>
              <button onClick={stopCamera} className="text-slate-400 hover:text-white text-xs">
                Cancel
              </button>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden bg-black aspect-video relative flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {/* Center Alignment Guide */}
              <div className="absolute inset-8 border border-cyan-500/40 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[10px] text-cyan-400 font-bold bg-black/60 px-2 py-0.5 rounded">
                  ALIGN TORSO & HEAD HERE
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={captureCameraPhoto}
                className="px-6 py-2 rounded-xl bg-titan-cyan hover:bg-cyan-400 text-black font-bold text-xs shadow-glow-cyan"
              >
                Capture & Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
