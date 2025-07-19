import OpenAI from 'openai';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// --- Constants ---
const OPENAI_CONFIG = {
  model: 'gpt-4o-mini-tts',
  voice: 'ballad' as const,
  instructions: 'Speak in a calm, friendly, and helpful tone suitable for cooking guidance.',
};

/**
 * A service for handling Text-to-Speech (TTS) using OpenAI's TTS API.
 * It manages audio playback, including stopping and starting speech,
 * and ensures that only one audio stream plays at a time.
 */
export class OpenAITTSService {
  private isSpeaking = false;
  private currentSpeechId = 0; // Used to prevent race conditions
  private isInitialized = false;
  private openai: OpenAI | null = null;
  private currentSound: Audio.Sound | null = null;

  constructor() {
    // Initialize will handle OpenAI setup
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }
    try {
      console.log('Initializing OpenAI TTS service...');
      
      // Configure audio session for playback
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      
      // Initialize OpenAI client
      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not found in environment variables');
      }
      
      this.openai = new OpenAI({ apiKey });
      this.isInitialized = true;
      console.log('OpenAI TTS service initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize OpenAI TTS service:', error);
      throw error;
    }
  }

  /**
   * Speaks the given text using OpenAI's TTS API.
   * If another speech request is made, the previous one is stopped.
   * @param text The text to be converted to speech.
   */
  async speak(text: string): Promise<void> {
    if (!this.isInitialized || !this.openai) {
      console.error("OpenAI TTS Service not initialized. Call initialize() first.");
      return;
    }

    const speechId = ++this.currentSpeechId;
    console.log(`🎤 OpenAI TTS (${speechId}): Speaking: "${text.substring(0, 50)}..."`);

    try {
      // Stop any current speech
      await this.stop();

      if (this.isNewerRequestInProgress(speechId)) {
        console.log(`🎤 OpenAI TTS (${speechId}): Aborting, newer request started.`);
        return;
      }

      this.isSpeaking = true;

      // Generate speech using OpenAI API
      const response = await this.openai.audio.speech.create({
        model: OPENAI_CONFIG.model,
        voice: OPENAI_CONFIG.voice,
        input: text,
        instructions: OPENAI_CONFIG.instructions,
      });

      if (this.isNewerRequestInProgress(speechId)) {
        console.log(`🎤 OpenAI TTS (${speechId}): Aborting after API call, newer request started.`);
        return;
      }

      // Convert response to audio data
      const audioData = await response.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioData)));
      
      // Save to temporary file
      const fileUri = `${FileSystem.documentDirectory}speech_${speechId}.mp3`;
      await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (this.isNewerRequestInProgress(speechId)) {
        console.log(`🎤 OpenAI TTS (${speechId}): Aborting after file write, newer request started.`);
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
        return;
      }

      // Create and play the sound
      const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
      this.currentSound = sound;
      
      // Set up playback status update callback
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log(`🎤 OpenAI TTS (${speechId}): Speech completed`);
          this.cleanup(speechId, fileUri);
        }
      });

      console.log(`🎤 OpenAI TTS (${speechId}): Starting playback`);
      await sound.playAsync();

    } catch (error) {
      console.error(`🎤 OpenAI TTS (${speechId}): Error -`, error);
      this.resetState(speechId);
    }
  }

  /**
   * Stops the currently playing speech.
   */
  async stop(): Promise<void> {
    if (!this.isSpeaking || !this.currentSound) {
      return;
    }

    console.log('🎤 OpenAI TTS: Stopping current speech...');
    try {
      await this.currentSound.stopAsync();
      await this.currentSound.unloadAsync();
      this.currentSound = null;
    } catch (error) {
      console.log('🎤 OpenAI TTS: Stop warning (ignorable):', error instanceof Error ? error.message : String(error));
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

  /**
   * Cleans up resources after speech playback.
   */
  private async cleanup(speechId: number, fileUri: string): Promise<void> {
    if (speechId === this.currentSpeechId) {
      if (this.currentSound) {
        await this.currentSound.unloadAsync();
        this.currentSound = null;
      }
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
      this.resetState(speechId);
    }
  }

  /**
   * Resets the service's state if the current speech ID matches.
   */
  private resetState(speechId: number): void {
    if (speechId === this.currentSpeechId) {
      console.log(`🎤 OpenAI TTS (${speechId}): Resetting state.`);
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
