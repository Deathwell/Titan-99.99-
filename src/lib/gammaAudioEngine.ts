// Instant Zero-Latency Hans Zimmer "Cornfield Chase" 40Hz Gamma Audio Engine
// Pre-decodes MP3 into Web Audio RAM buffer for instant 0ms playback
// Default is ON (unmuted) on page load, drops directly at 23.5s peak theme.
// Synchronous state machine: Reliable ON by default, 1-click OFF, 1-click ON.

const CORNFIELD_CHASE_SRC = '/audio/interstellar-cornfield.mp3';
const START_OFFSET_SECONDS = 23.5; // Starts directly at peak crescendo
const STORAGE_KEY_MUTED = 'titan_cornfield_muted_v2';
const STORAGE_KEY_VOLUME = 'titan_cornfield_volume_v2';

export class GammaAudioEngine {
  private ctx: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private currentSourceNode: AudioBufferSourceNode | null = null;
  private masterGain: GainNode | null = null;

  // 40Hz Focus Frequency Nodes (Sub-bass & Binaural)
  private subOsc: OscillatorNode | null = null;
  private subGain: GainNode | null = null;
  private binauralLeft: OscillatorNode | null = null;
  private binauralRight: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;

  private isPlaying: boolean = false;
  private isUserMuted: boolean = false;
  private isPreloading: boolean = false;
  private isPreloaded: boolean = false;
  private currentVolume: number = 0.35; // 35% rich listening volume
  private listeners: Set<(isPlaying: boolean) => void> = new Set();
  private gestureListenersAttached: boolean = false;
  private fallbackAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const storedVol = localStorage.getItem(STORAGE_KEY_VOLUME);
      if (storedVol !== null) {
        this.currentVolume = parseFloat(storedVol) || 0.35;
      }

      // Default is ON unless explicitly muted by user
      const storedMuted = localStorage.getItem(STORAGE_KEY_MUTED);
      this.isUserMuted = storedMuted === 'true';

      // Preload audio buffer immediately into RAM on app load
      this.preloadAudio();

