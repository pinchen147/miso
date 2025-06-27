import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// --- Constants ---
const AUDIO_CACHE_DIRECTORY = FileSystem.cacheDirectory;
const TTS_API_URL = 'https://api.openai.com/v1/audio/speech';
const TTS_MODEL = 'tts-1';
const TTS_VOICE = 'nova';

/**
 * A service for handling Text-to-Speech (TTS) using OpenAI's API.
 * It manages audio playback, including stopping and starting speech,
 * and ensures that only one audio stream plays at a time.
 */
export class OpenAITTSService {
  private sound: Audio.Sound | null = null;
  private isSpeaking = false;
  private currentPlaybackId = 0; // Used to prevent race conditions

  /**
   * Generates and speaks audio from the given text.
   * If another speech request is made, the previous one is stopped.
   * @param text The text to be converted to speech.
   */
  async speak(text: string): Promise<void> {
    const playbackId = ++this.currentPlaybackId;

    console.log(`🎤 TTS (${playbackId}): Generating speech...`);

    try {
      // Stop any currently playing audio.
      await this.stop();

      // If a newer request has started while stopping, abort this one.
      if (this.isNewerRequestInProgress(playbackId)) {
        console.log(`🎤 TTS (${playbackId}): Aborting, newer request started.`);
        return;
      }

      this.isSpeaking = true;

      // 1. Generate Speech with OpenAI
      const audioBlob = await this.generateSpeechBlob(text, playbackId);
      if (!audioBlob) return; // Aborted in generateSpeechBlob

      // 2. Save Audio to a File
      const audioUri = await this.saveAudioToFile(audioBlob, playbackId);
      if (!audioUri) return; // Aborted in saveAudioToFile

      // 3. Play the Audio
      await this.playAudio(audioUri, playbackId);

    } catch (error) {
      console.error(`🎤 TTS (${playbackId}): Error -`, error);
      this.resetState(playbackId);
    }
  }

  /**
   * Stops the currently playing audio and unloads it from memory.
   */
  async stop(): Promise<void> {
    // Invalidate any ongoing playback requests.
    this.currentPlaybackId++;
    
    if (!this.sound) {
      this.isSpeaking = false;
      return;
    }

    console.log('🎤 TTS: Stopping current sound...');
    try {
      // Detach the status update listener to prevent lingering callbacks.
      await this.sound.setOnPlaybackStatusUpdate(null);
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
    } catch (error) {
      // It's okay if it fails—the sound might already be unloaded.
      console.log('🎤 TTS: Stop warning (ignorable):', error instanceof Error ? error.message : String(error));
    } finally {
      this.sound = null;
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

  // --- Private Helper Methods ---

  /**
   * Fetches the audio blob from the OpenAI TTS API.
   */
  private async generateSpeechBlob(text: string, playbackId: number): Promise<Blob | null> {
    const response = await fetch(TTS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: TTS_MODEL,
        voice: TTS_VOICE,
        input: text,
        speed: 1.3,
        instructions: 'Speak in a warm, encouraging, and helpful cooking assistant tone.',
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI TTS API error: ${response.status} ${response.statusText}`);
    }

    if (this.isNewerRequestInProgress(playbackId)) {
      console.log(`🎤 TTS (${playbackId}): Aborting after fetch, newer request started.`);
      return null;
    }

    return response.blob();
  }

  /**
   * Saves the audio blob to a local file and returns the URI.
   */
  private async saveAudioToFile(blob: Blob, playbackId: number): Promise<string | null> {
    const uri = `${AUDIO_CACHE_DIRECTORY}speech_${playbackId}.mp3`;

    // FileReader is the standard way to read a Blob in React Native.
    const reader = new FileReader();
    const base64Data = await new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        // Result is a data URL (e.g., "data:audio/mpeg;base64,..."). We need to strip the prefix.
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });

    if (this.isNewerRequestInProgress(playbackId)) {
      console.log(`🎤 TTS (${playbackId}): Aborting after save, newer request started.`);
      return null;
    }

    await FileSystem.writeAsStringAsync(uri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log(`🎤 TTS (${playbackId}): Audio saved to`, uri);
    return uri;
  }

  /**
   * Loads and plays the audio from the given URI.
   */
  private async playAudio(uri: string, playbackId: number): Promise<void> {
    const { sound } = await Audio.Sound.createAsync({ uri });
    this.sound = sound;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        console.log(`🎤 TTS (${playbackId}): Playback completed.`);
        sound.unloadAsync().catch(() => {}); // Unload the sound to free up resources.
        this.resetState(playbackId);
      }
    });

    await sound.playAsync();
  }

  /**
   * Resets the service's state if the current playback ID matches.
   */
  private resetState(playbackId: number): void {
    if (playbackId === this.currentPlaybackId) {
      this.sound = null;
      this.isSpeaking = false;
    }
  }

  /**
   * Checks if a newer request has been initiated.
   */
  private isNewerRequestInProgress(playbackId: number): boolean {
    return playbackId !== this.currentPlaybackId;
  }
}

export const openaiTtsService = new OpenAITTSService();
