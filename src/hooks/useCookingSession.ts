import React, { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { CameraView } from 'expo-camera';
import { supabase } from '@/lib/supabase';
import { Recipe, RecipeStep } from '@/types/recipe';
import { cameraAnalysisService, CameraAnalysisResult } from '@/services/cameraService';
import * as Speech from 'expo-speech';

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

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const canGoPrevious = currentStepIndex > 0;

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

  const speakText = (text: string, useRagGuidance: boolean = false) => {
    setIsSpeaking(true);
    const textToSpeak = useRagGuidance && ragGuidance ? ragGuidance : text;
    Speech.speak(textToSpeak, {
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
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
    if (!cameraRef?.current || !currentStep) return;

    setIsAnalyzing(true);
    const completedSteps = steps.slice(0, currentStepIndex).map(step => 
      `Step ${step.step_number}: ${step.instruction}`
    );

    cameraAnalysisService.startAnalysis(
      cameraRef,
      currentStep.instruction,
      (result: CameraAnalysisResult) => {
        setAnalysisResult(result);
        setRagGuidance(result.guidance);
      },
      completedSteps
    );
  };

  const stopCameraAnalysis = () => {
    cameraAnalysisService.stopAnalysis();
    setIsAnalyzing(false);
    setAnalysisResult(null);
  };

  const handleBack = () => {
    stopSpeaking();
    stopCameraAnalysis();
    router.back();
  };

  // Fetch data on mount
  useEffect(() => {
    if (recipeId) {
      fetchRecipeData();
    }
  }, [recipeId]);

  // Start/restart analysis when step changes
  useEffect(() => {
    if (currentStep) {
      stopCameraAnalysis(); // Stop previous analysis
      
      // Speak the step first
      speakText(`Step ${currentStep.step_number}: ${currentStep.instruction}`);
      
      // Start new analysis after a brief delay
      setTimeout(() => {
        if (cameraRef?.current) {
          startCameraAnalysis();
        }
      }, 2000); // 2 second delay for speech to start
    }
  }, [currentStepIndex, cameraRef]);

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