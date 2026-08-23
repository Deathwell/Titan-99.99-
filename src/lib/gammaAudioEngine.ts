// Continuous 40Hz Gamma Harmonic Musical Synthesizer
// Procedural Web Audio Engine: Warm polyphonic ambient pads, ethereal chimes, and 40Hz gamma entrainment

export type GammaPreset = 'CYBER_PADS' | 'ETHEREAL_CHIMES' | 'INTERSTELLAR_DRONE';

export interface GammaPresetConfig {
  name: string;
  description: string;
  padFilterCutoff: number;
  melodyIntervalMs: number;
  melodyVolume: number;
  subBassGain: number;
  binauralGain: number;
}

export const GAMMA_PRESETS: Record<GammaPreset, GammaPresetConfig> = {
  CYBER_PADS: {
    name: 'Blade Runner Cyber Chords',
    description: 'Lush, warm Hans Zimmer ambient synth chords in D-Minor with embedded 40Hz sub-pulse.',
    padFilterCutoff: 420,
    melodyIntervalMs: 3800,
    melodyVolume: 0.25,
    subBassGain: 0.45,
    binauralGain: 0.30
  },
  ETHEREAL_CHIMES: {
    name: 'Ethereal Glass Chimes & Strings',
    description: 'Serene meditative pentatonic chimes over breathing warm harmonic strings.',
    padFilterCutoff: 580,
    melodyIntervalMs: 2400,
    melodyVolume: 0.40,
    subBassGain: 0.35,
    binauralGain: 0.25
  },
  INTERSTELLAR_DRONE: {
    name: 'Interstellar Deep Space Drone',
    description: 'Slow-evolving cosmic resonance with pure 40Hz gamma prefrontal synchronization.',
    padFilterCutoff: 300,
    melodyIntervalMs: 5200,
    melodyVolume: 0.15,
    subBassGain: 0.60,
    binauralGain: 0.35
  }
};

// D-Minor / F-Major Pentatonic Chord Voicings (Hz)
const CHORD_PROGRESSIONS = [
  // Chord 1: D-Minor (D2, A2, D3, F3)
  [73.42, 110.00, 146.83, 174.61],
  // Chord 2: Bb-Major (Bb1, F2, Bb2, D3)
  [58.27, 87.31, 116.54, 146.83],
  // Chord 3: F-Major (F1, C2, F2, A2)
  [43.65, 65.41, 87.31, 110.00],
  // Chord 4: C-Major (C2, G2, C3, E3)
  [65.41, 98.00, 130.81, 164.81]
];

// Pentatonic Melodic Notes for gentle ambient chimes
const MELODY_SCALE_HZ = [
  293.66, // D4
  349.23, // F4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33  // D5
];

const STORAGE_KEY_PLAYING = 'titan_gamma_playing';
const STORAGE_KEY_VOLUME = 'titan_gamma_volume';
const STORAGE_KEY_PRESET = 'titan_gamma_preset';

