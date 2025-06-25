import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Recipe, RecipeStep } from '@/types/recipe';
import * as Speech from 'expo-speech';

export const useCookingSession = (recipeId: string) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const speakText = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
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
      speakText(`Step ${currentStep.step_number}: ${currentStep.instruction}`);
    }
  };

  const handleBack = () => {
    stopSpeaking();
    router.back();
  };

  // Fetch data on mount
  useEffect(() => {
    if (recipeId) {
      fetchRecipeData();
    }
  }, [recipeId]);

  // Speak current step when it changes
  useEffect(() => {
    if (currentStep) {
      speakText(`Step ${currentStep.step_number}: ${currentStep.instruction}`);
    }
  }, [currentStepIndex]);

  // Stop audio when screen loses focus or unmounts
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        stopSpeaking();
      };
    }, [])
  );

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

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
    handleNextStep,
    handlePreviousStep,
    handleVoiceCommand,
    handleRepeatStep,
    handleBack,
  };
};