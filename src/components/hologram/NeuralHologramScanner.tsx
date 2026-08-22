import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
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
  Maximize2,
  Compass,
  Play,
  Pause,
  Sparkles
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import {
  biometricVisionEngine,
  BiometricAnalysisResult
} from '../../lib/biometricVisionEngine';
import {
  ThreeHologramScene,
  HologramColorTheme
} from '../../lib/threeHologramScene';
import { soundEngine } from '../../lib/audio';

export const NeuralHologramScanner: React.FC = () => {
  const { metrics, profile, updateMetrics } = useTitan();

  // Ingestion & Scan State
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>('/samples/sample_user_photo.jpg');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepText, setScanStepText] = useState<string>('');
  const [scanResult, setScanResult] = useState<BiometricAnalysisResult | null>(null);

  // 3D Hologram Morph Controls
  const [targetBodyFat, setTargetBodyFat] = useState<number>(20.0);
  const [colorTheme, setColorTheme] = useState<HologramColorTheme>('CYBER_CYAN');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [showScanlines, setShowScanlines] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [userWeightKg, setUserWeightKg] = useState<number>(profile.bodyWeightKg || metrics.bodyWeightKg || 80);
  const [isAdopted, setIsAdopted] = useState<boolean>(false);

  // Camera capture modal state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // 3D Three.js Container Ref
  const threeContainerRef = useRef<HTMLDivElement | null>(null);
  const threeSceneRef = useRef<ThreeHologramScene | null>(null);

  // Initialize Three.js 3D Scene
  useEffect(() => {
    if (!threeContainerRef.current) return;

    const scene = new ThreeHologramScene(
      threeContainerRef.current,
      {
        colorTheme,
        wireframe,
        showScanlines,
        showParticles: true,
        autoRotate,
        targetBodyFat,
        baselineBodyFat: scanResult?.estimatedBodyFatPercent || 20.0
      },
      scanResult?.faceCropDataUrl
    );
    threeSceneRef.current = scene;

    return () => {
      scene.destroy();
      threeSceneRef.current = null;
    };
  }, []);

  // Update Three.js Scene Configuration
  useEffect(() => {
    if (threeSceneRef.current) {
      threeSceneRef.current.updateConfig({
        colorTheme,
        wireframe,
        showScanlines,
        autoRotate,
        targetBodyFat,
        baselineBodyFat: scanResult?.estimatedBodyFatPercent || 20.0
      });
    }
  }, [colorTheme, wireframe, showScanlines, autoRotate, targetBodyFat, scanResult]);

  // Execute AI biometric scan on photo
  const processImage = useCallback(async (src: string) => {
    setIsScanning(true);
    setIsAdopted(false);
    setScanStepText('INITIATING ANTHROPOMETRIC VISION SCANNER...');
    soundEngine.playJarvisHudPing();

    try {
      await new Promise(r => setTimeout(r, 250));
      setScanStepText('EXTRACTING ANTI-ALIASED SUBJECT SILHOUETTE...');

      await new Promise(r => setTimeout(r, 300));
      setScanStepText('CALCULATING DEXA ADIPOSITY & VOLUME INDICES...');

      const result = await biometricVisionEngine.analyzeBiometricPhoto(
        src,
        undefined, // Allow accurate automatic weight estimation
        profile.heightCm || 180
      );

      await new Promise(r => setTimeout(r, 250));
      setScanStepText('SYNTHESIZING 3D VOLUMETRIC HOLOGRAPHIC AVATAR...');

      setScanResult(result);
      setUserWeightKg(result.estimatedUserWeightKg);
      setTargetBodyFat(result.estimatedBodyFatPercent);

      if (threeSceneRef.current) {
        threeSceneRef.current.updateMorph(result.estimatedBodyFatPercent);
      }

      setIsScanning(false);
      soundEngine.playMilestoneFanfare();
    } catch (err) {
      console.error('Scan error:', err);
      setIsScanning(false);
      soundEngine.playAlert();
    }
  }, [profile.heightCm]);

  // Initial scan on mount
  useEffect(() => {
    processImage(selectedImageSrc);
    return () => {
      stopCamera();
    };
  }, []);

  // Recalculate when user updates weight manually
  const handleWeightChange = (newWeight: number) => {
    setUserWeightKg(newWeight);
    if (scanResult) {
      const fatMassKg = Number(((newWeight * scanResult.estimatedBodyFatPercent) / 100).toFixed(1));
      const leanMassKg = Number((newWeight - fatMassKg).toFixed(1));
      const targetWeightAt10 = Number((leanMassKg / 0.90).toFixed(1));
      const fatLossRequired = Math.max(0, Number((newWeight - targetWeightAt10).toFixed(1)));
      const estimatedWeeks = Math.max(1, Math.round(fatLossRequired / 0.85));

      setScanResult({
        ...scanResult,
        estimatedUserWeightKg: newWeight,
        estimatedFatMassKg: fatMassKg,
        estimatedLeanMassKg: leanMassKg,
        targetWeightAt10PercentKg: targetWeightAt10,
        fatLossRequiredKg: fatLossRequired,
        estimatedWeeksTo10Percent: estimatedWeeks
      });
    }
  };

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
    updateMetrics({
      bodyFatPercent: scanResult.estimatedBodyFatPercent,
      bodyWeightKg: userWeightKg
    });
    setIsAdopted(true);
    soundEngine.playQuestComplete();
  };

  // Projected body composition at current slider position
  const currentLeanMass = scanResult ? scanResult.estimatedLeanMassKg : (userWeightKg * (1 - targetBodyFat / 100));
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
                  ADVANCED 3D BIOMETRIC HOLOGRAM
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/60 text-[10px] text-titan-cyan font-bold animate-pulse">
                  3D WEBGL ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Volumetric 3D Anatomical Avatar • 360° Interactive Orbit • True 3D Parametric Body Fat Morphing (5% - 75%)
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
              <span className="font-bold">SYNTHESIZING 3D HOLOGRAPHIC MESH...</span>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-cyan-900/50">
              <div className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 animate-pulse w-full" />
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Central 3D Hologram Viewport (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-titan-cardBorder bg-black/95 shadow-2xl overflow-hidden relative backdrop-blur-xl flex flex-col items-center justify-center min-h-[540px]">
            {/* Viewport Header Controls */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              {/* Color Theme Selector */}
              <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-lg p-1">
                {(['CYBER_CYAN', 'MATRIX_GREEN', 'ANATOMICAL_XRAY', 'TITAN_GOLD'] as HologramColorTheme[]).map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setColorTheme(t);
                      soundEngine.playClick(850);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      colorTheme === t
                        ? 'bg-titan-cyan text-black shadow-glow-cyan'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t === 'CYBER_CYAN' && 'CYBER CYAN'}
                    {t === 'MATRIX_GREEN' && 'MATRIX GREEN'}
                    {t === 'ANATOMICAL_XRAY' && 'BIO X-RAY'}
                    {t === 'TITAN_GOLD' && 'TITAN GOLD'}
                  </button>
                ))}
              </div>

              {/* 3D Viewport Controls */}
              <div className="flex items-center gap-1 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-slate-300 text-xs">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-1 rounded ${autoRotate ? 'text-titan-cyan bg-cyan-950/60' : 'hover:text-white'}`}
                  title={autoRotate ? 'Pause 360° Rotation' : 'Start 360° Rotation'}
                >
                  {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => threeSceneRef.current?.setZoom(1.2)}
                  className="p-1 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => threeSceneRef.current?.setZoom(0.85)}
                  className="p-1 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => threeSceneRef.current?.resetOrientation()}
                  className="p-1 hover:text-white"
                  title="Reset 3D Orientation"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* 3D WebGL Canvas Container */}
            <div
              ref={threeContainerRef}
              className="w-full h-[540px] cursor-grab active:cursor-grabbing flex items-center justify-center"
            />

            {/* 3D Drag Hint */}
            <div className="absolute top-14 left-4 z-10 text-[10px] text-slate-500 flex items-center gap-1 pointer-events-none">
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              <span>Drag to orbit 360° in 3D</span>
            </div>

            {/* Floating Telemetry Tag */}
            <div className="absolute bottom-3 left-3 z-10 bg-slate-950/85 border border-cyan-500/40 rounded-lg px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md">
              <span className="text-slate-400">3D SIMULATED ADIPOSITY: </span>
              <strong className="text-titan-cyan text-sm">{targetBodyFat.toFixed(1)}%</strong>
              <span className="ml-2 text-[10px] text-slate-500">
                ({targetBodyFat < (scanResult?.estimatedBodyFatPercent || 20) ? 'DEFICIT / V-TAPER' : 'MASS EXPANSION'})
              </span>
            </div>

            {/* 3D Hologram Feature Toggles */}
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-slate-950/85 border border-slate-800 rounded-lg p-1.5 text-[10px]">
              <button
                onClick={() => setShowScanlines(!showScanlines)}
                className={`px-2 py-0.5 rounded border transition-all ${
                  showScanlines ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'border-slate-800 text-slate-500'
                }`}
              >
                Laser Scan
              </button>
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`px-2 py-0.5 rounded border transition-all ${
                  wireframe ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'border-slate-800 text-slate-500'
                }`}
              >
                3D Wireframe
              </button>
            </div>
          </div>

          {/* Real-Time 3D Body Fat Morph Slider Control */}
          <div className="rounded-xl border border-titan-cardBorder bg-titan-card/80 p-5 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-titan-cyan" />
                <span className="text-xs font-bold text-white tracking-wider">
                  3D ANTHROPOMETRIC MORPH SLIDER (5.0% - 75.0%)
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-titan-cyan drop-shadow-md">
                  {targetBodyFat.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400">
                  {targetBodyFat <= 9.0 ? 'STAGE SHREDDED' : targetBodyFat <= 13.5 ? 'ATHLETIC ELITE' : targetBodyFat <= 18.0 ? 'LEAN OPTIMAL' : targetBodyFat <= 25.0 ? 'AVERAGE' : targetBodyFat <= 50.0 ? 'HIGH ADIPOSE' : 'SEVERE ADIPOSITY'}
                </span>
              </div>
            </div>

            <input
              type="range"
              min="5.0"
              max="75.0"
              step="0.5"
              value={targetBodyFat}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setTargetBodyFat(val);
                threeSceneRef.current?.updateMorph(val);
              }}
              className="w-full accent-titan-cyan cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />

            {/* Quick-Jump Presets */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-800/80">
              {[
                { label: '8% Apex Shredded', val: 8.0, color: 'text-rose-300 bg-rose-950/40 border-rose-800/60' },
                { label: '12% Athletic Model', val: 12.0, color: 'text-emerald-300 bg-emerald-950/40 border-emerald-800/60' },
                { label: '15% Lean Optimal', val: 15.0, color: 'text-cyan-300 bg-cyan-950/40 border-cyan-800/60' },
                { label: '20% Baseline Fit', val: 20.0, color: 'text-slate-300 bg-slate-800 border-slate-700' },
                { label: '35% High Adipose', val: 35.0, color: 'text-amber-300 bg-amber-950/40 border-amber-800/60' },
                { label: '65% Severe Adiposity', val: 65.0, color: 'text-orange-300 bg-orange-950/40 border-orange-800/60' }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => {
                    setTargetBodyFat(p.val);
                    threeSceneRef.current?.updateMorph(p.val);
                    soundEngine.playClick(900);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold hover:scale-105 transition-all ${p.color} ${
                    Math.abs(targetBodyFat - p.val) < 1.0 ? 'ring-1 ring-white' : ''
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

                {/* Weight Input / Calibrator */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block">CURRENT BODY WEIGHT</label>
                    <span className="text-slate-500 text-[10px]">Auto-estimated or enter exact:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="40"
                      max="350"
                      value={userWeightKg}
                      onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 75)}
                      className="w-20 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white font-bold text-sm text-right focus:border-titan-cyan focus:outline-none"
                    />
                    <span className="text-slate-400 font-bold">kg</span>
                  </div>
                </div>

                {/* Anthropometric Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
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
                <Flame className="h-4 w-4 text-amber-400" /> 3D SIMULATION TARGET PROJECTIONS
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
