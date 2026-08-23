import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { EXCUSE_CATEGORIES, evaluateExcuse } from '../../lib/excuseJudgeEngine';
import { ExcuseCategory, ExcuseVerdict, TribunalCase } from '../../types/titan';
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
  const [verdict, setVerdict] = useState<ExcuseVerdict | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

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

  const handleSubmitCase = async () => {
    if (!explanation.trim()) {
      soundEngine.playAlert();
      return;
    }

    setIsAnalyzing(true);
    soundEngine.playClick(600);

    // Dramatic 1.8s AI deliberation delay
    setTimeout(() => {
      const result = evaluateExcuse(selectedCategory, explanation, profile.callsign || 'OPERATOR');
      setVerdict(result);
      setIsAnalyzing(false);

      // Apply verdict to state
      applyTribunalVerdict(selectedCategory, explanation, result);

      // Play audio effect
      if (result.verdictType === 'PARDON_GRANTED') {
        soundEngine.playMilestoneFanfare();
      } else if (result.verdictType === 'BULLSHIT_REJECTED') {
        soundEngine.playAlert();
      } else {
        soundEngine.playQuestComplete();
      }

      // Voice verdict
      speakVerdict(result.voiceTranscript);
    }, 1800);
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
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/[0.1] bg-[#0a0a10]/98 p-5 sm:p-7 shadow-2xl space-y-5 text-white"
      >
        {/* Top Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute right-4 top-4 p-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-sm">
            <Scale className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/40">
                MOM + BOSS AI TRIBUNAL
              </span>
              <span className="text-xs font-mono font-bold text-zinc-400">
                ACCOUNTABILITY COURT
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
              The AI Excuse Judgment Chamber
            </h2>
          </div>
        </div>

        {/* Form View (Before Verdict) */}
        {!verdict && !isAnalyzing && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-300 leading-relaxed font-sans">
              <p>
                Did you fail to execute your daily protocol? State your exact reason to the AI Judge.
                <strong className="text-emerald-300 block mt-1">
                  • Biological crises / genuine medical emergencies receive a 24-Hour Pardon.
                </strong>
                <strong className="text-rose-400 block mt-0.5">
                  • Procrastination, fatigue, and weak rationalizations receive a Bullshit Verdict + penalty.
                </strong>
              </p>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                1. SELECT EXCUSE CATEGORY:
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
                  2. EXPLAIN EXACTLY WHAT HAPPENED:
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
                placeholder="Be completely honest with the AI. State the symptoms, events, or decisions that led to your absence..."
                rows={4}
                className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 transition-colors font-sans leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitCase}
              disabled={!explanation.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs font-mono tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Gavel className="h-4 w-4" />
              <span>SUBMIT STATEMENT TO AI JUDGE</span>
            </button>
          </div>
        )}

        {/* Deliberation / Analyzing State */}
        {isAnalyzing && (
          <div className="py-12 text-center space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <div className="h-20 w-20 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
              <Scale className="h-8 w-8 text-rose-400 absolute animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-mono">
                AI JUDGE DELIBERATING...
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1 animate-pulse">
                Evaluating biological markers, authenticity, and discipline standards...
              </p>
            </div>
          </div>
        )}

        {/* Verdict Screen */}
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

            {/* Reality Check Transcript */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-1.5 font-mono text-xs">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                JUDGE'S OFFICIAL RULING:
              </span>
              <p className="text-zinc-200 italic font-sans text-xs leading-relaxed">
                "{verdict.realityCheck}"
              </p>

              {verdict.recoveryAdvice && (
                <div className="pt-2 mt-2 border-t border-white/[0.06] text-[11px] text-emerald-300 font-sans">
                  <strong>Mom's Recovery Order:</strong> {verdict.recoveryAdvice}
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
              Acknowledge Verdict & Close Chamber
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
