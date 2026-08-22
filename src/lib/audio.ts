/**
 * Web Audio API Tactical Sound Synthesizer & FRIDAY/JARVIS English AI Voice Annunciator
 * High-tech UI blips, holographic HUD pings, alarm sirens, and strictly English SpeechSynthesis.
 */

import { AlarmSoundStyle } from '../types/titan';

class TacticalSoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private alarmOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private isSpeakingAlarm: boolean = false;
  private speechLoopInterval: number | null = null;
  private cachedEnglishVoices: SpeechSynthesisVoice[] = [];
  private selectedVoiceUri: string | null = null;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const load = () => {
        const allVoices = window.speechSynthesis.getVoices();
        this.cachedEnglishVoices = allVoices.filter(v => 
          v.lang && (v.lang.toLowerCase().startsWith('en') || v.lang.toLowerCase().startsWith('en-'))
        );
      };

      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAlarm();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setSelectedVoiceUri(uri: string | null) {
    this.selectedVoiceUri = uri;
  }

  public getAvailableEnglishVoices(): SpeechSynthesisVoice[] {
    if (this.cachedEnglishVoices.length === 0 && 'speechSynthesis' in window) {
      this.cachedEnglishVoices = window.speechSynthesis.getVoices().filter(v => 
        v.lang && (v.lang.toLowerCase().startsWith('en') || v.lang.toLowerCase().startsWith('en-'))
      );
    }
    return this.cachedEnglishVoices;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playClick(freq = 880) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Ignore
    }
  }

  public playJarvisHudPing() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [880.0, 1318.51, 1760.0];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.04);

        gain.gain.setValueAtTime(0.12 / (idx + 1), now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.36);
      });
    } catch {
      // Ignore
    }
  }

  public playQuestComplete() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.26);
      });
    } catch {
      // Ignore
    }
  }

  public playMilestoneFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { f: 440.0, d: 0.1 },
        { f: 554.37, d: 0.1 },
        { f: 659.25, d: 0.1 },
        { f: 880.0, d: 0.4 }
      ];

      let offset = 0;
      notes.forEach(({ f, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now + offset);

        osc.frequency.setValueAtTime(f, now + offset);

        gain.gain.setValueAtTime(0.08, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + d);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + d + 0.05);
        offset += d * 0.8;
      });
    } catch {
      // Ignore
    }
  }

  public playLevelUp() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [329.63, 440, 554.37, 659.25, 880, 1108.73];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.1, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  public playAlert() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [0, 0.12].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now + offset);

        gain.gain.setValueAtTime(0.08, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
    } catch {
      // Ignore
    }
  }

  public playAlarmSound(style: AlarmSoundStyle = 'TACTICAL_SIREN') {
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopAlarmSoundOnly();

    try {
      if (style === 'TACTICAL_SIREN') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';

        const now = ctx.currentTime;
        osc1.frequency.setValueAtTime(587.33, now);
        osc2.frequency.setValueAtTime(880.0, now);

        for (let i = 0; i < 20; i++) {
          osc1.frequency.linearRampToValueAtTime(880, now + i * 1.0 + 0.5);
          osc1.frequency.linearRampToValueAtTime(587.33, now + i * 1.0 + 1.0);
          osc2.frequency.linearRampToValueAtTime(1174.66, now + i * 1.0 + 0.5);
          osc2.frequency.linearRampToValueAtTime(880, now + i * 1.0 + 1.0);
        }

        gain.gain.setValueAtTime(0.18, now);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        this.alarmOscillators.push({ osc: osc1, gain });
        this.alarmOscillators.push({ osc: osc2, gain });
      } else if (style === 'MILITARY_KLAXON') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'square';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime);

        const now = ctx.currentTime;
        for (let i = 0; i < 30; i++) {
          gain.gain.setValueAtTime(0.16, now + i * 0.5);
          gain.gain.setValueAtTime(0.01, now + i * 0.5 + 0.3);
        }

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        this.alarmOscillators.push({ osc: osc1, gain });
        this.alarmOscillators.push({ osc: osc2, gain });
      } else if (style === 'NEON_ARCADIA') {
        const freqs = [587.33, 739.99, 880.0, 1174.66, 1479.98];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';

        const now = ctx.currentTime;
        for (let i = 0; i < 40; i++) {
          const f = freqs[i % freqs.length];
          osc.frequency.setValueAtTime(f, now + i * 0.14);
        }

        gain.gain.setValueAtTime(0.16, now);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        this.alarmOscillators.push({ osc, gain });
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, ctx.currentTime);

        const now = ctx.currentTime;
        for (let i = 0; i < 20; i++) {
          gain.gain.setValueAtTime(0.28, now + i * 0.7);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.7 + 0.45);
        }

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        this.alarmOscillators.push({ osc, gain });
      }
    } catch {
      // Ignore
    }
  }

  public stopAlarmSoundOnly() {
    this.alarmOscillators.forEach(({ osc, gain }) => {
      try {
        if (this.ctx) {
          gain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Ignore
      }
    });
    this.alarmOscillators = [];
  }

  public getBestFridayVoice(): SpeechSynthesisVoice | null {
    if (!('speechSynthesis' in window)) return null;

    const voices = this.getAvailableEnglishVoices();
    if (!voices || voices.length === 0) return null;

    if (this.selectedVoiceUri) {
      const found = voices.find(v => v.voiceURI === this.selectedVoiceUri);
      if (found) return found;
    }

    const britishFemale = voices.find(v => {
      const isGB = v.lang.toLowerCase() === 'en-gb' || v.lang.toLowerCase().startsWith('en-gb');
      const name = v.name.toLowerCase();
      const isFemale = name.includes('sonia') || name.includes('mia') || name.includes('libby') || 
                       name.includes('hazel') || name.includes('female') || name.includes('natural') || 
                       name.includes('google uk english female') || !name.includes('male');
      return isGB && isFemale;
    });
    if (britishFemale) return britishFemale;

    const anyBritish = voices.find(v => v.lang.toLowerCase().startsWith('en-gb'));
    if (anyBritish) return anyBritish;

    const usFemale = voices.find(v => {
      const isEn = v.lang.toLowerCase().startsWith('en');
      const name = v.name.toLowerCase();
      const isFemale = name.includes('jenny') || name.includes('samantha') || name.includes('victoria') || 
                       name.includes('aria') || name.includes('karen') || name.includes('zira') || 
                       name.includes('female') || name.includes('natural');
      return isEn && isFemale;
    });
    if (usFemale) return usFemale;

    const anyEnglish = voices.find(v => v.lang.toLowerCase().startsWith('en'));
    return anyEnglish || null;
  }

  public speakVoiceMessage(
    text: string,
    options: { pitch?: number; rate?: number; volume?: number; loop?: boolean; voiceUri?: string } = {}
  ) {
    if (!('speechSynthesis' in window)) return;

    this.stopSpeaking();
    this.playJarvisHudPing();

    const pitch = options.pitch ?? 0.98;
    const rate = options.rate ?? 0.94;
    const volume = options.volume ?? 1.0;

    const speak = () => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'en-US'; 
      utterance.pitch = pitch;
      utterance.rate = rate;
      utterance.volume = volume;

      const voice = options.voiceUri 
        ? (this.getAvailableEnglishVoices().find(v => v.voiceURI === options.voiceUri) || this.getBestFridayVoice())
        : this.getBestFridayVoice();

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || 'en-US';
      }

      window.speechSynthesis.speak(utterance);
    };

    setTimeout(() => {
      speak();
    }, 150);

    if (options.loop) {
      this.isSpeakingAlarm = true;
      this.speechLoopInterval = window.setInterval(() => {
        if (this.isSpeakingAlarm) {
          this.playJarvisHudPing();
          setTimeout(() => {
            if (this.isSpeakingAlarm) speak();
          }, 150);
        }
      }, 7500);
    }
  }

  public stopSpeaking() {
    this.isSpeakingAlarm = false;
    if (this.speechLoopInterval) {
      clearInterval(this.speechLoopInterval);
      this.speechLoopInterval = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public stopAlarm() {
    this.stopAlarmSoundOnly();
    this.stopSpeaking();
  }
}

export const soundEngine = new TacticalSoundEngine();
