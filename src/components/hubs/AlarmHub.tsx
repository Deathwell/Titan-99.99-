import React, { useState, useEffect } from 'react';
import {
  AlarmClock,
  PlusCircle,
  Volume2,
  VolumeX,
  Play,
  Trash2,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  BellRing,
  Sliders,
  Radio,
  BookOpen,
  Dumbbell,
  Shield,
  Activity,
  Flame,
  Coffee,
  Bed,
  Bot,
  Key,
  Mic,
  Cpu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTitan } from '../../context/TitanContext';
import { soundEngine } from '../../lib/audio';
import { neuralVoiceService } from '../../lib/neuralVoiceService';
import {
  AlarmCategory,
  AlarmSoundStyle,
  NeuralVoiceProvider,
  OpenAIVoiceName,
  TacticalAlarm
} from '../../types/titan';

const CATEGORY_ICONS: Record<AlarmCategory, string> = {
  STUDY: '📚',
  WORKOUT: '🏃',
  STRENGTH: '🏋️',
  NUTRITION: '🍕',
  HYDRATION: '💧',
  REST: '🛌',
  FOCUS: '🎯'
};

export const AlarmHub: React.FC = () => {
  const {
    profile,
    alarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    triggerAlarmDirectly,
    updateNeuralVoiceSettings
  } = useTitan();

  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNeuralSettingsOpen, setIsNeuralSettingsOpen] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  // Neural Voice Settings
  const neuralConfig = profile.neuralVoice || {
    provider: 'OPENAI_GPT4O',
    openaiVoice: 'nova',
    studioMasteringEnabled: true
  };

  const [provider, setProvider] = useState<NeuralVoiceProvider>(neuralConfig.provider || 'OPENAI_GPT4O');
  const [openaiKey, setOpenaiKey] = useState(neuralConfig.openaiApiKey || '');
  const [openaiVoice, setOpenaiVoice] = useState<OpenAIVoiceName>(neuralConfig.openaiVoice || 'nova');
  const [elevenKey, setElevenKey] = useState(neuralConfig.elevenlabsApiKey || '');

  // Form states - Tuned for Tony Stark F.R.I.D.A.Y. Female AI Voice (Soothing, Composed, British/Sophisticated)
  const [time24h, setTime24h] = useState('11:00');
  const [label, setLabel] = useState('Institutional Finance Command');
  const [voiceMessage, setVoiceMessage] = useState('Good morning, Operator. It is precisely 11:00 AM. Your institutional finance mastery protocol is now active. Time to dominate the models and outrank the world.');
  const [category, setCategory] = useState<AlarmCategory>('STUDY');
  const [soundStyle, setSoundStyle] = useState<AlarmSoundStyle>('TACTICAL_SIREN');
  const [voicePitch, setVoicePitch] = useState(0.98);
  const [voiceRate, setVoiceRate] = useState(0.94);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveNeuralSettings = () => {
    updateNeuralVoiceSettings({
      provider,
      openaiApiKey: openaiKey.trim(),
      openaiVoice,
      elevenlabsApiKey: elevenKey.trim()
    });
    soundEngine.playQuestComplete();
  };

  const handleTestStudioVoice = async () => {
    setIsTestingVoice(true);
    soundEngine.playClick(900);

    const testMsg = voiceMessage || 'Good morning, Operator. F.R.I.D.A.Y. studio neural voice engine is online and operational.';
    await neuralVoiceService.speakSmartVoice(
      testMsg,
      {
        provider,
        openaiApiKey: openaiKey.trim(),
        openaiVoice,
        elevenlabsApiKey: elevenKey.trim(),
        studioMasteringEnabled: true
      },
      { pitch: voicePitch, rate: voiceRate }
    );

    setIsTestingVoice(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addAlarm({
      time24h,
      label: label || 'Custom Mission Alarm',
      voiceMessage: voiceMessage || `Operator, your mission at ${time24h} has commenced.`,
      category,
      soundStyle,
      voicePitch,
      voiceRate,
      isEnabled: true,
      repeatDaily: true
    });

    soundEngine.playQuestComplete();
    setIsFormOpen(false);
  };

  const applyPreset = (
    presetTime: string,
    presetLabel: string,
    presetMsg: string,
    presetCat: AlarmCategory,
    presetStyle: AlarmSoundStyle
  ) => {
    setTime24h(presetTime);
    setLabel(presetLabel);
    setVoiceMessage(presetMsg);
    setCategory(presetCat);
    setSoundStyle(presetStyle);
    setIsFormOpen(true);
  };

  const formatTo12H = (time24: string) => {
    try {
      const [hStr, mStr] = time24.split(':');
      let h = parseInt(hStr, 10);
      const m = mStr || '00';
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;
      return `${h}:${m} ${ampm}`;
    } catch {
      return time24;
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner: F.R.I.D.A.Y. / J.A.R.V.I.S. AI Voice Command Core */}
      <div className="rounded-2xl border border-titan-cardBorder bg-gradient-to-r from-slate-950 via-slate-900 to-titan-bg p-5 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-titan-cyan shadow-glow-cyan">
                <Bot className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wider">
                    F.R.I.D.A.Y. // GPT-4o HUMAN NEURAL VOICE CORE
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/60 text-cyan-300 font-bold">
                    STUDIO HUMAN QUALITY
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Ultra-natural human voice synthesizer powered by GPT-4o Nova & ElevenLabs with crystalline HUD alerts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Clock Pill */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-titan-cyan/50 bg-slate-950/90 text-xs shadow-glow-cyan">
              <Clock className="h-4 w-4 text-titan-cyan animate-spin-slow" />
              <span className="text-slate-400">CHRONO: </span>
              <strong className="text-white text-sm font-black tracking-widest">{currentTimeStr}</strong>
            </div>

            <button
              onClick={() => setIsNeuralSettingsOpen(!isNeuralSettingsOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-cyan-500/60 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-200 font-bold text-xs transition-all shadow-glow-cyan"
            >
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Voice Engine Settings</span>
              {isNeuralSettingsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-extrabold text-xs transition-all shadow-glow-cyan"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{isFormOpen ? 'Close Protocol' : 'Create Custom Voice Alarm'}</span>
            </button>
          </div>
        </div>

        {/* Neural Engine Configuration Accordion */}
        {isNeuralSettingsOpen && (
          <div className="mt-5 p-5 rounded-2xl border border-cyan-500/50 bg-slate-950/95 shadow-inner animate-in fade-in relative z-10 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="font-bold text-white text-sm">NEURAL VOICE ENGINE (GPT-4o / OPENAI / ELEVENLABS)</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold">100% REAL HUMAN SOUNDING</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">VOICE SYNTHESIZER PROVIDER</label>
                <select
                  value={provider}
                  onChange={e => setProvider(e.target.value as NeuralVoiceProvider)}
                  className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-cyan-400"
                >
                  <option value="OPENAI_GPT4O">🌟 OpenAI GPT-4o (Nova / Shimmer - Recommended)</option>
                  <option value="ELEVENLABS">🎙️ ElevenLabs Ultra-Realistic Human</option>
                  <option value="BROWSER_NATURAL">⚡ Enhanced Browser Natural English</option>
                </select>
              </div>

              {provider === 'OPENAI_GPT4O' && (
                <>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">HUMAN VOICE PERSONA</label>
                    <select
                      value={openaiVoice}
                      onChange={e => setOpenaiVoice(e.target.value as OpenAIVoiceName)}
                      className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-cyan-400"
                    >
                      <option value="nova">🌟 Nova (GPT-4o Official - Warm, Soothing & Commanding Female)</option>
                      <option value="shimmer">✨ Shimmer (Clear, Confident, Expressive Human Female)</option>
                      <option value="alloy">💎 Alloy (Balanced, Modern Human Voice)</option>
                      <option value="onyx">🛡️ Onyx (Deep Commanding Tactical Operator)</option>
                      <option value="fable">📖 Fable (British Storyteller Accent)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-bold flex items-center gap-1">
                      <Key className="h-3 w-3 text-cyan-400" />
                      <span>OPENAI API KEY (FOR GPT-4o TTS-1 STREAMING)</span>
                    </label>
                    <input
                      type="password"
                      placeholder="sk-proj-..."
                      value={openaiKey}
                      onChange={e => setOpenaiKey(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {provider === 'ELEVENLABS' && (
                <div>
                  <label className="text-slate-400 block mb-1 font-bold flex items-center gap-1">
                    <Key className="h-3 w-3 text-cyan-400" />
                    <span>ELEVENLABS API KEY</span>
                  </label>
                  <input
                    type="password"
                    placeholder="xi-..."
                    value={elevenKey}
                    onChange={e => setElevenKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400">
                {openaiKey ? (
                  <span className="text-emerald-400 font-bold">✓ OpenAI API Key Linked. GPT-4o Nova Voice Enabled!</span>
                ) : (
                  <span>Tip: Paste your OpenAI API Key above for 100% human studio quality identical to ChatGPT Voice.</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestStudioVoice}
                  disabled={isTestingVoice}
                  className="px-4 py-1.5 rounded-xl border border-cyan-500 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 font-bold flex items-center gap-1.5 transition-all shadow-glow-cyan"
                >
                  <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{isTestingVoice ? 'Transmitting Voice...' : 'Test Real Human Voice'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveNeuralSettings}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-glow-emerald"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1-Click F.R.I.D.A.Y. Style Presets */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 relative z-10">
          <span className="text-[11px] text-cyan-400 font-bold mr-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> F.R.I.D.A.Y. PRESETS:
          </span>

          <button
            onClick={() => applyPreset('11:00', 'Institutional Finance Command', 'Good morning, Operator. It is precisely 11:00 AM. Your institutional finance mastery protocol is now active. Time to dominate the models and outrank the world.', 'STUDY', 'TACTICAL_SIREN')}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/50 hover:bg-cyan-900 text-cyan-200 text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            📚 11:00 AM Finance Command
          </button>

          <button
            onClick={() => applyPreset('06:30', 'Morning Endurance Protocol', 'Reveille, Operator. 06:30 hours. Initiating your 1-hour aerobic endurance mission. Mitochondrial optimization is now in progress.', 'WORKOUT', 'MILITARY_KLAXON')}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-200 text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            🏃 06:30 AM Endurance Reveille
          </button>

          <button
            onClick={() => applyPreset('17:00', 'Heavy Strength Battle Stations', 'Combat readiness alert. It is 17:00 hours. Initiating heavy compound resistance protocol. Let us forge maximum relative power.', 'STRENGTH', 'NEON_ARCADIA')}
            className="px-3 py-1.5 rounded-lg bg-purple-950/70 border border-purple-500/50 hover:bg-purple-900 text-purple-200 text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            🏋️ 05:00 PM Strength Protocol
          </button>

          <button
            onClick={() => applyPreset('22:30', 'Guilt-Free Nightly Reward Protocol', 'Daily protocol executed with 100% efficiency. It is 22:30 hours. Your guilt-free nightly reward is now unlocked. Decompress and enjoy, Operator.', 'REST', 'SUB_BASS_PULSE')}
            className="px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/50 hover:bg-amber-900 text-amber-200 text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            🛌 10:30 PM Nightly Reward
          </button>
        </div>
      </div>

      {/* Alarm Creation Form Accordion */}
      {isFormOpen && (
        <form
          onSubmit={handleFormSubmit}
          className="rounded-2xl border-2 border-cyan-500/60 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 shadow-glow-cyan backdrop-blur-2xl animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="h-4 w-4 text-titan-cyan" /> CONFIGURE F.R.I.D.A.Y. VOICE COMMAND ALARM
            </h3>
            <span className="text-xs text-cyan-300 font-bold">SOOTHING & COMMANDING HUMAN AI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-bold">ALARM TIME (24H / 12H)</label>
              <input
                type="time"
                value={time24h}
                onChange={e => setTime24h(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white font-black text-sm focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[10px] text-cyan-300 mt-1 block">Formatted: {formatTo12H(time24h)}</span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-bold">PROTOCOL LABEL</label>
              <input
                type="text"
                placeholder="e.g. Institutional Finance Command"
                value={label}
                onChange={e => setLabel(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white font-bold focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-bold">PILLAR CATEGORY</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as AlarmCategory)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:border-cyan-500 focus:outline-none font-bold"
              >
                <option value="STUDY">📚 Study / Finance Drill</option>
                <option value="WORKOUT">🏃 Endurance / Cardio</option>
                <option value="STRENGTH">🏋️ Heavy Strength</option>
                <option value="NUTRITION">🍕 Nutrition / Meal</option>
                <option value="HYDRATION">💧 Bio-hack / Hydration</option>
                <option value="REST">🛌 Nightly Reward & Rest</option>
                <option value="FOCUS">🎯 Focus Mission</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-bold">HOLOGRAPHIC CHIME STYLE</label>
              <select
                value={soundStyle}
                onChange={e => setSoundStyle(e.target.value as AlarmSoundStyle)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:border-cyan-500 focus:outline-none font-bold"
              >
                <option value="TACTICAL_SIREN">✨ Holographic Harmonic Alert</option>
                <option value="MILITARY_KLAXON">📯 Dual-Tone Battle Pulse</option>
                <option value="NEON_ARCADIA">⚡ Neon Cyber Chime</option>
                <option value="SUB_BASS_PULSE">🫀 Sub-Bass Deep Pulse</option>
              </select>
            </div>
          </div>

          {/* Custom F.R.I.D.A.Y. Voice Message */}
          <div className="mt-4">
            <label className="text-slate-300 block mb-1 text-xs font-bold flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
              <span>SPOKEN F.R.I.D.A.Y. VOICE COMMAND (HUMAN CADENCE):</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Good morning, Operator. It is 11 AM. Time to dominate the models and outrank the world."
              value={voiceMessage}
              onChange={e => setVoiceMessage(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none font-sans"
            />
          </div>

          {/* Voice Tuning Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>CADENCE / RATE (F.R.I.D.A.Y. Optimal: 0.94x)</span>
                <span className="text-cyan-300 font-bold">{voiceRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.02"
                value={voiceRate}
                onChange={e => setVoiceRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>TONE / PITCH (F.R.I.D.A.Y. Optimal: 0.98x)</span>
                <span className="text-cyan-300 font-bold">{voicePitch.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.02"
                value={voicePitch}
                onChange={e => setVoicePitch(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleTestStudioVoice}
              className="px-4 py-2.5 rounded-xl border border-cyan-500/60 bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-200 font-bold text-xs flex items-center gap-2 transition-all shadow-glow-cyan"
            >
              <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span>Test F.R.I.D.A.Y. Studio Voice</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white font-black text-xs shadow-glow-cyan transition-all transform active:scale-95"
              >
                Arm Protocol
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Alarms Grid */}
      <div className="rounded-2xl border border-titan-cardBorder bg-titan-surface/80 p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="h-4 w-4 text-titan-cyan" /> ARMED VOICE COMMAND PROTOCOLS ({alarms.length})
            </h3>
            <span className="text-xs text-cyan-300 font-mono">
              {alarms.filter(a => a.isEnabled).length} ARMED // {alarms.filter(a => !a.isEnabled).length} SILENT ON STANDBY
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alarms.forEach(a => updateAlarm(a.id, { isEnabled: false }));
              }}
              className="px-3 py-1 rounded-lg border border-rose-800/60 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold transition-all"
            >
              🔇 Silence All (Standby)
            </button>
            <button
              onClick={() => {
                alarms.forEach(a => updateAlarm(a.id, { isEnabled: true }));
              }}
              className="px-3 py-1 rounded-lg border border-emerald-800/60 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-bold transition-all"
            >
              ⚡ Arm All
            </button>
          </div>
        </div>

        {alarms.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {alarms.map(alarm => {
              return (
                <div
                  key={alarm.id}
                  className={`rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between group ${
                    alarm.isEnabled
                      ? 'border-cyan-500/50 bg-gradient-to-b from-cyan-950/20 via-slate-900/80 to-titan-bg shadow-glow-cyan'
                      : 'border-slate-800/80 bg-titan-card/40 opacity-60'
                  }`}
                >
                  <div>
                    {/* Top Row: Time & Category */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{CATEGORY_ICONS[alarm.category] || '⏰'}</span>
                        <div>
                          <div className="text-2xl font-black text-white font-mono tracking-tight flex items-baseline gap-1.5">
                            <span>{alarm.time24h}</span>
                            <span className="text-xs text-cyan-400 font-bold">({formatTo12H(alarm.time24h)})</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-200 mt-0.5">{alarm.label}</h4>
                        </div>
                      </div>

                      {/* Enable/Disable Toggle Switch */}
                      <button
                        onClick={() => updateAlarm(alarm.id, { isEnabled: !alarm.isEnabled })}
                        className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                          alarm.isEnabled
                            ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 shadow-glow-emerald'
                            : 'bg-slate-800 border border-slate-700 text-slate-500'
                        }`}
                      >
                        {alarm.isEnabled ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                        <span>{alarm.isEnabled ? 'ARMED' : 'STANDBY'}</span>
                      </button>
                    </div>

                    {/* Spoken Voice Message Box */}
                    <div className="mt-4 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs shadow-inner">
                      <div className="text-[10px] text-cyan-400 font-bold flex items-center gap-1 mb-1 tracking-wider uppercase">
                        <Bot className="h-3 w-3 text-cyan-400" /> F.R.I.D.A.Y. VOICE COMMAND:
                      </div>
                      <p className="text-slate-100 font-sans leading-relaxed text-[13px]">
                        "{alarm.voiceMessage}"
                      </p>
                    </div>

                    {/* Sound Style Tag */}
                    <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                        {alarm.soundStyle.replace(/_/g, ' ')}
                      </span>
                      <span>•</span>
                      <span>Daily Protocol</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => triggerAlarmDirectly(alarm)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500 hover:bg-cyan-900 text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-glow-cyan"
                    >
                      <Play className="h-3 w-3" />
                      <span>Trigger F.R.I.D.A.Y. Live</span>
                    </button>

                    <button
                      onClick={() => deleteAlarm(alarm.id)}
                      className="p-1.5 rounded-lg border border-slate-800 hover:border-rose-700 text-slate-400 hover:text-rose-400 transition-all"
                      title="Delete Alarm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500 font-mono">
            No alarms armed. Click "Create Custom Voice Alarm" or use the quick F.R.I.D.A.Y. presets above!
          </div>
        )}
      </div>
    </div>
  );
};
