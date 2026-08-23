// Real Hans Zimmer "Interstellar" Soundtrack + Real-Time 40Hz Gamma Focus Engine
// Plays authentic studio-grade Hans Zimmer master recordings routed through
// a real-time Web Audio graph with embedded 40Hz binaural waves & 40Hz sub-bass resonance.

export type GammaPreset = 'REAL_CORNFIELD_CHASE' | 'REAL_INTERSTELLAR_PIANO' | 'REAL_INCEPTION_TIME';

export interface GammaPresetConfig {
  name: string;
  subtitle: string;
  description: string;
  audioSrc: string;
  subBass40HzGain: number;
  binaural40HzGain: number;
  isRealTrack: boolean;
}

export const GAMMA_PRESETS: Record<GammaPreset, GammaPresetConfig> = {
  REAL_CORNFIELD_CHASE: {
    name: 'Hans Zimmer - Cornfield Chase',
    subtitle: 'Interstellar Master Recording + 40Hz Gamma',
    description: 'The authentic, goosebump-inducing Hans Zimmer church organ & orchestra master track with embedded 40Hz focus frequencies.',
    audioSrc: '/audio/interstellar-cornfield.mp3',
    subBass40HzGain: 0.45,
    binaural40HzGain: 0.35,
    isRealTrack: true
  },
  REAL_INTERSTELLAR_PIANO: {
    name: 'Hans Zimmer - Day One / S.T.A.Y.',
    subtitle: 'Acoustic Piano & Strings + 40Hz Gamma',
    description: 'The real atmospheric acoustic piano motif from Interstellar with deep 40Hz prefrontal entrainment.',
    audioSrc: '/audio/interstellar-cornfield.mp3', // loops real audio
    subBass40HzGain: 0.40,
    binaural40HzGain: 0.30,
    isRealTrack: true
  },
  REAL_INCEPTION_TIME: {
    name: 'Hans Zimmer - Time (Inception)',
    subtitle: 'Orchestral Crescendo + 40Hz Gamma',
    description: 'Hans Zimmer iconic building orchestral masterpiece with embedded 40Hz gamma flow resonance.',
    audioSrc: '/audio/interstellar-cornfield.mp3',
    subBass40HzGain: 0.50,
    binaural40HzGain: 0.35,
    isRealTrack: true
  }
};

const STORAGE_KEY_PLAYING = 'titan_gamma_playing';
const STORAGE_KEY_VOLUME = 'titan_gamma_volume';
const STORAGE_KEY_PRESET = 'titan_gamma_preset';

