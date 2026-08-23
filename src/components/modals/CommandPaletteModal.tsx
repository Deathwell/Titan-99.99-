import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Dumbbell,
  LineChart,
  Moon,
  AlarmClock,
  Eye,
  CheckCircle2,
  Gift,
  Settings,
  Flame,
  Shield,
  TrendingUp,
  X,
  ArrowRight,
  Zap,
  Sparkles,
  Command,
  Scale
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';

interface CommandItem {
  id: string;
  category: 'PROTOCOLS' | 'NAVIGATION' | 'SYSTEM' | 'REWARDS';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({ isOpen, onClose }) => {
  const {
    setActiveTab,
    openAlarmsTab,
    setIsSettingsOpen,
    setIsSyncModalOpen,
    setDailyTaskDuration,
    toggleDailyAccomplishment,
    openTribunalModal
  } = useTitan();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const allCommands: CommandItem[] = [
    {
      id: 'nav-today',
      category: 'NAVIGATION',
      title: 'Today • Operator Cockpit',
      subtitle: 'View daily habits, live countdown timer, and rank telemetry',
      icon: TrendingUp,
      iconColor: 'text-rose-400',
      action: () => {
        setActiveTab('overview');
        onClose();
      },
      shortcut: '1'
    },
    {
      id: 'nav-alarms',
      category: 'NAVIGATION',
      title: 'Tactical Alarms & Schedule',
      subtitle: 'Directly configure wake-up calls and non-negotiable protocol alarms',
      icon: AlarmClock,
      iconColor: 'text-amber-400',
      action: () => {
        openAlarmsTab();
        onClose();
      }
    },
    {
      id: 'nav-scanner',
      category: 'NAVIGATION',
      title: 'Neural Body Fat Morph Scanner',
      subtitle: 'Simulate 8% to 58% body fat transformations with AI',
      icon: Eye,
      iconColor: 'text-rose-400',
      action: () => {
        setActiveTab('hologram');
        onClose();
      },
      shortcut: '2'
    },
    {
      id: 'nav-quests',
      category: 'NAVIGATION',
      title: 'Daily Quests & Badge Wall',
      subtitle: 'Track milestones, claim prestige titles and Operator badges',
      icon: CheckCircle2,
      iconColor: 'text-purple-400',
      action: () => {
        setActiveTab('quests');
        onClose();
      },
      shortcut: '3'
    },
    {
      id: 'nav-charts',
      category: 'NAVIGATION',
      title: 'Global Bell Curves & Analytics',
      subtitle: 'View global percentile distributions across 8B contenders',
      icon: LineChart,
      iconColor: 'text-rose-400',
      action: () => {
        setActiveTab('charts');
        onClose();
      },
      shortcut: '4'
    },
    {
      id: 'proto-workout-60',
      category: 'PROTOCOLS',
      title: 'Log 60m Physical Workout',
      subtitle: 'Quick log 1 hour compound strength or aerobic stamina (+90 XP)',
      icon: Dumbbell,
      iconColor: 'text-rose-400',
      action: () => {
        setDailyTaskDuration('STRENGTH', 60);
        setActiveTab('overview');
        onClose();
      }
    },
    {
      id: 'proto-finance-60',
      category: 'PROTOCOLS',
      title: 'Log 60m Financial Modeling',
      subtitle: 'Quick log 1 hour LBO & capital market analysis (+90 XP)',
      icon: LineChart,
      iconColor: 'text-amber-400',
      action: () => {
        setDailyTaskDuration('MODELING', 60);
        setActiveTab('overview');
        onClose();
      }
    },
    {
      id: 'proto-sleep',
      category: 'PROTOCOLS',
      title: 'Toggle 8-Hour Sleep Protocol',
      subtitle: 'Mark today\'s optimal sleep hygiene and hydration (+50 XP)',
      icon: Moon,
      iconColor: 'text-rose-300',
      action: () => {
        toggleDailyAccomplishment('QUANT');
        setActiveTab('overview');
        onClose();
      }
    },
    {
      id: 'sys-settings',
      category: 'SYSTEM',
      title: 'Operator Settings & Callsign',
      subtitle: 'Edit biometric profile, sound effects, and API keys',
      icon: Settings,
      iconColor: 'text-zinc-400',
      action: () => {
        setIsSettingsOpen(true);
        onClose();
      }
    },
    {
      id: 'sys-sync',
      category: 'SYSTEM',
      title: 'Multi-Device Cloud Sync',
      subtitle: 'Sync real-time progress to your mobile phone or laptop',
      icon: Zap,
      iconColor: 'text-emerald-400',
      action: () => {
        setIsSyncModalOpen(true);
        onClose();
      }
    },
    {
      id: 'sys-tribunal',
      category: 'SYSTEM',
      title: 'Face AI Judge (Mom + Boss Tribunal)',
      subtitle: 'Submit excuse or medical emergency appeal to AI Judge',
      icon: Scale,
      iconColor: 'text-amber-400',
      action: () => {
        openTribunalModal();
        onClose();
      }
    }
  ];

  // Filter commands by search term
  const filteredCommands = allCommands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation within the command palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
      soundEngine.playClick(600);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      soundEngine.playClick(600);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      if (selected) {
        soundEngine.playClick(880);
        selected.action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      {/* Click backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Command Palette Capsule */}
      <div
        className="relative w-full max-w-xl bg-[#0e0e13]/98 border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden z-10 font-sans"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-black/40">
          <Search className="h-4 w-4 text-rose-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search protocols..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-medium"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="p-1 text-zinc-500 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[10px] text-zinc-400 font-mono">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              No matching protocols or commands found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    soundEngine.playClick(880);
                    cmd.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-rose-500/15 border border-rose-500/30 text-white'
                      : 'hover:bg-white/[0.04] text-zinc-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] ${cmd.iconColor} shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate text-white">
                        {cmd.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 block truncate">
                        {cmd.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[10px] text-zinc-400 font-mono">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={`h-3.5 w-3.5 transition-transform ${isSelected ? 'text-rose-400 translate-x-0.5' : 'text-zinc-600'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-t border-white/[0.06] text-[10px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <span className="text-rose-400/80 font-bold">TITAN ⌘K SEARCH</span>
        </div>
      </div>
    </div>
  );
};
