// Continuous 40Hz Gamma Neuro-Acoustic Ambient Synthesizer
// Procedural Web Audio API generator for binaural entrainment, 40Hz sub-bass, and filtered brown noise

export type GammaPreset = 'GAMMA_FLOW' | 'DEEP_COCOON' | 'SUB_BASS_40HZ';

export interface GammaPresetConfig {
  name: string;
  description: string;
  binauralGain: number;
  subBassGain: number;
  brownNoiseGain: number;
  carrierFreq: number; // e.g. 200 Hz
  beatFreq: number;    // 40 Hz
}

export const GAMMA_PRESETS: Record<GammaPreset, GammaPresetConfig> = {
  GAMMA_FLOW: {
    name: '40Hz Gamma Flow',
    description: 'Balanced 40Hz binaural waves with subtle warm brown noise for deep analytical focus.',
    binauralGain: 0.35,
    subBassGain: 0.40,
    brownNoiseGain: 0.25,
    carrierFreq: 200,
    beatFreq: 40
  },
  DEEP_COCOON: {
    name: '40Hz Noise Cocoon',
    description: 'Elevated warm brown noise with 40Hz sub-pulse to eliminate all external distractions.',
    binauralGain: 0.20,
    subBassGain: 0.35,
    brownNoiseGain: 0.45,
    carrierFreq: 180,
    beatFreq: 40
  },
  SUB_BASS_40HZ: {
    name: 'Pure 40Hz Sub-Bass',
    description: 'Clean, minimalist 40Hz fundamental sine tone for late-night sensory grounding.',
    binauralGain: 0.15,
    subBassGain: 0.70,
    brownNoiseGain: 0.15,
    carrierFreq: 216,
    beatFreq: 40
  }
};

const STORAGE_KEY_PLAYING = 'titan_gamma_playing';
const STORAGE_KEY_VOLUME = 'titan_gamma_volume';
const STORAGE_KEY_PRESET = 'titan_gamma_preset';

