import React, { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { CameraView } from 'expo-camera';
import { supabase } from '@/lib/supabase';
import { Recipe, RecipeStep } from '@/types/recipe';
import { cameraAnalysisService, CameraAnalysisResult } from '@/services/cameraService';
import { openaiTtsService } from '@/services/openaiTtsService';

export const useCookingSession = (recipeId: string, cameraRef?: React.RefObject<CameraView>) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CameraAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ragGuidance, setRagGuidance] = useState<string>('');
  const [hasPlayedIntro, setHasPlayedIntro] = useState<boolean>(false);
  const lastSpokenGuidance = useRef<string>('');
  const lastVisionSummary = useRef<string>('');
  const lastSceneObjects = useRef<string[]>([]);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const canGoPrevious = currentStepIndex > 0;

  // Helper functions moved below to avoid duplication

  // Check speech availability
  const checkSpeechAvailability = async () => {
    try {
      console.log('🎤 Checking OpenAI TTS availability...');
      console.log('🎤 OpenAI TTS service ready');
      return true;
    } catch (error) {
      console.error('🎤 OpenAI TTS check failed:', error);
      return false;
    }
  };

  const fetchRecipeData = async () => {
    try {
      setLoading(true);
      
      // Fetch recipe details
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();

      if (recipeError) {
        console.error('Error fetching recipe:', recipeError);
        setRecipe(null);
        return;
      }

      setRecipe(recipeData);

      // Fetch recipe steps
      const { data: stepsData, error: stepsError } = await supabase
        .from('recipe_steps')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('step_number', { ascending: true });

      if (stepsError) {
        console.error('Error fetching steps:', stepsError);
        setSteps([]);
      } else {
        setSteps(stepsData || []);
      }

    } catch (err) {
      console.error('Error in fetchRecipeData:', err);
      setRecipe(null);
      setSteps([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to prevent repetitive guidance
  const isSimilarGuidance = (newGuidance: string, lastGuidance: string): boolean => {
    if (!newGuidance || !lastGuidance) return false;
    
    // Remove punctuation and normalize spacing
    const normalize = (text: string) => text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    const normalizedNew = normalize(newGuidance);
    const normalizedLast = normalize(lastGuidance);
    
    // Check if they're exactly the same
    if (normalizedNew === normalizedLast) return true;
    
    // Check if one is contained in the other (similar meaning)
    const shortLen = Math.min(normalizedNew.length, normalizedLast.length);
    if (shortLen < 10) return normalizedNew === normalizedLast;
    
    // Calculate similarity ratio
    const longer = normalizedNew.length > normalizedLast.length ? normalizedNew : normalizedLast;
    const shorter = normalizedNew.length <= normalizedLast.length ? normalizedNew : normalizedLast;
    
    return longer.includes(shorter) || calculateSimilarity(normalizedNew, normalizedLast) > 0.8;
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));
    
    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i] + 1,     // deletion
          matrix[j - 1][i - 1] + cost // substitution
        );
      }
    }
    
    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len2][len1]) / maxLen;
  };

  const isSignificantGuidanceChange = (newGuidance: string, lastGuidance: string): boolean => {
    if (!lastGuidance) return true;
    
    // Check for key action words that indicate new instruction
    const actionWords = ['chop', 'cut', 'mix', 'stir', 'add', 'remove', 'heat', 'cool', 'flip', 'turn', 'season'];
    const newActions = actionWords.filter(word => newGuidance.toLowerCase().includes(word));
    const lastActions = actionWords.filter(word => lastGuidance.toLowerCase().includes(word));
    
    // If different actions are mentioned, it's significant
    return newActions.join(',') !== lastActions.join(',');
  };

  const stopSpeaking = async () => {
    try {
      await openaiTtsService.stop();
      setIsSpeaking(false);
    } catch (error) {
      console.error('🎤 Error stopping speech:', error);
    }
  };

  const playIntroGreeting = () => {
    if (recipe && !hasPlayedIntro) {
      const introText = `I'm Miso. Today we're making ${recipe.title}. Try not to burn anything.`;
      speakText(introText);
      setHasPlayedIntro(true);
    }
  };

  const handleNextStep = () => {
    if (!isLastStep && steps.length > 0) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      Alert.alert(
        'Recipe Complete!',
        'Congratulations! You\'ve finished cooking. Enjoy your meal!',
        [
          {
            text: 'Finish',
            onPress: () => {
              stopSpeaking();
              router.back();
            },
          },
        ]
      );
    }
  };

  const handlePreviousStep = () => {
    if (canGoPrevious) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleVoiceCommand = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      Alert.alert('Voice Command', 'Voice commands coming soon!');
    }, 2000);
  };

  const handleRepeatStep = () => {
    if (currentStep) {
      speakText(`Step ${currentStep.step_number}: ${currentStep.instruction}`, true);
    }
  };


  const startCameraAnalysis = () => {
    if (!cameraRef?.current || !currentStep) {
      console.log('Camera analysis not started - missing refs:', {
        hasCamera: !!cameraRef?.current,
        hasStep: !!currentStep
      });
      return;
    }

    console.log('Starting camera analysis for step:', currentStep.step_number);
    setIsAnalyzing(true);
    const completedSteps = steps.slice(0, currentStepIndex);

    cameraAnalysisService.startAnalysis(
      cameraRef,
      currentStep,
      (result: CameraAnalysisResult) => {
        console.log('Analysis result received:', result.guidance);
        setAnalysisResult(result);
        setRagGuidance(result.guidance);
        
        // Smart comparison to avoid repetitive guidance
        const currentVisionSummary = result.visionResult.summary;
        const currentObjects = result.visionResult.objects.sort().join(',');
        
        // Check if the scene has significantly changed
        const sceneChanged = (
          currentVisionSummary !== lastVisionSummary.current ||
          currentObjects !== lastSceneObjects.current.sort().join(',')
        );
        
        // Check if guidance is meaningfully different (not just minor word changes)
        const guidanceChanged = result.guidance && (
          !lastSpokenGuidance.current ||
          !isSimilarGuidance(result.guidance, lastSpokenGuidance.current)
        );
        
        // Only speak if scene changed OR guidance is meaningfully different
        if (guidanceChanged && (sceneChanged || isSignificantGuidanceChange(result.guidance, lastSpokenGuidance.current))) {
          console.log('🎯 Speaking new guidance - scene or content changed significantly');
          lastSpokenGuidance.current = result.guidance;
          lastVisionSummary.current = currentVisionSummary;
          lastSceneObjects.current = [...result.visionResult.objects];
          speakText(result.guidance);
        } else {
          console.log('🔇 Skipping repetitive guidance - scene/content similar');
        }
      },
      completedSteps
    ).catch((error) => {
      console.error('Failed to start camera analysis:', error);
      setIsAnalyzing(false);
    });
  };

  const stopCameraAnalysis = () => {
    cameraAnalysisService.stopAnalysis();
    setIsAnalyzing(false);
    setAnalysisResult(null);
  };

  const handleBack = () => {
    stopSpeaking();
    stopCameraAnalysis();
    setHasPlayedIntro(false); // Reset intro state for next session
    router.back();
  };

  const [isTtsReady, setIsTtsReady] = useState(false);

  // ... (rest of the state declarations)

  // Check speech and fetch data on mount
  useEffect(() => {
    const initializeSession = async () => {
      await openaiTtsService.initialize();
      setIsTtsReady(true); // Set TTS ready state
      await checkSpeechAvailability();
      if (recipeId) {
        await fetchRecipeData();
      }
    };
    
    initializeSession();
  }, [recipeId]);

  const speakText = async (text: string, useRagGuidance: boolean = false) => {
    if (!isTtsReady) {
      console.log('🎤 TTS not ready, skipping speech');
      return;
    }

    // Prevent interrupting current speech
    if (isSpeaking) {
      console.log('🎤 Already speaking, skipping new speech request');
      return;
    }

    const textToSpeak = useRagGuidance && ragGuidance ? ragGuidance : text;
    
    if (!textToSpeak || textToSpeak.trim() === '') {
      console.log('🎤 No text to speak');
      return;
    }

    console.log('🎤 Attempting to speak:', textToSpeak.substring(0, 50) + '...');
    
    setIsSpeaking(true);
    
    try {
      await openaiTtsService.speak(textToSpeak);
      console.log('🎤 ✅ TTS completed successfully');
      setIsSpeaking(false);
    } catch (error) {
      console.error('🎤 ❌ TTS failed:', error);
      setIsSpeaking(false);
    }
  };

  // Play intro greeting when recipe is first loaded
  useEffect(() => {
    if (recipe && !loading && !hasPlayedIntro) {
      playIntroGreeting();
    }
  }, [recipe, loading, hasPlayedIntro]);

  // Start/restart analysis when step changes
  useEffect(() => {
    if (currentStep && hasPlayedIntro) {
      stopCameraAnalysis(); // Stop previous analysis
      
      // Reset tracking for new step
      lastSpokenGuidance.current = '';
      lastVisionSummary.current = '';
      lastSceneObjects.current = [];
      
      // Speak the step first
      speakText(`Step ${currentStep.step_number}: ${currentStep.instruction}`);
      
      // Start new analysis after a longer delay to ensure camera is ready
      setTimeout(() => {
        if (cameraRef?.current) {
          startCameraAnalysis();
        } else {
          console.log('Camera not ready, retrying in 1 second...');
          setTimeout(() => {
            if (cameraRef?.current) {
              startCameraAnalysis();
            }
          }, 1000);
        }
      }, 3000); // 3 second delay for speech to start and camera to be ready
    }
  }, [currentStepIndex, cameraRef, hasPlayedIntro]);

  // Clean up analysis when hook unmounts or dependencies change
  useEffect(() => {
    return () => {
      stopCameraAnalysis();
    };
  }, []);

  // Stop audio and analysis when screen loses focus or unmounts
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        stopSpeaking();
        stopCameraAnalysis();
      };
    }, [])
  );

  return {
    recipe,
    steps,
    loading,
    currentStep,
    currentStepIndex,
    isLastStep,
    canGoPrevious,
    isListening,
    isSpeaking,
    isAnalyzing,
    analysisResult,
    ragGuidance,
    handleNextStep,
    handlePreviousStep,
    handleVoiceCommand,
    handleRepeatStep,
    handleBack,
    startCameraAnalysis,
    stopCameraAnalysis,
  };
};