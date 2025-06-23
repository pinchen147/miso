import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
// @ts-ignore - Linter can't find module, but it works at runtime
import { router, useLocalSearchParams } from 'expo-router';
import { SAMPLE_RECIPES } from '../src/data/recipes';
import { ThemedText } from '../src/components/ThemedText';

export default function SessionScreen() {
  const { recipeId, recipeName } = useLocalSearchParams<{
    recipeId: string;
    recipeName: string;
  }>();
  
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const recipe = SAMPLE_RECIPES.find(r => r.id === recipeId);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    // Welcome message when session starts
    if (recipe) {
      Speech.speak(`Welcome to your cooking session! Today we're making ${recipe.title}. Let's get started!`, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
      });
    }
  }, [recipe]);

  const handleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setIsListening(true);
    
    // Animation for recording state
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate AI response after 3 seconds
    setTimeout(() => {
      setIsListening(false);
      simulateAIResponse();
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsListening(false);
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const simulateAIResponse = () => {
    const responses = [
      `Great! I can see you're working on ${recipe?.title}. Let's continue with the next step.`,
      "I can see your ingredients on the counter. Make sure everything is at room temperature for best results.",
      "Perfect! Your technique looks good. Keep going with confidence.",
      "I notice you're making good progress. Remember to take your time with each step.",
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    Speech.speak(randomResponse, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.8,
    });
  };

  const handleNextStep = () => {
    if (recipe?.steps && currentStep < recipe.steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const step = recipe.steps[nextStep];
      Speech.speak(`Step ${step.stepNumber}: ${step.instruction}`, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
      });
    } else {
      Speech.speak("Congratulations! You've completed the recipe. Enjoy your meal!", {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
      });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const step = recipe?.steps?.[prevStep];
      if (step) {
        Speech.speak(`Step ${step.stepNumber}: ${step.instruction}`, {
          language: 'en-US',
          pitch: 1.0,
          rate: 0.8,
        });
      }
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ThemedText>Requesting camera permission...</ThemedText>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.permissionText}>Camera access is needed for the cooking session</ThemedText>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <ThemedText style={styles.permissionButtonText}>Grant Permission</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        {/* Header */}
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.placeholder} />
          </View>
        </SafeAreaView>

        {/* Current Step Display */}
        {recipe?.steps && (
          <View style={styles.stepDisplay}>
            <ThemedText style={styles.stepText}>
              Step {currentStep + 1} of {recipe.steps.length}
            </ThemedText>
            <ThemedText style={styles.stepInstruction}>
              {recipe.steps[currentStep]?.instruction}
            </ThemedText>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.controls}>
            {/* Step Navigation */}
            <View style={styles.stepControls}>
              <TouchableOpacity
                style={[styles.stepButton, currentStep === 0 && styles.stepButtonDisabled]}
                onPress={handlePreviousStep}
                disabled={currentStep === 0}
              >
                <Ionicons name="chevron-back" size={24} color={currentStep === 0 ? "#666" : "#fff"} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.stepButton,
                  recipe?.steps && currentStep >= recipe.steps.length - 1 && styles.stepButtonDisabled
                ]}
                onPress={handleNextStep}
                disabled={recipe?.steps ? currentStep >= recipe.steps.length - 1 : true}
              >
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color={recipe?.steps && currentStep >= recipe.steps.length - 1 ? "#666" : "#fff"} 
                />
              </TouchableOpacity>
            </View>

            {isListening && (
              <Animated.View style={[styles.listeningIndicator, { opacity: pulseAnim }]}>
                <ThemedText style={styles.listeningText}>AI Assistant is listening...</ThemedText>
              </Animated.View>
            )}
            
            <TouchableOpacity
              style={styles.recordButton}
              onPress={handleRecording}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.recordButtonInner,
                  {
                    backgroundColor: isRecording ? '#ff4444' : '#000',
                    transform: [
                      { scale: isRecording ? scaleAnim : 1 },
                    ],
                  },
                ]}
              >
                <Ionicons 
                  name={isRecording ? "stop" : "mic"} 
                  size={28} 
                  color="white" 
                />
              </Animated.View>
            </TouchableOpacity>
            
            <ThemedText style={styles.recipeInfo}>Cooking: {recipeName}</ThemedText>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2D894',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    padding: 5,
  },

  placeholder: {
    width: 38,
  },
  stepDisplay: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 12,
  },
  stepText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  stepInstruction: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    alignItems: 'center',
  },
  controls: {
    alignItems: 'center',
  },
  stepControls: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 20,
  },
  stepButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  listeningIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  listeningText: {
    color: 'white',
    fontSize: 14,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeInfo: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  permissionText: {
    fontSize: 18,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  permissionButton: {
    backgroundColor: '#D9A441',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});