// Instant Zero-Latency Hans Zimmer "Cornfield Chase" 40Hz Gamma Audio Engine
// Pre-decodes MP3 into Web Audio RAM buffer for instant 0ms playback on first interaction
// Zero white noise, zero buffering delay, gapless loop, pure Hans Zimmer master audio.

const CORNFIELD_CHASE_SRC = '/audio/interstellar-cornfield.mp3';
const STORAGE_KEY_MUTED = 'titan_cornfield_muted';
const STORAGE_KEY_VOLUME = 'titan_cornfield_volume';

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
  private isPreloading: boolean = false;
  private isPreloaded: boolean = false;
  private currentVolume: number = 0.35; // 35% rich listening volume
  private listeners: Set<(isPlaying: boolean) => void> = new Set();
  private autoPlayInitialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const storedVol = localStorage.getItem(STORAGE_KEY_VOLUME);
      if (storedVol !== null) {
        this.currentVolume = parseFloat(storedVol) || 0.35;
      }

      // Preload audio buffer immediately in the background on app start
      this.preloadAudio();

      // Listen for first interaction anywhere on the website to auto-engage instant music
      const isExplicitlyMuted = localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
      if (!isExplicitlyMuted) {
        this.setupAutoPlayOnFirstInteraction();
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
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
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
   * Automatically triggers music on the very first click or keypress anywhere on the page
   */
  private setupAutoPlayOnFirstInteraction() {
    if (this.autoPlayInitialized || typeof window === 'undefined') return;
    this.autoPlayInitialized = true;

    const handleFirstGesture = () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);

      if (!this.isPlaying && localStorage.getItem(STORAGE_KEY_MUTED) !== 'true') {
        this.start();
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
  }

  /**
   * Starts playing Cornfield Chase immediately with zero noise & zero delay
   */
  public async start(): Promise<boolean> {
    if (this.isPlaying) return true;
    if (!this.initAudioContext() || !this.ctx) return false;

    try {
      // Ensure buffer is ready
      if (!this.audioBuffer) {
        await this.preloadAudio();
      }

      if (!this.audioBuffer) {
        // Fallback: Use direct HTML5 Audio if decode failed
        return this.startFallbackAudio();
      }

      const now = this.ctx.currentTime;

      // Master Gain for volume
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, now);
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, now + 0.3); // Instant, smooth 300ms fade
      this.masterGain.connect(this.ctx.destination);

      // 1. Play Real Hans Zimmer Master Audio from RAM (Starts immediately at 14.5s where the iconic organ kicks in!)
      const START_OFFSET = 14.5;
      this.currentSourceNode = this.ctx.createBufferSource();
      this.currentSourceNode.buffer = this.audioBuffer;
      this.currentSourceNode.loop = true;
      this.currentSourceNode.loopStart = START_OFFSET;
      this.currentSourceNode.loopEnd = this.audioBuffer.duration;
      this.currentSourceNode.connect(this.masterGain);
      this.currentSourceNode.start(now, START_OFFSET);

      // 2. Add subtle 40Hz sub-bass harmonic foundation beneath the church organ
      this.subGain = this.ctx.createGain();
      this.subGain.gain.setValueAtTime(0.18, now);

      const subFilter = this.ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(70, now);

      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.setValueAtTime(40.0, now); // Pure 40Hz fundamental

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

      this.isPlaying = true;
      localStorage.setItem(STORAGE_KEY_MUTED, 'false');
      this.notify();
      return true;
    } catch (err) {
      console.warn('Error starting instant Cornfield Chase audio:', err);
      return this.startFallbackAudio();
    }
  }

  private fallbackAudio: HTMLAudioElement | null = null;
  private startFallbackAudio(): boolean {
    if (!this.fallbackAudio) {
      this.fallbackAudio = new Audio(CORNFIELD_CHASE_SRC);
      this.fallbackAudio.loop = true;
    }
    this.fallbackAudio.volume = this.currentVolume;
    this.fallbackAudio.currentTime = 14.5;
    this.fallbackAudio.play().catch(() => {});
    this.isPlaying = true;
    localStorage.setItem(STORAGE_KEY_MUTED, 'false');
    this.notify();
    return true;
  }

  /**
   * Stops audio immediately with a clean fade
   */
  public stop() {
    if (!this.isPlaying) return;

    try {
      if (this.ctx && this.masterGain) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
      }

      if (this.fallbackAudio) {
        this.fallbackAudio.pause();
      }

      setTimeout(() => {
        try {
          this.currentSourceNode?.stop();
          this.currentSourceNode?.disconnect();
          this.currentSourceNode = null;

          this.subOsc?.stop();
          this.subOsc?.disconnect();
          this.subOsc = null;

          this.binauralLeft?.stop();
          this.binauralLeft?.disconnect();
          this.binauralLeft = null;

          this.binauralRight?.stop();
          this.binauralRight?.disconnect();
          this.binauralRight = null;
        } catch {
          // ignore
        }

        this.isPlaying = false;
        localStorage.setItem(STORAGE_KEY_MUTED, 'true');
        this.notify();
      }, 320);
    } catch (err) {
      this.isPlaying = false;
      this.notify();
    }
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
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(clamped, now + 0.05);
    }
    if (this.fallbackAudio) {
      this.fallbackAudio.volume = clamped;
    }
  }
}

export const gammaAudioEngine = new GammaAudioEngine();