      if (!this.isUserMuted) {
        // Optimistically set playing = true so UI displays ACTIVE by default
        this.isPlaying = true;

        // Try direct playback on load
        this.start().catch(() => {});

        // Attach global gesture handlers so audio unlocks on the very first user touch/move/key
        this.attachGestureListeners();
      }
    }
  }

  public subscribe(listener: (isPlaying: boolean) => void) {
    this.listeners.add(listener);
    // Immediately inform subscriber of current state
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.isPlaying));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  private initAudioContext(): boolean {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
    }
    return true;
  }

  /**
   * Pre-fetches and decodes the audio file into memory so playback starts in 0.0ms
   */
  public async preloadAudio(): Promise<boolean> {
    if (this.isPreloaded || this.isPreloading) return true;
    this.isPreloading = true;

    try {
      if (!this.initAudioContext() || !this.ctx) return false;

      const response = await fetch(CORNFIELD_CHASE_SRC);
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.isPreloaded = true;
      this.isPreloading = false;
      return true;
    } catch (err) {
      console.warn('Background pre-decode of Cornfield Chase audio:', err);
      this.isPreloading = false;
      return false;
    }
  }

  /**
   * Unlocks audio on ANY first gesture across the screen
   */
  private attachGestureListeners() {
    if (this.gestureListenersAttached || typeof window === 'undefined') return;
    this.gestureListenersAttached = true;

    const events = ['click', 'pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll', 'mousemove'];

    const handleGesture = () => {
      this.removeGestureListeners();

      if (this.isUserMuted) return;

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      if (!this.currentSourceNode && !this.fallbackAudio) {
        this.start().catch(() => {});
      }
    };

    events.forEach(e => window.addEventListener(e, handleGesture, { once: true, passive: true }));
    events.forEach(e => document.addEventListener(e, handleGesture, { once: true, passive: true }));
  }

  private removeGestureListeners() {
    this.gestureListenersAttached = false;
  }

  /**
   * Starts playing Cornfield Chase immediately at 23.5s with zero noise & zero delay
   */
  public async start(): Promise<boolean> {
    this.isUserMuted = false;
    this.isPlaying = true;
    localStorage.setItem(STORAGE_KEY_MUTED, 'false');
    this.notify();

    if (!this.initAudioContext() || !this.ctx) {
      return this.startFallbackAudio();
    }

    try {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      // Stop any existing playing nodes first to prevent overlaps
      this.cleanupNodes();

      // Ensure buffer is ready
      if (!this.audioBuffer) {
        await this.preloadAudio();
      }

      if (!this.audioBuffer) {
        return this.startFallbackAudio();
      }

      const now = this.ctx.currentTime;

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.currentVolume, now);
      this.masterGain.connect(this.ctx.destination);

      // 1. Play Real Hans Zimmer Master Audio from RAM (Starts immediately at 23.5s peak crescendo!)
      this.currentSourceNode = this.ctx.createBufferSource();
      this.currentSourceNode.buffer = this.audioBuffer;
      this.currentSourceNode.loop = true;
      this.currentSourceNode.loopStart = START_OFFSET_SECONDS;
      this.currentSourceNode.loopEnd = this.audioBuffer.duration;
      this.currentSourceNode.connect(this.masterGain);
      this.currentSourceNode.start(now, START_OFFSET_SECONDS);

      // 2. Add subtle 40Hz sub-bass harmonic foundation beneath the church organ
      this.subGain = this.ctx.createGain();
      this.subGain.gain.setValueAtTime(0.18, now);

      const subFilter = this.ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(70, now);

      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.setValueAtTime(40.0, now);

      this.subOsc.connect(subFilter);
      subFilter.connect(this.subGain);
      this.subGain.connect(this.masterGain);
      this.subOsc.start(now);

      // 3. Add subtle 40Hz binaural stereo waves
      this.binauralGain = this.ctx.createGain();
      this.binauralGain.gain.setValueAtTime(0.12, now);
      this.binauralGain.connect(this.masterGain);

      this.binauralLeft = this.ctx.createOscillator();
      this.binauralLeft.type = 'sine';
      this.binauralLeft.frequency.setValueAtTime(200.0, now);

      this.binauralRight = this.ctx.createOscillator();
      this.binauralRight.type = 'sine';
      this.binauralRight.frequency.setValueAtTime(240.0, now); // 40Hz Difference

      if (this.ctx.createStereoPanner) {
        const panL = this.ctx.createStereoPanner();
        panL.pan.setValueAtTime(-0.8, now);
        this.binauralLeft.connect(panL);
        panL.connect(this.binauralGain);

        const panR = this.ctx.createStereoPanner();
        panR.pan.setValueAtTime(0.8, now);
        this.binauralRight.connect(panR);
        panR.connect(this.binauralGain);
      } else {
        this.binauralLeft.connect(this.binauralGain);
        this.binauralRight.connect(this.binauralGain);
      }

      this.binauralLeft.start(now);
      this.binauralRight.start(now);

      return true;
    } catch (err) {
      console.warn('Web Audio start deferred by browser policy, using fallback or waiting for gesture:', err);
      return this.startFallbackAudio();
    }
  }

  private startFallbackAudio(): boolean {
    if (!this.fallbackAudio) {
      this.fallbackAudio = new Audio(CORNFIELD_CHASE_SRC);
      this.fallbackAudio.loop = true;
    }
    this.fallbackAudio.volume = this.currentVolume;
    this.fallbackAudio.currentTime = START_OFFSET_SECONDS;
    this.fallbackAudio.play().catch(() => {});
    return true;
  }

  private cleanupNodes() {
    try {
      if (this.currentSourceNode) {
        this.currentSourceNode.stop();
        this.currentSourceNode.disconnect();
        this.currentSourceNode = null;
      }
      if (this.subOsc) {
        this.subOsc.stop();
        this.subOsc.disconnect();
        this.subOsc = null;
      }
      if (this.binauralLeft) {
        this.binauralLeft.stop();
        this.binauralLeft.disconnect();
        this.binauralLeft = null;
      }
      if (this.binauralRight) {
        this.binauralRight.stop();
        this.binauralRight.disconnect();
        this.binauralRight = null;
      }
      if (this.masterGain) {
        this.masterGain.disconnect();
        this.masterGain = null;
      }
      if (this.fallbackAudio) {
        this.fallbackAudio.pause();
        this.fallbackAudio.currentTime = START_OFFSET_SECONDS;
      }
    } catch {
      // ignore
    }
  }

  /**
   * Synchronously and instantly stops audio playback
   */
  public stop() {
    this.isUserMuted = true;
    this.isPlaying = false;
    localStorage.setItem(STORAGE_KEY_MUTED, 'true');
    this.removeGestureListeners();
    this.cleanupNodes();

    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(() => {});
    }

    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
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

    if (this.ctx && this.masterGain && this.isPlaying) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(clamped, now);
    }
    if (this.fallbackAudio) {
      this.fallbackAudio.volume = clamped;
    }
  }
}

export const gammaAudioEngine = new GammaAudioEngine();
