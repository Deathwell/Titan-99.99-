import React, { useState, useEffect } from 'react';
import {
  Scale,
  X,
  ShieldCheck,
  Skull,
  AlertTriangle,
  Send,
  Volume2,
  Mic,
  MicOff,
  Activity,
  HeartHandshake,
  Thermometer,
  Briefcase,
  Plane,
  BatteryLow,
  ClockAlert,
  HelpCircle,
  Gavel,
  Sparkles,
  CheckCircle2,
  Key,
  Cpu,
  Eye,
  BrainCircuit,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { EXCUSE_CATEGORIES } from '../../lib/excuseJudgeEngine';
import { aiCognitiveEngine, CognitiveAnalysisResult } from '../../lib/aiCognitiveEngine';
import { ExcuseCategory } from '../../types/titan';
import { soundEngine } from '../../lib/audio';
import { neuralVoiceService } from '../../lib/neuralVoiceService';

interface ExcuseJudgmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcuseJudgmentModal: React.FC<ExcuseJudgmentModalProps> = ({ isOpen, onClose }) => {
  const { profile, applyTribunalVerdict } = useTitan();

  const [selectedCategory, setSelectedCategory] = useState<ExcuseCategory>('EXHAUSTION_BURNOUT');
  const [explanation, setExplanation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('Initializing neural cognitive processor...');
  const [verdict, setVerdict] = useState<CognitiveAnalysisResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // AI Configuration State
  const [showConfig, setShowConfig] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => aiCognitiveEngine.getStoredGeminiKey());
  const [keySaved, setKeySaved] = useState(false);

  if (!isOpen) return null;

  const handleStartSpeechToText = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
                              (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new (SpeechRecognition as any)();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        soundEngine.playClick(800);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setExplanation(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSaveApiKey = () => {
    aiCognitiveEngine.setStoredGeminiKey(geminiKeyInput);
    setKeySaved(true);
    soundEngine.playClick(900);
    setTimeout(() => setKeySaved(false), 1500);
  };

  const handleSubmitCase = async () => {
    if (!explanation.trim()) {
      soundEngine.playAlert();
      return;
    }

    setIsAnalyzing(true);
    soundEngine.playClick(600);

    try {
      const result = await aiCognitiveEngine.evaluateWithDeepThought(
        selectedCategory,
        explanation,
        profile.callsign || 'OPERATOR',
        (step) => setAnalysisStep(step)
      );

      setVerdict(result);
      setIsAnalyzing(false);

      // Apply verdict to context
      applyTribunalVerdict(selectedCategory, explanation, result);

      // Play audio effect
      if (result.verdictType === 'PARDON_GRANTED') {
        soundEngine.playMilestoneFanfare();
      } else if (result.verdictType === 'BULLSHIT_REJECTED') {
        soundEngine.playAlert();
      } else {
        soundEngine.playQuestComplete();
      }

      // Read verdict
      speakVerdict(result.voiceTranscript);
    } catch (err) {
      console.error('Error during AI analysis:', err);
      setIsAnalyzing(false);
    }
  };

  const speakVerdict = (text: string) => {
    setIsSpeaking(true);
    neuralVoiceService.speak(text, () => {
      setIsSpeaking(false);
    });
  };

  const handleResetAndClose = () => {
    setVerdict(null);
    setExplanation('');
    setSelectedCategory('EXHAUSTION_BURNOUT');
    neuralVoiceService.stop();
    onClose();
  };

  const getCategoryIcon = (key: ExcuseCategory) => {
    switch (key) {
      case 'ACUTE_ILLNESS_FEVER': return <Thermometer className="h-4 w-4 text-rose-400" />;
      case 'SEVERE_INJURY_MEDICAL': return <Activity className="h-4 w-4 text-rose-400" />;
      case 'FAMILY_CRISIS': return <HeartHandshake className="h-4 w-4 text-rose-300" />;
      case 'WORK_OVERTIME_PRESSURE': return <Briefcase className="h-4 w-4 text-amber-400" />;
      case 'TRAVEL_TRANSIT': return <Plane className="h-4 w-4 text-cyan-400" />;
      case 'EXHAUSTION_BURNOUT': return <BatteryLow className="h-4 w-4 text-zinc-400" />;
      case 'PROCRASTINATION_DISTRACTION': return <ClockAlert className="h-4 w-4 text-zinc-400" />;
      default: return <HelpCircle className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in font-sans select-none">
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/[0.1] bg-[#0a0a10]/98 p-5 sm:p-7 shadow-2xl space-y-5 text-white"
      >
        {/* Top Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute right-4 top-4 p-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-sm">
              <Scale className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/40">
                  MOM + BOSS NEURAL TRIBUNAL
                </span>
                <span className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1">
                  <BrainCircuit className="h-3.5 w-3.5 text-cyan-400" />
                  COGNITIVE INTELLIGENCE CORE
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                The AI Excuse Interrogation Chamber
              </h2>
            </div>
          </div>

          {/* AI Settings Toggle */}
          <button
            onClick={() => setShowConfig(prev => !prev)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-[10px] font-mono text-zinc-400 hover:text-white transition-all"
            title="Configure AI API Engine"
          >
            <Key className="h-3 w-3 text-amber-400" />
            <span>AI Model Keys</span>
            {showConfig ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {/* AI Key Configuration Drawer */}
        {showConfig && (
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-zinc-300 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                <span>Google Gemini API Key (Optional for Unlimited Cloud LLM):</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {aiCognitiveEngine.getStoredGeminiKey() ? '🟢 Key Active' : '⚪ Using Semantic Reasoner'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={geminiKeyInput}
                onChange={e => setGeminiKeyInput(e.target.value)}
                placeholder="Paste AI Studio Gemini Key (AIzaSy...)"
                className="flex-1 px-3 py-1.5 rounded-lg bg-black border border-white/10 text-xs text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs transition-all"
              >
                {keySaved ? 'Saved!' : 'Save Key'}
              </button>
            </div>
            <p className="text-[10px] text-zinc-400 font-sans">
              Without an API key, TITAN uses its built-in <strong>Deep Semantic Cognitive Engine</strong> that dynamically deconstructs your exact phrases and motives.
            </p>
          </div>
        )}

        {/* Form View (Before Verdict) */}
        {!verdict && !isAnalyzing && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-300 leading-relaxed font-sans">
              <p>
                State your exact situation to the AI Judge. The AI reads between the lines, dissects your psychological premise, and cross-examines your reasoning:
                <strong className="text-emerald-300 block mt-1">
                  • Verified biological emergencies receive a 24-Hour Medical Exemption (0 XP lost).
                </strong>
                <strong className="text-rose-400 block mt-0.5">
                  • Weak comfort-rationalizations are called out with surgical precision (-150 XP + Black Mark).
                </strong>
              </p>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                1. SELECT CLASSIFICATION:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXCUSE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => {
                        setSelectedCategory(cat.key);
                        soundEngine.playClick(750);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-rose-500/20 border-rose-500/60 text-white shadow-sm'
                          : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">{getCategoryIcon(cat.key)}</div>
                      <div>
                        <span className="font-bold block text-xs">{cat.label}</span>
                        <span className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                          {cat.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Textarea Input with Voice Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  2. STATE YOUR CASE IN YOUR OWN WORDS:
                </label>
                <button
                  onClick={handleStartSpeechToText}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/10'
                  }`}
                >
                  {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3 text-cyan-400" />}
                  <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                </button>
              </div>

              <textarea
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                placeholder="Describe your exact symptoms, work situation, or what happened. The AI will dissect your specific words..."
                rows={4}
                className="w-full p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 transition-colors font-sans leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitCase}
              disabled={!explanation.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs font-mono tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Gavel className="h-4 w-4" />
              <span>SUBMIT STATEMENT TO AI COGNITIVE CORE</span>
            </button>
          </div>
        )}

        {/* Deliberation / Analyzing State */}
        {isAnalyzing && (
          <div className="py-12 text-center space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <div className="h-20 w-20 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
              <BrainCircuit className="h-8 w-8 text-rose-400 absolute animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-mono">
                AI COGNITIVE DELIBERATION IN PROGRESS...
              </h3>
              <p className="text-xs text-cyan-300 font-mono mt-1 animate-pulse">
                {analysisStep}
              </p>
            </div>
          </div>
        )}

        {/* Deep Thought Verdict Screen */}
        {verdict && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
            {/* Stamp Banner */}
            <div className={`p-4 rounded-2xl border-2 space-y-2 ${
              verdict.verdictType === 'PARDON_GRANTED'
                ? 'bg-emerald-950/70 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                : verdict.verdictType === 'BULLSHIT_REJECTED'
                ? 'bg-rose-950/80 border-rose-600 shadow-[0_0_35px_rgba(244,63,94,0.4)] animate-shake'
                : 'bg-amber-950/70 border-amber-500 shadow-md'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {verdict.verdictType === 'PARDON_GRANTED' ? (
                    <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 stroke-[2.5]" />
                  ) : verdict.verdictType === 'BULLSHIT_REJECTED' ? (
                    <Skull className="h-6 w-6 text-rose-400 shrink-0 stroke-[2.5] animate-bounce" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 stroke-[2.5]" />
                  )}
                  <span className="text-xs sm:text-sm font-black font-mono tracking-widest text-white">
                    {verdict.title}
                  </span>
                </div>

                <button
                  onClick={() => speakVerdict(verdict.voiceTranscript)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                  title="Listen to AI Verdict"
                >
                  <Volume2 className={`h-4 w-4 ${isSpeaking ? 'text-emerald-400 animate-pulse' : ''}`} />
                </button>
              </div>

              <p className="text-xs text-zinc-200 leading-relaxed font-sans pt-1">
                {verdict.verdictReason}
              </p>
            </div>

            {/* Authenticity vs Bullshit Meters */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-black/50 border border-white/[0.08] text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">BIOLOGICAL AUTHENTICITY:</span>
                  <span className="text-emerald-400 font-bold">{verdict.authenticityScore}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${verdict.authenticityScore}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400">BULLSHIT / AVOIDANCE QUOTIENT:</span>
                  <span className="text-rose-400 font-bold">{verdict.bsScore}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 transition-all duration-700"
                    style={{ width: `${verdict.bsScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Deep Cognitive Deconstruction Grid */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 font-sans text-xs">
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono font-bold text-[10px] uppercase tracking-wider border-b border-white/[0.06] pb-2">
                <Eye className="h-3.5 w-3.5 text-cyan-400" />
                <span>AI COGNITIVE DISSECTION OF YOUR TESTIMONY:</span>
              </div>

              {/* What was claimed vs Unspoken Truth */}
              <div className="space-y-2 text-xs">
                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05]">
                  <strong className="text-zinc-400 font-mono text-[10px] block uppercase">What You Stated:</strong>
                  <p className="text-zinc-200 italic mt-0.5">"{verdict.extractedPremise}"</p>
                </div>

                <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05]">
                  <strong className="text-rose-400 font-mono text-[10px] block uppercase">The Underlying Psychological Reality:</strong>
                  <p className="text-zinc-200 mt-0.5">{verdict.unspokenTruth}</p>
                </div>
              </div>

              {/* Mom vs Boss Perspectives */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                  <strong className="text-emerald-400 font-mono text-[10px] block uppercase">Mom's Protective Directives:</strong>
                  <p className="text-emerald-100 text-[11px] mt-0.5 leading-relaxed">{verdict.momPerspective}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20">
                  <strong className="text-rose-400 font-mono text-[10px] block uppercase">Boss's Iron Standard:</strong>
                  <p className="text-rose-100 text-[11px] mt-0.5 leading-relaxed">{verdict.bossPerspective}</p>
                </div>
              </div>

              {/* Recovery Advice */}
              {verdict.recoveryAdvice && (
                <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-200 text-[11px] leading-relaxed">
                  <strong className="text-amber-400 font-mono text-[10px] block uppercase">Tomorrow's Mandatory Action Plan:</strong>
                  {verdict.recoveryAdvice}
                </div>
              )}
            </div>

            {/* Verdict Impact Details */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <span className="text-zinc-400 block text-[9px]">STREAK STATUS:</span>
                <span className={`font-bold ${verdict.streakProtected ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {verdict.streakProtected ? '🛡️ Protected (0 Days Lost)' : '💥 Reset to 0 Days'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <span className="text-zinc-400 block text-[9px]">XP ADJUSTMENT:</span>
                <span className={`font-bold ${verdict.xpAdjustment === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {verdict.xpAdjustment === 0 ? '⚡ 0 XP Lost (Waived)' : `${verdict.xpAdjustment} XP Deducted`}
                </span>
              </div>
            </div>

            {/* Dismiss & Acknowledge */}
            <button
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-bold text-xs font-mono transition-all border border-white/10"
            >
              Acknowledge Ruling & Close Chamber
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
