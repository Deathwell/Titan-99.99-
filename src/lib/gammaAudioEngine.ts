// Hans Zimmer "Interstellar" Cathedral Organ & Soundtrack 40Hz Gamma Synthesizer
// Procedural Web Audio Engine: Synthesizes the iconic "Cornfield Chase" / "Day One" / "Stay"
// organ arpeggios, massive sub-bass pedal, and embedded 40Hz gamma brainwave entrainment.

export type GammaPreset = 'INTERSTELLAR_CORNFIELD' | 'INTERSTELLAR_STAY' | 'INTERSTELLAR_PIANO';

export interface GammaPresetConfig {
  name: string;
  description: string;
  tempoMs: number;         // Note speed (ms per arpeggio step)
  organHarmonicsGain: number;
  arpeggioVolume: number;
  subBassGain: number;
  binauralGain: number;
  filterCutoff: number;
}

export const GAMMA_PRESETS: Record<GammaPreset, GammaPresetConfig> = {
  INTERSTELLAR_CORNFIELD: {
    name: 'Interstellar: Cornfield Chase',
    description: 'The iconic Hans Zimmer church organ arpeggios & cosmic chords embedded with 40Hz gamma waves.',
    tempoMs: 240, // Hypnotic cadence
    organHarmonicsGain: 0.35,
    arpeggioVolume: 0.40,
    subBassGain: 0.50,
    binauralGain: 0.30,
    filterCutoff: 650
  },
  INTERSTELLAR_STAY: {
    name: 'Interstellar: Stay & No Time For Caution',
    description: 'Majestic cathedral organ pedal swells with deep 40Hz sub-bass resonance and sweeping strings.',
    tempoMs: 320,
    organHarmonicsGain: 0.45,
    arpeggioVolume: 0.28,
    subBassGain: 0.65,
    binauralGain: 0.35,
    filterCutoff: 480
  },
  INTERSTELLAR_PIANO: {
    name: 'Interstellar: First Step Piano & Drone',
    description: 'Serene minimalist piano theme with warm cosmic ambient pad and 40Hz prefrontal synchronization.',
    tempoMs: 400,
    organHarmonicsGain: 0.20,
    arpeggioVolume: 0.35,
    subBassGain: 0.40,
    binauralGain: 0.25,
    filterCutoff: 550
  }
};

// 4-Chord Hans Zimmer Interstellar Harmonic Structure
interface InterstellarChord {
  name: string;
  bassFreq: number;
  padFreqs: number[];
  arpeggioSequence: number[];
}

const INTERSTELLAR_CHORDS: InterstellarChord[] = [
  // 1. A-Minor (The famous opening theme)
  {
    name: 'Am',
    bassFreq: 55.00, // A1
    padFreqs: [110.00, 164.81, 220.00, 261.63], // A2, E3, A3, C4
    arpeggioSequence: [
      329.63, // E4
      440.00, // A4
      493.88, // B4
      523.25, // C5
      659.25, // E5
      587.33, // D5
      523.25, // C5
      493.88, // B4
      440.00, // A4
      329.63, // E4
      440.00, // A4
      493.88  // B4
    ]
  },
  // 2. F-Major (Cosmic expansion)
  {
    name: 'Fmaj',
    bassFreq: 43.65, // F1
    padFreqs: [87.31, 130.81, 174.61, 220.00], // F2, C3, F3, A3
    arpeggioSequence: [
      261.63, // C4
      349.23, // F4
      392.00, // G4
      440.00, // A4
      523.25, // C5
      493.88, // B4
      440.00, // A4
      392.00, // G4
      349.23, // F4
      261.63, // C4
      349.23, // F4
      392.00  // G4
    ]
  },
  // 3. C-Major (Triumph & Vastness)
  {
    name: 'Cmaj',
    bassFreq: 65.41, // C2
    padFreqs: [130.81, 196.00, 261.63, 329.63], // C3, G3, C4, E4
    arpeggioSequence: [
      196.00, // G3
      261.63, // C4
      293.66, // D4
      329.63, // E4
      392.00, // G4
      349.23, // F4
      329.63, // E4
      293.66, // D4
      261.63, // C4
      196.00, // G3
      261.63, // C4
      293.66  // D4
    ]
  },
  // 4. G-Major / Em (Resolution)
  {
    name: 'Gmaj',
    bassFreq: 49.00, // G1
    padFreqs: [98.00, 146.83, 196.00, 246.94], // G2, D3, G3, B3
    arpeggioSequence: [
      246.94, // B3
      293.66, // D4
      392.00, // G4
      440.00, // A4
      493.88, // B4
      440.00, // A4
      392.00, // G4
      293.66, // D4
      246.94, // B3
      196.00, // G3
      246.94, // B3
      293.66  // D4
    ]
  }
];