export class GammaAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Polyphonic Synth Pad Voice Nodes
  private padOscillators: OscillatorNode[] = [];
  private padGainNodes: GainNode[] = [];
  private padFilter: BiquadFilterNode | null = null;

  // 40Hz Binaural Entrainment Nodes
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;
  private binauralGainNode: GainNode | null = null;

  // 40Hz Fundamental Sub-Bass
  private oscSub: OscillatorNode | null = null;
  private subGainNode: GainNode | null = null;

  // Generative Melody & Chord Progression Timers
  private chordIntervalId: ReturnType<typeof setInterval> | null = null;
  private melodyTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private currentChordIndex: number = 0;

  private isRunning: boolean = false;
  private currentVolume: number = 0.22;
  private currentPreset: GammaPreset = 'CYBER_PADS';
  private listeners: Set<(isPlaying: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const storedVol = localStorage.getItem(STORAGE_KEY_VOLUME);
      if (storedVol !== null) {
        this.currentVolume = parseFloat(storedVol) || 0.22;
      }
      const storedPreset = localStorage.getItem(STORAGE_KEY_PRESET) as GammaPreset;
      if (storedPreset && GAMMA_PRESETS[storedPreset]) {
        this.currentPreset = storedPreset;
      }
    }
  }

  public subscribe(listener: (isPlaying: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.isRunning));
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public getPreset(): GammaPreset {
    return this.currentPreset;
  }

  private initAudioContext(): boolean {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  /**
   * Starts the continuous 40Hz musical ambient soundscape
   */
  public async start(): Promise<boolean> {
    if (this.isRunning) return true;
    if (!this.initAudioContext() || !this.ctx) return false;

    try {
      const preset = GAMMA_PRESETS[this.currentPreset];
      const now = this.ctx.currentTime;

      // Master Gain with smooth 1.5s fade-in
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, now);
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, now + 1.5);
      this.masterGain.connect(this.ctx.destination);

      // 1. Ambient Warm Pad Filter (Sweeping lowpass for lush warmth)
      this.padFilter = this.ctx.createBiquadFilter();
      this.padFilter.type = 'lowpass';
      this.padFilter.frequency.setValueAtTime(preset.padFilterCutoff, now);
      this.padFilter.Q.setValueAtTime(2.0, now);
      this.padFilter.connect(this.masterGain);

      // Start 4 Pad Voice Oscillators (Triangle + Sawtooth warm detuning)
      this.padOscillators = [];
      this.padGainNodes = [];
      const chord = CHORD_PROGRESSIONS[0];

      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(chord[i] || 110, now);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.12, now);

        osc.connect(gainNode);
        gainNode.connect(this.padFilter);
        osc.start(now);

        this.padOscillators.push(osc);
        this.padGainNodes.push(gainNode);
      }

      // 2. 40Hz Binaural Entrainment Layer (Embedded in the chords)
      this.binauralGainNode = this.ctx.createGain();
      this.binauralGainNode.gain.setValueAtTime(preset.binauralGain * 0.35, now);
      this.binauralGainNode.connect(this.masterGain);

      this.oscLeft = this.ctx.createOscillator();
      this.oscLeft.type = 'sine';
      this.oscLeft.frequency.setValueAtTime(200, now); // Left ear: 200 Hz

      this.oscRight = this.ctx.createOscillator();
      this.oscRight.type = 'sine';
      this.oscRight.frequency.setValueAtTime(240, now); // Right ear: 240 Hz -> 40Hz Beat

      if (this.ctx.createStereoPanner) {
        const panL = this.ctx.createStereoPanner();
        panL.pan.setValueAtTime(-0.8, now);
        this.oscLeft.connect(panL);
        panL.connect(this.binauralGainNode);

        const panR = this.ctx.createStereoPanner();
        panR.pan.setValueAtTime(0.8, now);
        this.oscRight.connect(panR);
        panR.connect(this.binauralGainNode);
      } else {
        this.oscLeft.connect(this.binauralGainNode);
        this.oscRight.connect(this.binauralGainNode);
      }

      this.oscLeft.start(now);
      this.oscRight.start(now);

      // 3. Pure 40Hz Fundamental Sub-Bass Resonance
      this.subGainNode = this.ctx.createGain();
      this.subGainNode.gain.setValueAtTime(preset.subBassGain * 0.45, now);

      const subFilter = this.ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(80, now);

      this.oscSub = this.ctx.createOscillator();
      this.oscSub.type = 'sine';
      this.oscSub.frequency.setValueAtTime(40.0, now); // Pure 40.0 Hz Fundamental

      this.oscSub.connect(subFilter);
      subFilter.connect(this.subGainNode);
      this.subGainNode.connect(this.masterGain);
      this.oscSub.start(now);

      // 4. Start Harmonious Musical Chord Transitions (Every 9 Seconds)
      this.currentChordIndex = 0;
      this.chordIntervalId = setInterval(() => {
        this.transitionToNextChord();
      }, 9000);

      // 5. Start Generative Meditative Chimes
      this.scheduleNextMelodyChime();

      this.isRunning = true;
      localStorage.setItem(STORAGE_KEY_PLAYING, 'true');
      this.notify();
      return true;
    } catch (err) {
      console.warn('Failed to start 40Hz Musical Audio Engine:', err);
      this.isRunning = false;
      this.notify();
      return false;
    }
  }

  /**
   * Smoothly slides pad notes to the next musical chord in the progression
   */
  private transitionToNextChord() {
    if (!this.ctx || !this.isRunning || this.padOscillators.length < 4) return;

    this.currentChordIndex = (this.currentChordIndex + 1) % CHORD_PROGRESSIONS.length;
    const nextChord = CHORD_PROGRESSIONS[this.currentChordIndex];
    const now = this.ctx.currentTime;

    // Smooth 3.5s portamento glide between chords
    for (let i = 0; i < 4; i++) {
      const osc = this.padOscillators[i];
      const targetFreq = nextChord[i];
      if (osc && targetFreq) {
        osc.frequency.setTargetAtTime(targetFreq, now, 1.8);
      }
    }
  }

  /**
   * Generates a soft, crystal-clear glass chime note in the pentatonic scale
   */
  private scheduleNextMelodyChime() {
    if (!this.isRunning || !this.ctx) return;

    const preset = GAMMA_PRESETS[this.currentPreset];
    const delay = preset.melodyIntervalMs + (Math.random() - 0.5) * 1200;

    this.melodyTimeoutId = setTimeout(() => {
      if (!this.isRunning || !this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const noteFreq = MELODY_SCALE_HZ[Math.floor(Math.random() * MELODY_SCALE_HZ.length)];

        // Sine wave bell oscillator
        const chimeOsc = this.ctx.createOscillator();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(noteFreq, now);

        // Warm second harmonic
        const chimeHarmonic = this.ctx.createOscillator();
        chimeHarmonic.type = 'triangle';
        chimeHarmonic.frequency.setValueAtTime(noteFreq * 2, now);

        const chimeGain = this.ctx.createGain();
        chimeGain.gain.setValueAtTime(0, now);
        // Attack: 0.1s, Decay: 2.8s
        chimeGain.gain.linearRampToValueAtTime(preset.melodyVolume * 0.18, now + 0.08);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        chimeOsc.connect(chimeGain);
        chimeHarmonic.connect(chimeGain);

        if (this.masterGain) {
          chimeGain.connect(this.masterGain);
        }

        chimeOsc.start(now);
        chimeHarmonic.start(now);
        chimeOsc.stop(now + 3.0);
        chimeHarmonic.stop(now + 3.0);
      } catch {
        // ignore chime error
      }

      this.scheduleNextMelodyChime();
    }, Math.max(800, delay));
  }

  /**
   * Stops the musical ambient stream with a luxurious 1.0s fade-out
   */
  public stop() {
    if (!this.isRunning || !this.ctx) return;

    if (this.chordIntervalId) {
      clearInterval(this.chordIntervalId);
      this.chordIntervalId = null;
    }
    if (this.melodyTimeoutId) {
      clearTimeout(this.melodyTimeoutId);
      this.melodyTimeoutId = null;
    }

    try {
      const now = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
      }

      setTimeout(() => {
        try {
          this.padOscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch {}
          });
          this.padOscillators = [];
          this.padGainNodes = [];

          this.oscLeft?.stop();
          this.oscRight?.stop();
          this.oscSub?.stop();

          this.oscLeft?.disconnect();
          this.oscRight?.disconnect();
          this.oscSub?.disconnect();
        } catch {
          // ignore cleanup
        }

        this.isRunning = false;
        localStorage.setItem(STORAGE_KEY_PLAYING, 'false');
        this.notify();
      }, 1050);
    } catch (err) {
      console.warn('Error stopping 40Hz Musical Audio Engine:', err);
      this.isRunning = false;
      this.notify();
    }
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public setVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1.0, volume));
    this.currentVolume = clamped;
    localStorage.setItem(STORAGE_KEY_VOLUME, clamped.toString());

    if (this.ctx && this.masterGain && this.isRunning) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(clamped, now + 0.1);
    }
  }

  public setPreset(preset: GammaPreset) {
    if (!GAMMA_PRESETS[preset]) return;
    this.currentPreset = preset;
    localStorage.setItem(STORAGE_KEY_PRESET, preset);

    if (this.isRunning && this.ctx) {
      const config = GAMMA_PRESETS[preset];
      const now = this.ctx.currentTime;
      if (this.padFilter) {
        this.padFilter.frequency.setTargetAtTime(config.padFilterCutoff, now, 1.2);
      }
      if (this.subGainNode) {
        this.subGainNode.gain.setTargetAtTime(config.subBassGain * 0.45, now, 1.2);
      }
      if (this.binauralGainNode) {
        this.binauralGainNode.gain.setTargetAtTime(config.binauralGain * 0.35, now, 1.2);
      }
    }
  }
}

export const gammaAudioEngine = new GammaAudioEngine();
