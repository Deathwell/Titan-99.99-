import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Gamepad2,
  Tv,
  Users,
  Pizza,
  Flame,
  Bed,
  PenTool,
  CheckCircle2,
  X,
  Zap,
  Award
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { NightlyRewardKey } from '../../types/titan';

interface RewardOption {
  key: NightlyRewardKey;
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
}

const REWARD_OPTIONS: RewardOption[] = [
  {
    key: 'GAMING',
    icon: '🎮',
    title: 'UNRESTRICTED GAMING NIGHT',
    subtitle: 'PC / Console / Strategy / High Focus',
    badge: '100% GUILT-FREE',
    description: 'Immerse in your favorite game without an ounce of procrastination guilt. You paid the daily price of discipline.'
  },
  {
    key: 'MEDIA',
    icon: '🎬',
    title: 'CINEMA & MEDIA IMMERSION',
    subtitle: 'Movies, Series Binge, Anime & YouTube',
    badge: 'ZERO ANXIETY',
    description: 'Kick back, decompress, and binge whatever show or film you desire with your mind completely clear.'
  },
  {
    key: 'OUTSIDE_FOOD',
    icon: '🍕',
    title: 'OUTSIDE FOOD / FEAST CHEAT MEAL',
    subtitle: 'Pizza, Burgers, High-Calorie Indulgence',
    badge: 'EARNED CALORIES',
    description: 'Order whatever meal or dessert you crave tonight. Your metabolism and work capacity earned every calorie.'
  },
  {
    key: 'SOCIAL_HANGOUT',
    icon: '🍻',
    title: 'NIGHT OUT & HANGOUT WITH FRIENDS',
    subtitle: 'Bars, Parties, Dinners & Social Connection',
    badge: 'SOCIAL ENERGY',
    description: 'Step away from the terminal and connect with your crew. Relish the night knowing your day was dominated.'
  },
  {
    key: 'PLEASURE_RELEASE',
    icon: '🔞',
    title: 'SENSORY PLEASURE & INTIMACY RELEASE',
    subtitle: 'Solitary Masturbation / Pure Dopamine Relief',
    badge: 'ZERO REGRET',
    description: 'Indulge in pure physical dopamine release and tension relief. Zero post-nut guilt because your discipline was 100% executed.'
  },
  {
    key: 'DEEP_REST',
    icon: '🛌',
    title: 'UNAPOLOGETIC DEEP SLEEP & SLUMBER',
    subtitle: 'Early Bed, Zero Screens & Total Rejuvenation',
    badge: 'TITAN RECOVERY',
    description: 'Shut down all stimulation early. Recharge your neural pathways and muscle fibers for tomorrow’s conquest.'
  },
  {
    key: 'CUSTOM',
    icon: '✍️',
    title: 'CUSTOM NIGHTLY INDULGENCE',
    subtitle: 'Choose Your Own Specific Reward',
    badge: 'OPERATOR CHOICE',
    description: 'Write in whatever unique celebration you desire for tonight.'
  }
];

export const VictoryRewardModal: React.FC = () => {
  const { isVictoryModalOpen, closeVictoryModal, claimNightlyReward, todayRewardClaim } = useTitan();

  const [selectedKey, setSelectedKey] = useState<NightlyRewardKey>(todayRewardClaim?.rewardKey || 'GAMING');
  const [customNote, setCustomNote] = useState<string>(todayRewardClaim?.customNote || '');

  if (!isVictoryModalOpen) return null;

  const handleClaim = () => {
    claimNightlyReward(selectedKey, selectedKey === 'CUSTOM' ? customNote : undefined);
    closeVictoryModal();
  };

  const currentOption = REWARD_OPTIONS.find(o => o.key === selectedKey) || REWARD_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in font-mono">
      <div className="relative w-full max-w-3xl rounded-3xl border border-purple-500/60 bg-gradient-to-b from-titan-surface via-slate-950 to-titan-bg p-6 sm:p-8 shadow-glow-purple text-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Top Victory Beacon Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-950/80 border border-purple-400 text-purple-300 shadow-glow-purple">
              <Trophy className="h-6 w-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500 text-purple-300 text-[10px] font-black tracking-widest">
                  100% PROTOCOL EXECUTED
                </span>
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> GAINS SECURED
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1 tracking-wider">
                DAILY CONQUEST COMPLETE // CHOOSE TONIGHT'S REWARD
              </h2>
            </div>
          </div>

          <button
            onClick={closeVictoryModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Motivational Victory Quote */}
        <div className="mt-4 p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 font-sans leading-relaxed flex items-center gap-3">
          <Award className="h-5 w-5 text-purple-400 shrink-0" />
          <span>
            You have executed every single mission for today. Your discipline streak is preserved and your percentile is locked. <strong>You have earned tonight’s reward guilt-free.</strong> What are you feeling tonight?
          </span>
        </div>

        {/* Selectable Reward Cards Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {REWARD_OPTIONS.map(option => {
            const isSelected = selectedKey === option.key;

            return (
              <div
                key={option.key}
                onClick={() => setSelectedKey(option.key)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between relative group ${
                  isSelected
                    ? 'border-purple-400 bg-purple-950/50 shadow-glow-purple scale-[1.02]'
                    : 'border-slate-800 bg-titan-card/70 hover:border-slate-600 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{option.icon}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        isSelected
                          ? 'bg-purple-900 border border-purple-400 text-purple-200'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {option.badge}
                    </span>
                  </div>

                  <h3 className={`text-xs font-bold mt-2.5 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {option.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 font-sans mt-1 leading-snug">
                    {option.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className={isSelected ? 'text-purple-300 font-bold' : 'text-slate-500'}>
                    {isSelected ? '✓ Selected Tonight' : 'Click to Pick'}
                  </span>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-purple-400" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Note write-in if CUSTOM selected */}
        {selectedKey === 'CUSTOM' && (
          <div className="mt-4 p-4 rounded-xl border border-purple-500/40 bg-slate-900/90 animate-in fade-in">
            <label className="text-xs text-purple-300 font-bold block mb-1">
              SPECIFY YOUR CUSTOM NIGHTLY INDULGENCE:
            </label>
            <input
              type="text"
              placeholder="e.g. Late night drive with music, building my side passion project, acoustic guitar session..."
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
            />
          </div>
        )}

        {/* Bottom Claim Action Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs">
            <span className="text-slate-400">Selected Reward: </span>
            <strong className="text-white font-bold">{currentOption.icon} {currentOption.title}</strong>
          </div>

          <button
            onClick={handleClaim}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white font-extrabold text-xs shadow-glow-purple flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Zap className="h-4 w-4" />
            <span>CLAIM REWARD & ENJOY TONIGHT GUILT-FREE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