const STORAGE_KEY_PLAYING = 'titan_gamma_playing';
const STORAGE_KEY_VOLUME = 'titan_gamma_volume';
const STORAGE_KEY_PRESET = 'titan_gamma_preset';

export class GammaAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Cathedral Organ Pipe Voice Nodes
  private organPadOscillators: OscillatorNode[] = [];
  private organPadGainNodes: GainNode[] = [];
  private organFilter: BiquadFilterNode | null = null;

  // 40Hz Binaural Entrainment Nodes
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;
  private binauralGainNode: GainNode | null = null;

  // 40Hz Fundamental Sub-Bass Organ Pedal
  private oscSub: OscillatorNode | null = null;
  private subGainNode: GainNode | null = null;

  // Interstellar Arpeggio Sequencer
  private arpeggioStepTimer: ReturnType<typeof setInterval> | null = null;
  private chordTransitionTimer: ReturnType<typeof setInterval> | null = null;
  private currentChordIndex: number = 0;
  private currentStepIndex: number = 0;

  private isRunning: boolean = false;
  private currentVolume: number = 0.25;
  private currentPreset: GammaPreset = 'INTERSTELLAR_CORNFIELD';
  private listeners: Set<(isPlaying: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const storedVol = localStorage.getItem(STORAGE_KEY_VOLUME);
      if (storedVol !== null) {
        this.currentVolume = parseFloat(storedVol) || 0.25;
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
   * Starts the Hans Zimmer Interstellar 40Hz procedural soundtrack
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

      // 1. Cathedral Organ Acoustic Filter
      this.organFilter = this.ctx.createBiquadFilter();
      this.organFilter.type = 'lowpass';
      this.organFilter.frequency.setValueAtTime(preset.filterCutoff, now);
      this.organFilter.Q.setValueAtTime(2.5, now);
      this.organFilter.connect(this.masterGain);

      // Start Cathedral Organ Pad Voice Oscillators (Sawtooth + Triangle Organ Mixture)
      this.organPadOscillators = [];
      this.organPadGainNodes = [];
      const firstChord = INTERSTELLAR_CHORDS[0];

      for (let i = 0; i < firstChord.padFreqs.length; i++) {
        const osc = this.ctx.createOscillator();
        osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(firstChord.padFreqs[i], now);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(preset.organHarmonicsGain * 0.18, now);

        osc.connect(gainNode);
        gainNode.connect(this.organFilter);
        osc.start(now);

        this.organPadOscillators.push(osc);
        this.organPadGainNodes.push(gainNode);
      }

      // 2. 40Hz Binaural Gamma Entrainment Layer
      this.binauralGainNode = this.ctx.createGain();
      this.binauralGainNode.gain.setValueAtTime(preset.binauralGain * 0.35, now);
      this.binauralGainNode.connect(this.masterGain);

      this.oscLeft = this.ctx.createOscillator();
      this.oscLeft.type = 'sine';
      this.oscLeft.frequency.setValueAtTime(200.0, now); // Left: 200 Hz

      this.oscRight = this.ctx.createOscillator();
      this.oscRight.type = 'sine';
      this.oscRight.frequency.setValueAtTime(240.0, now); // Right: 240 Hz -> 40 Hz Beat

      if (this.ctx.createStereoPanner) {
        const panL = this.ctx.createStereoPanner();
        panL.pan.setValueAtTime(-0.85, now);
        this.oscLeft.connect(panL);
        panL.connect(this.binauralGainNode);

        const panR = this.ctx.createStereoPanner();
        panR.pan.setValueAtTime(0.85, now);
        this.oscRight.connect(panR);
        panR.connect(this.binauralGainNode);
      } else {
        this.oscLeft.connect(this.binauralGainNode);
        this.oscRight.connect(this.binauralGainNode);
      }

      this.oscLeft.start(now);
      this.oscRight.start(now);

      // 3. Pure 40Hz Sub-Bass Organ Pedal
      this.subGainNode = this.ctx.createGain();
      this.subGainNode.gain.setValueAtTime(preset.subBassGain * 0.50, now);

      const subFilter = this.ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(80, now);

      this.oscSub = this.ctx.createOscillator();
      this.oscSub.type = 'sine';
      this.oscSub.frequency.setValueAtTime(40.0, now); // Exact 40.0 Hz Fundamental

      this.oscSub.connect(subFilter);
      subFilter.connect(this.subGainNode);
      this.subGainNode.connect(this.masterGain);
      this.oscSub.start(now);

      // 4. Start Interstellar Arpeggio Sequencer ("Cornfield Chase" Clockwork Motif)
      this.currentChordIndex = 0;
      this.currentStepIndex = 0;

      this.arpeggioStepTimer = setInterval(() => {
        this.playInterstellarArpeggioStep();
      }, preset.tempoMs);

      // 5. Transition Chords Every 12 Seconds (Epic Swell Progression)
      this.chordTransitionTimer = setInterval(() => {
        this.transitionToNextInterstellarChord();
      }, 12000);

      this.isRunning = true;
      localStorage.setItem(STORAGE_KEY_PLAYING, 'true');
      this.notify();
      return true;
    } catch (err) {
      console.warn('Failed to start Hans Zimmer Interstellar 40Hz Engine:', err);
      this.isRunning = false;
      this.notify();
      return false;
    }
  }

  /**
   * Plays a single pipe organ / bell note in the Interstellar arpeggio sequence
   */
  private playInterstellarArpeggioStep() {
    if (!this.ctx || !this.isRunning || !this.masterGain) return;

    try {
      const chord = INTERSTELLAR_CHORDS[this.currentChordIndex];
      const noteFreq = chord.arpeggioSequence[this.currentStepIndex % chord.arpeggioSequence.length];
      this.currentStepIndex++;

      const preset = GAMMA_PRESETS[this.currentPreset];
      const now = this.ctx.currentTime;

      // 1. Primary Organ Pipe Voice (Sine + Triangle overtone)
      const noteOsc1 = this.ctx.createOscillator();
      noteOsc1.type = 'triangle';
      noteOsc1.frequency.setValueAtTime(noteFreq, now);

      const noteOsc2 = this.ctx.createOscillator();
      noteOsc2.type = 'sine';
      noteOsc2.frequency.setValueAtTime(noteFreq * 2, now); // Octave brilliance

      // Interstellar organ pipe envelope: Sharp attack, cathedral decay
      const noteGain = this.ctx.createGain();
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(preset.arpeggioVolume * 0.16, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + (preset.tempoMs / 1000) * 2.5);

      noteOsc1.connect(noteGain);
      noteOsc2.connect(noteGain);
      noteGain.connect(this.masterGain);

      noteOsc1.start(now);
      noteOsc2.start(now);
      noteOsc1.stop(now + 1.2);
      noteOsc2.stop(now + 1.2);
    } catch {
      // ignore step error
    }
  }

  /**
   * Smoothly slides organ chords to the next movement in the Interstellar theme
   */
  private transitionToNextInterstellarChord() {
    if (!this.ctx || !this.isRunning || this.organPadOscillators.length === 0) return;

    this.currentChordIndex = (this.currentChordIndex + 1) % INTERSTELLAR_CHORDS.length;
    const nextChord = INTERSTELLAR_CHORDS[this.currentChordIndex];
    const now = this.ctx.currentTime;

    // Smooth cathedral portamento glide across all organ pipes
    for (let i = 0; i < this.organPadOscillators.length; i++) {
      const osc = this.organPadOscillators[i];
      const targetFreq = nextChord.padFreqs[i];
      if (osc && targetFreq) {
        osc.frequency.setTargetAtTime(targetFreq, now, 2.2);
      }
    }
  }

  /**
   * Stops the soundtrack with a majestic 1.2s cathedral reverb fade-out
   */
  public stop() {
    if (!this.isRunning || !this.ctx) return;

    if (this.arpeggioStepTimer) {
      clearInterval(this.arpeggioStepTimer);
      this.arpeggioStepTimer = null;
    }
    if (this.chordTransitionTimer) {
      clearInterval(this.chordTransitionTimer);
      this.chordTransitionTimer = null;
    }

    try {
      const now = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
      }

      setTimeout(() => {
        try {
          this.organPadOscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch {}
          });
          this.organPadOscillators = [];
          this.organPadGainNodes = [];

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
      }, 1250);
    } catch (err) {
      console.warn('Error stopping Interstellar 40Hz Audio Engine:', err);
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

    if (this.isRunning) {
      // Re-initialize tempo timer if changed
      const config = GAMMA_PRESETS[preset];
      if (this.arpeggioStepTimer) {
        clearInterval(this.arpeggioStepTimer);
        this.arpeggioStepTimer = setInterval(() => {
          this.playInterstellarArpeggioStep();
        }, config.tempoMs);
      }
      if (this.ctx) {
        const now = this.ctx.currentTime;
        if (this.organFilter) {
          this.organFilter.frequency.setTargetAtTime(config.filterCutoff, now, 1.2);
        }
        if (this.subGainNode) {
          this.subGainNode.gain.setTargetAtTime(config.subBassGain * 0.50, now, 1.2);
        }
        if (this.binauralGainNode) {
          this.binauralGainNode.gain.setTargetAtTime(config.binauralGain * 0.35, now, 1.2);
        }
      }
    }
  }
}

export const gammaAudioEngine = new GammaAudioEngine();
