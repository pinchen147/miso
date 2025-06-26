import { CameraView } from 'expo-camera';
import { visionService, VisionAnalysisResult } from './visionService';
import { ragService, RAGContext } from './ragService';

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
    currentStep: string,
    onAnalysisComplete: (result: CameraAnalysisResult) => void,
    previousSteps?: string[]
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
        const result = await this.analyzeCurrentFrame(
          cameraRef.current,
          currentStep,
          previousSteps
        );

        if (result) {
          this.lastAnalysis = result;
          onAnalysisComplete(result);
        }
      } catch (error) {
        console.error('Camera analysis error:', error);
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
    currentStep: string,
    previousSteps?: string[]
  ): Promise<CameraAnalysisResult | null> {
    try {
      // Capture frame
      const photo = await camera.takePictureAsync({
        base64: true,
        quality: 0.7, // Reduce quality for faster processing
        skipProcessing: true,
      });

      if (!photo.base64) {
        throw new Error('Failed to capture base64 image');
      }

      // Analyze vision
      const visionResult = await visionService.analyzeFrame(photo.base64);

      // Get RAG context
      const ragContext = await ragService.getRelevantContext(
        visionResult,
        currentStep,
        this.matchThreshold
      );

      // Generate contextual guidance
      const guidance = await ragService.generateContextualGuidance(
        visionResult,
        currentStep,
        ragContext,
        previousSteps
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
    currentStep: string
  ): Promise<CameraAnalysisResult | null> {
    return this.analyzeCurrentFrame(camera, currentStep);
  }
}

export const cameraAnalysisService = new CameraAnalysisService();