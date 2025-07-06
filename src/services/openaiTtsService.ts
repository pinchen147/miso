import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

// --- Constants ---
const TTS_VOICE_CONFIG = {
  voice: Platform.OS === 'ios' ? 'com.apple.ttsbundle.Daniel-compact' : 'en-GB-language',
  rate: 0.9,
  pitch: 0.8,
  quality: Speech.VoiceQuality.Enhanced,
};

// Remove the ensureDirExists function as it's no longer needed

/**
 * A service for handling Text-to-Speech (TTS) using Expo Speech.
 * It manages audio playback, including stopping and starting speech,
 * and ensures that only one audio stream plays at a time.
 */
export class OpenAITTSService {
  private isSpeaking = false;
  private currentSpeechId = 0; // Used to prevent race conditions
  private isInitialized = false;

  constructor() {
    // No initialization needed for Expo Speech
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }
    try {
      console.log('Initializing TTS service...');
      // Check if voices are available
      const voices = await Speech.getAvailableVoicesAsync();
      console.log('Available voices:', voices.length);
      this.isInitialized = true;
      console.log('TTS service initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize TTS service:', error);
    }
  }

  /**
   * Speaks the given text using Expo Speech.
   * If another speech request is made, the previous one is stopped.
   * @param text The text to be converted to speech.
   */
  async speak(text: string): Promise<void> {
    if (!this.isInitialized) {
      console.error("TTS Service not initialized. Call initialize() first.");
      return;
    }

    const speechId = ++this.currentSpeechId;
    console.log(`🎤 TTS (${speechId}): Speaking: "${text}"`);

    try {
      // Stop any current speech
      await this.stop();

      if (this.isNewerRequestInProgress(speechId)) {
        console.log(`🎤 TTS (${speechId}): Aborting, newer request started.`);
        return;
      }

      this.isSpeaking = true;

      await Speech.speak(text, {
        ...TTS_VOICE_CONFIG,
        onStart: () => {
          console.log(`🎤 TTS (${speechId}): Speech started`);
        },
        onDone: () => {
          console.log(`🎤 TTS (${speechId}): Speech completed`);
          this.resetState(speechId);
        },
        onStopped: () => {
          console.log(`🎤 TTS (${speechId}): Speech stopped`);
          this.resetState(speechId);
        },
        onError: (error) => {
          console.error(`🎤 TTS (${speechId}): Speech error -`, error);
          this.resetState(speechId);
        },
      });

    } catch (error) {
      console.error(`🎤 TTS (${speechId}): Error -`, error);
      this.resetState(speechId);
    }
  }

  /**
   * Stops the currently playing speech.
   */
  async stop(): Promise<void> {
    if (!this.isSpeaking) {
      return;
    }

    console.log('🎤 TTS: Stopping current speech...');
    try {
      await Speech.stop();
    } catch (error) {
      console.log('🎤 TTS: Stop warning (ignorable):', error instanceof Error ? error.message : String(error));
    } finally {
      this.isSpeaking = false;
    }
  }

  /**
   * Checks if the service is currently speaking.
   * @returns `true` if audio is playing, `false` otherwise.
   */
  isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  // Removed getAudio and playAudio methods as they're no longer needed with Expo Speech

  /**
   * Resets the service's state if the current speech ID matches.
   */
  private resetState(speechId: number): void {
    if (speechId === this.currentSpeechId) {
      console.log(`🎤 TTS (${speechId}): Resetting state.`);
      this.isSpeaking = false;
    }
  }

  /**
   * Checks if a newer request has been initiated.
   */
  private isNewerRequestInProgress(speechId: number): boolean {
    return speechId < this.currentSpeechId;
  }
}

export const openaiTtsService = new OpenAITTSService();
