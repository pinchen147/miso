import { CameraView } from 'expo-camera';
import { visionService, VisionAnalysisResult } from './visionService';
import { ragService, RAGContext } from './ragService';
import { RecipeStep } from '@/types/recipe';

export interface CameraAnalysisResult {
  visionResult: VisionAnalysisResult;
  ragContext: RAGContext;
  guidance: string;
  timestamp: number;
}

export class CameraAnalysisService {
  private isAnalyzing = false;
  private analysisInterval: NodeJS.Timeout | null = null;
  private lastAnalysis: CameraAnalysisResult | null = null;

  constructor(
    private fps: number = 1,
    private matchThreshold: number = 0.7
  ) {}

  async startAnalysis(
    cameraRef: React.RefObject<CameraView>,
    currentStep: RecipeStep,
    onAnalysisComplete: (result: CameraAnalysisResult) => void,
    completedSteps: RecipeStep[] = []
  ): Promise<void> {
    if (this.analysisInterval) {
      this.stopAnalysis();
    }

    const intervalMs = 1000 / this.fps;

    this.analysisInterval = setInterval(async () => {
      if (this.isAnalyzing || !cameraRef.current) {
        return;
      }

      try {
        this.isAnalyzing = true;
        
        // Add timeout to prevent hanging
        const analysisPromise = this.analyzeCurrentFrame(
          cameraRef.current,
          currentStep,
          completedSteps
        );
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Camera analysis timeout')), 15000)
        );
        
        const result = await Promise.race([analysisPromise, timeoutPromise]) as CameraAnalysisResult | null;

        if (result) {
          this.lastAnalysis = result;
          onAnalysisComplete(result);
          // TTS is handled by the cooking session hook
        }
      } catch (error) {
        console.error('📷 ❌ Camera analysis error:', error instanceof Error ? error.message : String(error));
        // Don't log full error object to reduce noise
      } finally {
        this.isAnalyzing = false;
      }
    }, intervalMs);
  }

  stopAnalysis(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    this.isAnalyzing = false;
  }

  private async analyzeCurrentFrame(
    camera: CameraView,
    currentStep: RecipeStep,
    completedSteps: RecipeStep[] = []
  ): Promise<CameraAnalysisResult | null> {
    try {
      // Check if camera ref is still valid
      if (!camera) {
        console.error('📷 Camera reference is null');
        throw new Error('Camera reference is null');
      }

      console.log('📷 Attempting to capture frame...');

      // Capture frame with silent, smooth options for video-like analysis
      const photo = await camera.takePictureAsync({
        base64: true,
        quality: 0.3, // Lower quality for faster processing
        skipProcessing: true,
        exif: false,
        imageType: 'jpg',
        // Silent capture option
        shutterSound: false,
      });

      if (!photo) {
        throw new Error('No photo object returned');
      }

      if (!photo.base64) {
        console.error('📷 Photo captured but no base64 data:', photo);
        throw new Error('Failed to capture base64 image');
      }

      console.log('📷 ✅ Frame captured successfully, size:', photo.base64.length);

      // Analyze vision
      const visionResult = await visionService.analyzeFrame(photo.base64);

      // Get RAG context
      const ragContext = await ragService.getRelevantContext(
        visionResult,
        currentStep.instruction,
        this.matchThreshold
      );

      // Generate guidance
      const guidance = await ragService.generateGuidance(
        currentStep,
        visionResult,
        completedSteps
      );

      return {
        visionResult,
        ragContext,
        guidance,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error analyzing camera frame:', error);
      return null;
    }
  }

  getLastAnalysis(): CameraAnalysisResult | null {
    return this.lastAnalysis;
  }

  updateMatchThreshold(threshold: number): void {
    this.matchThreshold = Math.max(0, Math.min(1, threshold));
  }

  updateFPS(fps: number): void {
    this.fps = Math.max(0.1, Math.min(5, fps)); // Limit between 0.1 and 5 FPS
    
    // Restart analysis with new FPS if currently running
    if (this.analysisInterval) {
      // Note: This would require storing the current parameters
      // In a real implementation, you'd want to store these
      console.log(`FPS updated to ${this.fps}. Restart analysis to apply changes.`);
    }
  }

  // Test method for debugging
  async testSingleAnalysis(
    camera: CameraView,
    currentStep: RecipeStep,
    completedSteps: RecipeStep[] = []
  ): Promise<CameraAnalysisResult | null> {
    return this.analyzeCurrentFrame(camera, currentStep, completedSteps);
  }
}

export const cameraAnalysisService = new CameraAnalysisService();