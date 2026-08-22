import React, { useState, useEffect } from 'react';
import {
  Shield,
  Dumbbell,
  LineChart,
  Target,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';
import { triggerGlobalConfetti } from '../effects/ConfettiCanvas';

export const WelcomeOnboardingModal: React.FC = () => {
  const { profile, updateProfile } = useTitan();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [callsign, setCallsign] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<string>('SHREDDED');

  useEffect(() => {
    const hasCompleted = localStorage.getItem('titan_onboarding_completed');
    if (!hasCompleted) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  const goals = [
    {
      id: 'SHREDDED',
      title: 'Physique & Longevity',
      desc: 'Sub-10% body fat, elite VO2 Max & peak aesthetics',
      icon: Dumbbell,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'WEALTH',
      title: 'Financial Sovereignty',
      desc: 'Top 0.1% net worth, quant modeling & compounding',
      icon: LineChart,
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'DISCIPLINE',
      title: 'Titanium Discipline',
      desc: 'Zero-excuse daily execution & unbroken streaks',
      icon: Target,
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  const handleFinish = (e: React.MouseEvent) => {
    updateProfile({
      callsign: callsign.trim() || 'Operator-01'
    });
    localStorage.setItem('titan_onboarding_completed', 'true');
    setIsOpen(false);
    triggerGlobalConfetti(e.clientX, e.clientY);
    soundEngine.playMilestoneFanfare();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.12] bg-[#080b14] p-6 sm:p-8 text-center relative overflow-hidden shadow-[0_0_80px_rgba(0,242,254,0.15)]">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        {/* Step 1: Welcome & Value Prop */}
        {step === 1 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-glow-cyan">
              <Shield className="h-8 w-8 text-black stroke-[2.5]" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase font-mono">
                WELCOME TO TITAN
              </span>
              <h2 className="text-2xl font-black text-white mt-1 tracking-tight">
                Outrank 99.9% of Humans
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
                A streamlined daily operating system for your body, wealth, and relentless daily discipline.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Flame className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-white block">Daily Streak</span>
                <span className="text-[9px] text-slate-500">Unbroken</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Sparkles className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-white block">AI Scanner</span>
                <span className="text-[9px] text-slate-500">Body Fat</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-white block">3 Habits</span>
                <span className="text-[9px] text-slate-500">Per Day</span>
              </div>
            </div>

            <button
              onClick={() => {
                setStep(2);
                soundEngine.playClick(900);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs shadow-glow-cyan flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Choose Primary Goal */}
        {step === 2 && (
          <div className="space-y-5 animate-in zoom-in-95 duration-300">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase font-mono">
                STEP 1 OF 2
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">
                What is your #1 focus?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                We will optimize your daily habits around this goal.
              </p>
            </div>

            <div className="space-y-2.5">
              {goals.map(g => {
                const Icon = g.icon;
                const isSelected = selectedGoal === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => {
                      setSelectedGoal(g.id);
                      soundEngine.playClick(800);
                    }}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent border-cyan-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${g.color} text-white shrink-0 shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{g.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{g.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setStep(3);
                soundEngine.playClick(900);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs shadow-glow-cyan flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 3: Choose Name / Callsign */}
        {step === 3 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase font-mono">
                STEP 2 OF 2
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">
                Enter Your Operator Name
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                This will appear on your daily leaderboard and story flex cards.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={callsign}
                onChange={e => setCallsign(e.target.value)}
                placeholder="e.g. Aryan, Ghost, Maverick"
                className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.12] text-white text-center text-sm font-bold placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                autoFocus
              />
              <span className="text-[10px] text-slate-500 block">
                Leave blank to default to "{profile.callsign || 'Operator-01'}"
              </span>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-extrabold text-xs shadow-glow-emerald flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className="h-4 w-4" /> Start My Protocol
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
