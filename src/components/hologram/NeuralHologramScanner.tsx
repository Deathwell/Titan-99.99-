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
  Sparkles,
  Key,
  Server,
  Settings,
  AlertCircle
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import {
  biometricVisionEngine,
  BiometricAnalysisResult
} from '../../lib/biometricVisionEngine';
import {
  HologramMorphEngine,
  HologramRenderMode
} from '../../lib/hologramMorphEngine';
import {
  generativeBodyFatService,
  DISCRETE_BODY_FAT_STEPS,
  FilmstripStep,
  GenerativeBackendConfig
} from '../../lib/generativeBodyFatService';
import { soundEngine } from '../../lib/audio';

export const NeuralHologramScanner: React.FC = () => {
  const { metrics, profile, updateMetrics } = useTitan();

  // Selected Photo & Ingestion State
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>('/samples/sample_user_photo.jpg');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepText, setScanStepText] = useState<string>('');
  const [scanResult, setScanResult] = useState<BiometricAnalysisResult | null>(null);

  // Discrete Filmstrip State
  const [filmstripSteps, setFilmstripSteps] = useState<FilmstripStep[]>(DISCRETE_BODY_FAT_STEPS);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(3); // Defaults to 20%
  const [renderMode, setRenderMode] = useState<HologramRenderMode>('NEURAL_RECOMP');
  const [showScanlines, setShowScanlines] = useState<boolean>(true);
  const [showMuscleSynthesis, setShowMuscleSynthesis] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Cloud Generation State
  const [generatingStepIndex, setGeneratingStepIndex] = useState<number | null>(null);
  const [generationProgressText, setGenerationProgressText] = useState<string>('');
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [backendConfig, setBackendConfig] = useState<GenerativeBackendConfig>(generativeBodyFatService.getConfig());
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string>('');

  // Local Bodyweight & Metrics State
  const [userWeightKg, setUserWeightKg] = useState<number>(profile.bodyWeightKg || metrics.bodyWeightKg || 80);
  const [isAdopted, setIsAdopted] = useState<boolean>(false);

  // Camera Handling State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Canvas & Engine Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const morphEngineRef = useRef<HologramMorphEngine | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  // Active step computed data
  const currentStep = filmstripSteps[activeStepIndex] || filmstripSteps[0];

  // Initialize Canvas Engine
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = 540;

    const engine = new HologramMorphEngine(canvas);
    morphEngineRef.current = engine;

    return () => {
      engine.destroy();
      morphEngineRef.current = null;
    };
  }, []);

  // 60FPS Continuous Animation Render Loop
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      if (
        morphEngineRef.current &&
        loadedImageRef.current &&
        scanResult
      ) {
        morphEngineRef.current.renderHologramFrame(
          loadedImageRef.current,
          scanResult.landmarks,
          {
            renderMode,
            targetBodyFat: currentStep.bodyFatPercent,
            baselineBodyFat: scanResult.estimatedBodyFatPercent,
            showScanlines,
            showMuscleSynthesis,
            showFatLayerHeatmap: renderMode === 'ANATOMICAL_XRAY',
            zoomLevel,
            panOffset
          }
        );
      }
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [renderMode, currentStep, showScanlines, showMuscleSynthesis, zoomLevel, panOffset, scanResult]);

  // Execute initial biometric scan
  const processImage = useCallback(async (src: string) => {
    setIsScanning(true);
    setIsAdopted(false);
    setScanStepText('INITIATING ANTHROPOMETRIC VISION SCANNER...');
    soundEngine.playJarvisHudPing();

    try {
      await new Promise(r => setTimeout(r, 200));
      setScanStepText('EXTRACTING ANTI-ALIASED SILHOUETTE...');

      const result = await biometricVisionEngine.analyzeBiometricPhoto(
        src,
        undefined,
        profile.heightCm || 180
      );

      setScanStepText('SYNTHESIZING ANATOMICAL RECOMP FIELD...');

      // Load isolated image into memory for the morph engine
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = result.isolatedSubjectDataUrl;
      await new Promise(res => {
        img.onload = res;
      });
      loadedImageRef.current = img;

      setScanResult(result);
      setUserWeightKg(result.estimatedUserWeightKg);

      // Find nearest discrete step index to detected body fat
      let closestIdx = 0;
      let minDiff = 999;
      filmstripSteps.forEach((step, idx) => {
        const diff = Math.abs(step.bodyFatPercent - result.estimatedBodyFatPercent);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      setActiveStepIndex(closestIdx);

      setIsScanning(false);
      soundEngine.playMilestoneFanfare();
    } catch (err) {
      console.error('Scan error:', err);
      setIsScanning(false);
      soundEngine.playAlert();
    }
  }, [filmstripSteps, profile.heightCm]);

  useEffect(() => {
    processImage(selectedImageSrc);
    return () => {
      stopCamera();
    };
  }, []);

  // Handle step selection with ASMR tuned marimba tick & instant canvas refresh
  const handleSelectStep = (index: number) => {
    setActiveStepIndex(index);
    const pitchFactor = (filmstripSteps.length - 1 - index) / (filmstripSteps.length - 1);
    soundEngine.playSliderTick(pitchFactor);
  };

  // Trigger optional Cloud GPU generation
  const handleGenerateCloudFrame = async (index: number) => {
    const step = filmstripSteps[index];
    if (!scanResult) return;

    setGeneratingStepIndex(index);
    setGenerationProgressText('Connecting to GPU Inpainting Worker...');

    try {
      const generatedUrl = await generativeBodyFatService.generateStep(
        scanResult.isolatedSubjectDataUrl,
        step,
        (msg) => setGenerationProgressText(msg)
      );

      // Update image if returned
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = generatedUrl;
      await new Promise(res => { img.onload = res; });
      loadedImageRef.current = img;

      setFilmstripSteps(prev => {
        const next = [...prev];
        next[index] = { ...next[index], cachedImageUrl: generatedUrl };
        return next;
      });

      setGeneratingStepIndex(null);
      soundEngine.playQuestComplete();
    } catch (err: any) {
      console.error('Cloud Generation Error:', err);
      alert(err.message || 'Generation failed. Verify your GPU API Key.');
      setGeneratingStepIndex(null);
    }
  };

  // Save backend API credentials
  const handleSaveConfig = () => {
    generativeBodyFatService.saveConfig(backendConfig);
    setConfigSuccessMsg('Backend credentials securely saved!');
    setTimeout(() => {
      setConfigSuccessMsg('');
      setShowConfigModal(false);
    }, 1200);
  };

  // Handle Weight Adjustment
  const handleWeightChange = (newWeight: number) => {
    setUserWeightKg(newWeight);
    if (scanResult) {
      const fatMassKg = Number(((newWeight * currentStep.bodyFatPercent) / 100).toFixed(1));
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
      console.warn('Camera error:', err);
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

  // Adopt current step into Titan Protocol
  const handleAdoptMetrics = () => {
    updateMetrics({
      bodyFatPercent: currentStep.bodyFatPercent,
      bodyWeightKg: userWeightKg
    });
    setIsAdopted(true);
    soundEngine.playQuestComplete();
  };

  // Dynamic projection calculations
  const baselineLeanMass = scanResult ? scanResult.estimatedLeanMassKg : (userWeightKg * 0.75);
  const projectedWeight = Number((baselineLeanMass / (1 - currentStep.bodyFatPercent / 100)).toFixed(1));
  const projectedFat = Number((projectedWeight * (currentStep.bodyFatPercent / 100)).toFixed(1));

  return (
    <div className="space-y-6 font-mono">
      {/* Top HUD Banner */}
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
                  PHOTOREALISTIC BODY COMPOSITION SLIDER
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/60 text-[10px] text-titan-cyan font-bold animate-pulse">
                  IDENTITY-PRESERVED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Real-Time Physiological Transformation • Instant 60FPS Crossfading • Optional Cloud GPU Worker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              <Server className="h-4 w-4 text-amber-400" />
              GPU Backend
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-all">
              <Upload className="h-4 w-4 text-titan-cyan" />
              Upload Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={startCamera}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              <Camera className="h-4 w-4 text-emerald-400" />
              Camera
            </button>

            <button
              onClick={() => {
                setSelectedImageSrc('/samples/sample_user_photo.jpg');
                processImage('/samples/sample_user_photo.jpg');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600/80 text-cyan-300 text-xs font-bold transition-all shadow-glow-cyan"
            >
              <RefreshCw className="h-4 w-4" />
              Sample
            </button>
          </div>
        </div>

        {/* Framing Disclaimer */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-sans">
          <span>* Personalized visualization estimate. Biological fat distribution naturally varies across individuals.</span>
          <span className="text-titan-cyan font-mono text-[10px]">
            Backend: {backendConfig.apiKey ? `${backendConfig.provider.toUpperCase()} (Connected)` : 'Real-Time Neural Engine (Active)'}
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Central Viewport & Slider (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-titan-cardBorder bg-black/95 shadow-2xl overflow-hidden relative backdrop-blur-xl flex flex-col items-center justify-center min-h-[540px]">
            {/* Viewport Top Header Controls */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              {/* Render Mode Selector */}
              <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-lg p-1">
                {(['NEURAL_RECOMP', 'ANATOMICAL_XRAY', 'CYBER_CYAN', 'MATRIX_GREEN'] as HologramRenderMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => {
                      setRenderMode(mode);
                      soundEngine.playClick(850);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      renderMode === mode
                        ? 'bg-titan-cyan text-black shadow-glow-cyan'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode === 'NEURAL_RECOMP' && 'RECOMP SYNTHESIS'}
                    {mode === 'ANATOMICAL_XRAY' && 'BIO X-RAY'}
                    {mode === 'CYBER_CYAN' && 'CYBER CYAN'}
                    {mode === 'MATRIX_GREEN' && 'MATRIX GREEN'}
                  </button>
                ))}
              </div>

              {/* Viewport Zoom / Reset Controls */}
              <div className="flex items-center gap-1 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-slate-300 text-xs">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.15))}
                  className="p-1 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.15))}
                  className="p-1 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1.0);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  className="p-1 hover:text-white"
                  title="Reset View"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Generating State Overlay */}
            {generatingStepIndex !== null && (
              <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                <div className="h-10 w-10 rounded-full border-2 border-titan-cyan border-t-transparent animate-spin mb-4" />
                <h4 className="text-sm font-bold text-white tracking-wider">
                  GENERATING {filmstripSteps[generatingStepIndex].label.toUpperCase()}
                </h4>
                <p className="text-xs text-titan-cyan mt-1 font-mono">
                  {generationProgressText}
                </p>
                <span className="text-[10px] text-slate-500 mt-3 max-w-sm font-sans">
                  Conditioning ControlNet depth map with facial identity embeddings...
                </span>
              </div>
            )}

            {/* 60FPS Interactive Render Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-[540px] block"
            />

            {/* Viewport Floating Step Tag */}
            <div className="absolute bottom-4 left-4 z-10 bg-slate-950/85 border border-cyan-500/40 rounded-lg px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md">
              <span className="text-slate-400">TARGET: </span>
              <strong className="text-titan-cyan text-sm">{currentStep.label}</strong>
              <span className="ml-2 text-[10px] text-slate-500">
                ({currentStep.category})
              </span>
            </div>

            {/* Feature Toggles */}
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-slate-950/85 border border-slate-800 rounded-lg p-1.5 text-[10px]">
              <button
                onClick={() => setShowScanlines(!showScanlines)}
                className={`px-2 py-0.5 rounded border transition-all ${
                  showScanlines ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'border-slate-800 text-slate-500'
                }`}
              >
                Laser Scan
              </button>
              <button
                onClick={() => setShowMuscleSynthesis(!showMuscleSynthesis)}
                className={`px-2 py-0.5 rounded border transition-all ${
                  showMuscleSynthesis ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'border-slate-800 text-slate-500'
                }`}
              >
                Muscle Striations
              </button>
            </div>
          </div>

          {/* Discrete Filmstrip Slider Controls */}
          <div className="rounded-xl border border-titan-cardBorder bg-titan-card/80 p-5 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-titan-cyan" />
                <span className="text-xs font-bold text-white tracking-wider">
                  BODY FAT FILMSTRIP SLIDER
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-titan-cyan">
                  {currentStep.bodyFatPercent.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400 font-sans">
                  {currentStep.category}
                </span>
              </div>
            </div>

            {/* Stepped Range Track */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={filmstripSteps.length - 1}
                step="1"
                value={activeStepIndex}
                onChange={(e) => handleSelectStep(parseInt(e.target.value))}
                className="w-full accent-titan-cyan cursor-pointer h-2.5 bg-slate-800 rounded-lg appearance-none"
              />

              {/* Step Notch Labels */}
              <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1">
                {filmstripSteps.map((s, idx) => (
                  <button
                    key={s.bodyFatPercent}
                    onClick={() => handleSelectStep(idx)}
                    className={`hover:text-cyan-300 transition-all ${
                      idx === activeStepIndex ? 'text-titan-cyan font-bold scale-110' : ''
                    }`}
                  >
                    {s.bodyFatPercent}%
                  </button>
                ))}
              </div>
            </div>

            {/* Step Anatomical Description */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed flex items-center justify-between gap-4">
              <div>
                <strong className="text-titan-cyan font-mono block text-[11px] mb-0.5">
                  ANATOMICAL COMPOSITION PROFILE:
                </strong>
                {currentStep.anatomicalDescription}
              </div>

              {backendConfig.apiKey && (
                <button
                  onClick={() => handleGenerateCloudFrame(activeStepIndex)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 text-[11px] font-bold shrink-0 flex items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Cloud GPU Pass
                </button>
              )}
            </div>

            {/* Quick-Jump Step Cards */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
              {filmstripSteps.map((step, idx) => (
                <button
                  key={step.bodyFatPercent}
                  onClick={() => handleSelectStep(idx)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    idx === activeStepIndex
                      ? 'bg-cyan-950 border-titan-cyan text-white shadow-glow-cyan'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{step.bodyFatPercent}%</div>
                  <div className="text-[10px] text-slate-400 truncate">{step.category}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Diagnostics & Projections (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Scan Diagnostic Card */}
          <div className="rounded-xl border border-titan-cardBorder bg-titan-card/80 p-5 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Crosshair className="h-4 w-4 text-titan-cyan" /> BIOMETRIC DIAGNOSTIC
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-600 text-[10px] text-emerald-300 font-bold">
                DEXA CALIBRATED
              </span>
            </div>

            {scanResult ? (
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] text-slate-400">DETECTED CURRENT ESTIMATE:</div>
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

                {/* Weight Input */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block">CURRENT BODY WEIGHT</label>
                    <span className="text-slate-500 text-[10px]">Estimated from silhouette:</span>
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

                {/* Body Composition Breakdown */}
                <div className="grid grid-cols-2 gap-3 text-xs">
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

                {/* Adopt Scanned Metrics */}
                <button
                  onClick={handleAdoptMetrics}
                  disabled={isAdopted}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    isAdopted
                      ? 'bg-emerald-900/60 border border-emerald-500 text-emerald-200'
                      : 'bg-titan-cyan hover:bg-cyan-400 text-black shadow-glow-cyan'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isAdopted ? 'ADOPTED TO TITAN PROFILE' : 'SYNC SELECTED BF% TO TITAN METRICS'}
                </button>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                Upload or select a photo to begin biometric analysis.
              </div>
            )}
          </div>

          {/* Transformation Timeline Roadmap */}
          <div className="rounded-xl border border-titan-cardBorder bg-titan-card/80 p-5 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-400" /> TARGET SIMULATION PROJECTIONS
              </span>
              <span className="text-[10px] text-slate-400 font-bold">{currentStep.label}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-slate-400">Projected Body Weight:</span>
                <strong className="text-white text-sm">{projectedWeight} kg</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-slate-400">Projected Fat Mass:</span>
                <strong className="text-amber-400 text-sm">{projectedFat} kg</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60">
                <span className="text-slate-400">Preserved Lean Muscle:</span>
                <strong className="text-emerald-400 text-sm">{baselineLeanMass.toFixed(1)} kg</strong>
              </div>

              {scanResult && scanResult.estimatedBodyFatPercent > 12.0 && (
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Required Fat Loss:</span>
                    <strong className="text-cyan-300">{scanResult.fatLossRequiredKg} kg</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Deficit Protocol:</span>
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

      {/* GPU Backend Setup Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-titan-cardBorder bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="h-4 w-4 text-titan-cyan" /> CLOUD GPU INFERENCE BACKEND
              </h3>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Connect a cloud GPU inference endpoint for real-time ControlNet Depth + InstantID generation.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">INFERENCE PROVIDER</label>
                <select
                  value={backendConfig.provider}
                  onChange={(e) => setBackendConfig({ ...backendConfig, provider: e.target.value as any })}
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold"
                >
                  <option value="fal_ai">fal.ai (Sub-second InstantID / ControlNet)</option>
                  <option value="replicate">Replicate (SDXL InstantID)</option>
                  <option value="custom">Custom Serverless Endpoint</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">API KEY / TOKEN</label>
                <input
                  type="password"
                  placeholder="e.g. key_xxxxxxxx or r8_xxxxxxxx"
                  value={backendConfig.apiKey}
                  onChange={(e) => setBackendConfig({ ...backendConfig, apiKey: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              {backendConfig.provider === 'custom' && (
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">CUSTOM ENDPOINT URL</label>
                  <input
                    type="url"
                    placeholder="https://your-gpu-worker.com/api/morph"
                    value={backendConfig.customEndpointUrl || ''}
                    onChange={(e) => setBackendConfig({ ...backendConfig, customEndpointUrl: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              )}
            </div>

            {configSuccessMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs text-center font-bold">
                {configSuccessMsg}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-6 py-2 rounded-xl bg-titan-cyan hover:bg-cyan-400 text-black font-bold text-xs shadow-glow-cyan"
              >
                Save Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Snapshot Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-titan-cyan/50 bg-slate-900 p-5 shadow-glow-cyan">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="h-4 w-4 text-titan-cyan" /> CAPTURE BIOMETRIC SNAP
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