export class GammaAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Binaural Oscillators
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;
  private pannerLeft: StereoPannerNode | null = null;
  private pannerRight: StereoPannerNode | null = null;
  private binauralGainNode: GainNode | null = null;

  // Sub-Bass 40Hz Oscillator
  private oscSub: OscillatorNode | null = null;
  private subGainNode: GainNode | null = null;
  private subFilter: BiquadFilterNode | null = null;

  // Brown Noise Generator
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGainNode: GainNode | null = null;

  private isRunning: boolean = false;
  private currentVolume: number = 0.18; // 18% gentle default background
  private currentPreset: GammaPreset = 'GAMMA_FLOW';
  private listeners: Set<(isPlaying: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const storedVol = localStorage.getItem(STORAGE_KEY_VOLUME);
      if (storedVol !== null) {
        this.currentVolume = parseFloat(storedVol) || 0.18;
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
   * Generates a 5-second seamless looped buffer of warm Brown Noise
   */
  private createBrownNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise integration filter
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }
    return buffer;
  }

  /**
   * Starts the continuous 40Hz Gamma procedural ambient stream
   */
  public async start(): Promise<boolean> {
    if (this.isRunning) return true;
    if (!this.initAudioContext() || !this.ctx) return false;

    try {
      const preset = GAMMA_PRESETS[this.currentPreset];
      const now = this.ctx.currentTime;

      // Master Gain with smooth 1.2s fade-in
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, now);
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, now + 1.2);
      this.masterGain.connect(this.ctx.destination);

      // 1. Binaural Beat Synthesizer (Carrier + 40Hz difference)
      const carrier = preset.carrierFreq;
      const leftFreq = carrier - preset.beatFreq / 2; // e.g. 180 Hz
      const rightFreq = carrier + preset.beatFreq / 2; // e.g. 220 Hz -> 40 Hz beat!

      this.binauralGainNode = this.ctx.createGain();
      this.binauralGainNode.gain.setValueAtTime(preset.binauralGain, now);
      this.binauralGainNode.connect(this.masterGain);

      // Left Channel
      this.oscLeft = this.ctx.createOscillator();
      this.oscLeft.type = 'sine';
      this.oscLeft.frequency.setValueAtTime(leftFreq, now);

      if (this.ctx.createStereoPanner) {
        this.pannerLeft = this.ctx.createStereoPanner();
        this.pannerLeft.pan.setValueAtTime(-1.0, now);
        this.oscLeft.connect(this.pannerLeft);
        this.pannerLeft.connect(this.binauralGainNode);
      } else {
        this.oscLeft.connect(this.binauralGainNode);
      }

      // Right Channel
      this.oscRight = this.ctx.createOscillator();
      this.oscRight.type = 'sine';
      this.oscRight.frequency.setValueAtTime(rightFreq, now);

      if (this.ctx.createStereoPanner) {
        this.pannerRight = this.ctx.createStereoPanner();
        this.pannerRight.pan.setValueAtTime(1.0, now);
        this.oscRight.connect(this.pannerRight);
        this.pannerRight.connect(this.binauralGainNode);
      } else {
        this.oscRight.connect(this.binauralGainNode);
      }

      this.oscLeft.start(now);
      this.oscRight.start(now);

      // 2. Pure Sub-Bass 40Hz Fundamental Oscillator
      this.subGainNode = this.ctx.createGain();
      this.subGainNode.gain.setValueAtTime(preset.subBassGain, now);

      this.subFilter = this.ctx.createBiquadFilter();
      this.subFilter.type = 'lowpass';
      this.subFilter.frequency.setValueAtTime(90, now);

      this.oscSub = this.ctx.createOscillator();
      this.oscSub.type = 'sine';
      this.oscSub.frequency.setValueAtTime(40, now); // Pure 40.0 Hz Fundamental

      this.oscSub.connect(this.subFilter);
      this.subFilter.connect(this.subGainNode);
      this.subGainNode.connect(this.masterGain);
      this.oscSub.start(now);

      // 3. Filtered Brown Noise Atmosphere
      const noiseBuffer = this.createBrownNoiseBuffer();
      if (noiseBuffer) {
        this.noiseSource = this.ctx.createBufferSource();
        this.noiseSource.buffer = noiseBuffer;
        this.noiseSource.loop = true;

        this.noiseFilter = this.ctx.createBiquadFilter();
        this.noiseFilter.type = 'lowpass';
        this.noiseFilter.frequency.setValueAtTime(320, now);

        this.noiseGainNode = this.ctx.createGain();
        this.noiseGainNode.gain.setValueAtTime(preset.brownNoiseGain, now);

        this.noiseSource.connect(this.noiseFilter);
        this.noiseFilter.connect(this.noiseGainNode);
        this.noiseGainNode.connect(this.masterGain);
        this.noiseSource.start(now);
      }

      this.isRunning = true;
      localStorage.setItem(STORAGE_KEY_PLAYING, 'true');
      this.notify();
      return true;
    } catch (err) {
      console.warn('Failed to start 40Hz Gamma Audio Engine:', err);
      this.isRunning = false;
      this.notify();
      return false;
    }
  }

  /**
   * Stops the ambient stream with a smooth 0.8s fade-out
   */
  public stop() {
    if (!this.isRunning || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      }

      setTimeout(() => {
        try {
          this.oscLeft?.stop();
          this.oscRight?.stop();
          this.oscSub?.stop();
          this.noiseSource?.stop();

          this.oscLeft?.disconnect();
          this.oscRight?.disconnect();
          this.oscSub?.disconnect();
          this.noiseSource?.disconnect();
        } catch {
          // ignore cleanup errors
        }

        this.isRunning = false;
        localStorage.setItem(STORAGE_KEY_PLAYING, 'false');
        this.notify();
      }, 850);
    } catch (err) {
      console.warn('Error stopping 40Hz Gamma Audio Engine:', err);
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
      // Re-apply gains smoothly
      const config = GAMMA_PRESETS[preset];
      if (this.ctx) {
        const now = this.ctx.currentTime;
        if (this.binauralGainNode) {
          this.binauralGainNode.gain.linearRampToValueAtTime(config.binauralGain, now + 0.5);
        }
        if (this.subGainNode) {
          this.subGainNode.gain.linearRampToValueAtTime(config.subBassGain, now + 0.5);
        }
        if (this.noiseGainNode) {
          this.noiseGainNode.gain.linearRampToValueAtTime(config.brownNoiseGain, now + 0.5);
        }
        if (this.oscLeft && this.oscRight) {
          this.oscLeft.frequency.linearRampToValueAtTime(config.carrierFreq - config.beatFreq / 2, now + 0.5);
          this.oscRight.frequency.linearRampToValueAtTime(config.carrierFreq + config.beatFreq / 2, now + 0.5);
        }
      }
    }
  }
}

export const gammaAudioEngine = new GammaAudioEngine();
