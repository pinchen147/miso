import React, { useState, useRef, RefObject } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useCookingSession } from '@/hooks/useCookingSession';
import { CameraHeader } from '@/components/cooking/CameraHeader';
import { LoadingState } from '@/components/cooking/LoadingState';
import { ErrorState } from '@/components/cooking/ErrorState';
import { PermissionState } from '@/components/cooking/PermissionState';

export default function CookingScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const cameraRef = useRef<CameraView>(null);

  const {
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
  } = useCookingSession(recipeId as string, cameraRef as RefObject<CameraView>);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Permission states
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return <PermissionState onRequestPermission={requestPermission} />;
  }

  // Error states
  if (!recipe) {
    return (
      <ErrorState 
        message="Recipe not found" 
        onBack={handleBack}
      />
    );
  }

  if (steps.length === 0) {
    return (
      <ErrorState 
        message="No cooking steps available for this recipe" 
        onBack={handleBack}
      />
    );
  }

  if (!currentStep) {
    return (
      <ErrorState 
        message="Unable to load cooking step" 
        onBack={handleBack}
      />
    );
  }

  // Main camera view
  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
      >
        <CameraHeader
          onBack={handleBack}
          title={recipe.title}
          currentStep={currentStepIndex + 1}
          totalSteps={steps.length}
        />
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2D894',
  },
  camera: {
    flex: 1,
  },
});