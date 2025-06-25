import React, { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useCookingSession } from '@/hooks/useCookingSession';
import { CameraHeader } from '@/components/cooking/CameraHeader';
import { StepDisplay } from '@/components/cooking/StepDisplay';
import { CookingControls } from '@/components/cooking/CookingControls';
import { AIStatusIndicator } from '@/components/cooking/AIStatusIndicator';
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
    handleNextStep,
    handlePreviousStep,
    handleVoiceCommand,
    handleRepeatStep,
    handleBack,
  } = useCookingSession(recipeId as string);

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
    <SafeAreaView style={styles.container}>
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

        <StepDisplay step={currentStep} />

        <CookingControls
          isListening={isListening}
          canGoPrevious={canGoPrevious}
          isLastStep={isLastStep}
          onVoiceCommand={handleVoiceCommand}
          onPrevious={handlePreviousStep}
          onRepeat={handleRepeatStep}
          onNext={handleNextStep}
        />

        <AIStatusIndicator isSpeaking={isSpeaking} />
      </CameraView>
    </SafeAreaView>
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