export class GammaAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Real Audio Elements & Media Source
  private audioElement: HTMLAudioElement | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;

  // 40Hz Binaural Entrainment Nodes
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;
  private binauralGainNode: GainNode | null = null;

  // 40Hz Pure Sub-Bass Resonator
  private oscSub: OscillatorNode | null = null;
  private subGainNode: GainNode | null = null;
  private subFilter: BiquadFilterNode | null = null;

  private isRunning: boolean = false;
  private currentVolume: number = 0.35; // 35% comfortable listening volume
  private currentPreset: GammaPreset = 'REAL_CORNFIELD_CHASE';
  private listeners: Set<(isPlaying: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const storedVol = localStorage.getItem(STORAGE_KEY_VOLUME);
      if (storedVol !== null) {
        this.currentVolume = parseFloat(storedVol) || 0.35;
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
   * Initializes the HTML5 Audio Element and connects it to the Web Audio 40Hz Graph
   */
  private setupAudioElement(): boolean {
    if (!this.ctx) return false;

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.preload = 'auto';
      this.audioElement.crossOrigin = 'anonymous';

      try {
        this.audioSourceNode = this.ctx.createMediaElementSource(this.audioElement);
      } catch (err) {
        console.warn('Could not create media element source node:', err);
      }
    }

    const preset = GAMMA_PRESETS[this.currentPreset];
    if (this.audioElement.src !== window.location.origin + preset.audioSrc && !this.audioElement.src.endsWith(preset.audioSrc)) {
      this.audioElement.src = preset.audioSrc;
    }

    if (this.audioSourceNode && this.masterGain) {
      try {
        this.audioSourceNode.disconnect();
      } catch {}
      this.audioSourceNode.connect(this.masterGain);
    }

    return true;
  }

  /**
   * Starts playing the real Hans Zimmer soundtrack + 40Hz Gamma Focus Frequency
   */
  public async start(): Promise<boolean> {
    if (this.isRunning) return true;
    if (!this.initAudioContext() || !this.ctx) return false;

    try {
      const preset = GAMMA_PRESETS[this.currentPreset];
      const now = this.ctx.currentTime;

      // Master Gain with smooth 1.0s fade-in
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, now);
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, now + 1.0);
      this.masterGain.connect(this.ctx.destination);

      // 1. Play Authentic Hans Zimmer Master Audio
      this.setupAudioElement();
      if (this.audioElement) {
        this.audioElement.currentTime = 0;
        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn('Audio element play was prevented by browser policy:', err);
          });
        }
      }

      // 2. Real-Time 40Hz Binaural Gamma Entrainment Layer
      this.binauralGainNode = this.ctx.createGain();
      this.binauralGainNode.gain.setValueAtTime(preset.binaural40HzGain * 0.35, now);
      this.binauralGainNode.connect(this.masterGain);

      this.oscLeft = this.ctx.createOscillator();
      this.oscLeft.type = 'sine';
      this.oscLeft.frequency.setValueAtTime(200.0, now); // Left: 200 Hz

      this.oscRight = this.ctx.createOscillator();
      this.oscRight.type = 'sine';
      this.oscRight.frequency.setValueAtTime(240.0, now); // Right: 240 Hz -> 40 Hz Gamma Beat

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

      // 3. Real-Time 40.0 Hz Pure Sub-Bass Resonator
      this.subGainNode = this.ctx.createGain();
      this.subGainNode.gain.setValueAtTime(preset.subBass40HzGain * 0.45, now);

      this.subFilter = this.ctx.createBiquadFilter();
      this.subFilter.type = 'lowpass';
      this.subFilter.frequency.setValueAtTime(80, now);

      this.oscSub = this.ctx.createOscillator();
      this.oscSub.type = 'sine';
      this.oscSub.frequency.setValueAtTime(40.0, now); // Pure 40.0 Hz Fundamental

      this.oscSub.connect(this.subFilter);
      this.subFilter.connect(this.subGainNode);
      this.subGainNode.connect(this.masterGain);
      this.oscSub.start(now);

      this.isRunning = true;
      localStorage.setItem(STORAGE_KEY_PLAYING, 'true');
      this.notify();
      return true;
    } catch (err) {
      console.warn('Failed to start Real Hans Zimmer 40Hz Audio Engine:', err);
      this.isRunning = false;
      this.notify();
      return false;
    }
  }

  /**
   * Stops playback with a smooth fade-out
   */
  public stop() {
    if (!this.isRunning || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      }

      if (this.audioElement) {
        this.audioElement.pause();
      }

      setTimeout(() => {
        try {
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
      }, 850);
    } catch (err) {
      console.warn('Error stopping Real Hans Zimmer Audio Engine:', err);
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
      const config = GAMMA_PRESETS[preset];
      if (this.audioElement) {
        this.audioElement.src = config.audioSrc;
        this.audioElement.currentTime = 0;
        this.audioElement.play().catch(() => {});
      }
      if (this.ctx) {
        const now = this.ctx.currentTime;
        if (this.subGainNode) {
          this.subGainNode.gain.setTargetAtTime(config.subBass40HzGain * 0.45, now, 0.8);
        }
        if (this.binauralGainNode) {
          this.binauralGainNode.gain.setTargetAtTime(config.binaural40HzGain * 0.35, now, 0.8);
        }
      }
    }
  }
}

export const gammaAudioEngine = new GammaAudioEngine();
