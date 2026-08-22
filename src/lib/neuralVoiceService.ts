/**
 * Studio Neural Voice Synthesizer (GPT-4o & ElevenLabs Human Voice Engine)
 * Fetches and streams ultra-natural human voice audio from OpenAI (Nova/Shimmer) & ElevenLabs
 */

import { NeuralVoiceSettings, OpenAIVoiceName } from '../types/titan';
import { soundEngine } from './audio';

class NeuralVoiceService {
  private activeAudioElement: HTMLAudioElement | null = null;
  private audioCache: Map<string, string> = new Map(); // text -> objectUrl cache

  /**
   * Play studio-grade human voice using OpenAI TTS (GPT-4o Voice Engine)
   */
  public async speakOpenAINeural(
    text: string,
    apiKey: string,
    voice: OpenAIVoiceName = 'nova',
    speed: number = 0.95
  ): Promise<boolean> {
    try {
      this.stop();

      // Play introductory HUD ping
      soundEngine.playJarvisHudPing();

      const cacheKey = `openai_${voice}_${speed}_${text}`;
      let audioUrl = this.audioCache.get(cacheKey);

      if (!audioUrl) {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'tts-1', // ultra-fast low-latency neural model
            input: text,
            voice: voice, // 'nova' (GPT-4o female), 'shimmer', 'alloy', 'onyx'
            speed: Math.max(0.8, Math.min(1.2, speed))
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.error('OpenAI TTS Error:', errData);
          throw new Error(errData.error?.message || `HTTP ${response.status}`);
        }

        const blob = await response.blob();
        audioUrl = URL.createObjectURL(blob);
        this.audioCache.set(cacheKey, audioUrl);
      }

      const audio = new Audio(audioUrl);
      this.activeAudioElement = audio;
      audio.volume = 1.0;
      await audio.play();
      return true;
    } catch (err) {
      console.warn('OpenAI Neural Voice failed, falling back to English synthesizer:', err);
      // Seamless fallback to browser English engine
      soundEngine.speakVoiceMessage(text);
      return false;
    }
  }

  /**
   * Play ultra-realistic human voice using ElevenLabs API
   */
  public async speakElevenLabs(
    text: string,
    apiKey: string,
    voiceId: string = '21m00Tcm4TlvDq8ikWAM' // Rachel (natural female voice)
  ): Promise<boolean> {
    try {
      this.stop();
      soundEngine.playJarvisHudPing();

      const cacheKey = `eleven_${voiceId}_${text}`;
      let audioUrl = this.audioCache.get(cacheKey);

      if (!audioUrl) {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey.trim(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2_5',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.1,
              use_speaker_boost: true
            }
          })
        });

        if (!response.ok) {
          throw new Error(`ElevenLabs error: HTTP ${response.status}`);
        }

        const blob = await response.blob();
        audioUrl = URL.createObjectURL(blob);
        this.audioCache.set(cacheKey, audioUrl);
      }

      const audio = new Audio(audioUrl);
      this.activeAudioElement = audio;
      audio.volume = 1.0;
      await audio.play();
      return true;
    } catch (err) {
      console.warn('ElevenLabs Neural Voice failed, falling back:', err);
      soundEngine.speakVoiceMessage(text);
      return false;
    }
  }

  /**
   * Universal Smart Voice Annunciator:
   * Uses OpenAI (GPT-4o) if key provided, ElevenLabs if key provided, or optimized English Natural engine!
   */
  public async speakSmartVoice(
    text: string,
    settings?: NeuralVoiceSettings,
    options?: { pitch?: number; rate?: number; loop?: boolean }
  ) {
    if (settings?.provider === 'OPENAI_GPT4O' && settings.openaiApiKey) {
      const success = await this.speakOpenAINeural(
        text,
        settings.openaiApiKey,
        settings.openaiVoice || 'nova',
        options?.rate || 0.95
      );
      if (success) return;
    }

    if (settings?.provider === 'ELEVENLABS' && settings.elevenlabsApiKey) {
      const success = await this.speakElevenLabs(
        text,
        settings.elevenlabsApiKey,
        settings.elevenlabsVoiceId || '21m00Tcm4TlvDq8ikWAM'
      );
      if (success) return;
    }

    // Default: Calibrated English Natural Voice
    soundEngine.speakVoiceMessage(text, options);
  }

  public stop() {
    if (this.activeAudioElement) {
      this.activeAudioElement.pause();
      this.activeAudioElement.currentTime = 0;
      this.activeAudioElement = null;
    }
    soundEngine.stopSpeaking();
  }
}

export const neuralVoiceService = new NeuralVoiceService();
