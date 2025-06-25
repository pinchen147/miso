import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { supabase } from '@/lib/supabase';
import { Recipe, RecipeStep } from '@/types/recipe';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

export default function CookingScreen() {
  const { recipeId, recipeName } = useLocalSearchParams<{
    recipeId: string;
    recipeName?: string;
  }>();

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [loading, setLoading] = useState(true);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (recipeId && typeof recipeId === 'string') {
      fetchRecipeData();
    }
  }, [recipeId]);

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

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  useEffect(() => {
    if (permission?.granted && currentStep) {
      speakText(`Step ${currentStep.step_number}: ${currentStep.instruction}`);
    }
  }, [currentStepIndex, permission?.granted]);

  const speakText = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
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
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
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

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#8B4513" />
          <LoadingText>Loading recipe...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <Container>
        <PermissionContainer>
          <Ionicons name="camera" size={64} color="#8B4513" />
          <PermissionTitle>camera access required</PermissionTitle>
          <PermissionText>
            miso ai needs camera access to provide real-time cooking guidance and monitor your progress.
          </PermissionText>
          <PermissionButton onPress={requestPermission}>
            <PermissionButtonText>grant camera access</PermissionButtonText>
          </PermissionButton>
        </PermissionContainer>
      </Container>
    );
  }

  if (!recipe || steps.length === 0) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorText>
            {!recipe ? 'Recipe not found' : 'No cooking steps available for this recipe'}
          </ErrorText>
          <BackButton onPress={() => router.back()}>
            <BackButtonText>Go Back</BackButtonText>
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
      >
        {/* Header */}
        <Header>
          <BackIconButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#F2D894" />
          </BackIconButton>
          <HeaderTitle numberOfLines={1}>
            {recipe.title}
          </HeaderTitle>
          <StepCounter>
            <StepCounterText>
              {currentStepIndex + 1}/{steps.length}
            </StepCounterText>
          </StepCounter>
        </Header>

        {/* Step Display */}
        <StepContainer>
          <StepTitle>
            step {currentStep?.step_number}
          </StepTitle>
          <StepText>
            {currentStep?.instruction}
          </StepText>
        </StepContainer>

        {/* Controls */}
        <Controls>
          {/* Voice Command Button */}
          <VoiceButton 
            style={[isListening && styles.voiceButtonListening]}
            onPress={handleVoiceCommand}
          >
            <Ionicons 
              name={isListening ? "mic" : "mic-outline"} 
              size={32} 
              color={isListening ? "#D9A441" : "#F2D894"} 
            />
          </VoiceButton>

          {/* Navigation Controls */}
          <NavigationControls>
            <NavButton 
              style={[currentStepIndex === 0 && styles.navButtonDisabled]}
              onPress={handlePreviousStep}
              disabled={currentStepIndex === 0}
            >
              <Ionicons name="chevron-back" size={24} color="#8B4513" />
              <NavButtonText>previous</NavButtonText>
            </NavButton>

            <RepeatButton onPress={handleRepeatStep}>
              <Ionicons name="refresh" size={20} color="#8B4513" />
              <RepeatButtonText>repeat</RepeatButtonText>
            </RepeatButton>

            <NavButton onPress={handleNextStep}>
              <NavButtonText>{isLastStep ? 'finish' : 'next'}</NavButtonText>
              <Ionicons name="chevron-forward" size={24} color="#8B4513" />
            </NavButton>
          </NavigationControls>
        </Controls>

        {/* AI Status Indicator */}
        <AIStatus>
          <AIIndicator>
            <Ionicons name="eye" size={16} color="#D9A441" />
            <AIStatusText>ai watching</AIStatusText>
          </AIIndicator>
          {isSpeaking && (
            <AIIndicator>
              <Ionicons name="volume-high" size={16} color="#D9A441" />
              <AIStatusText>speaking</AIStatusText>
            </AIIndicator>
          )}
        </AIStatus>
      </CameraView>
    </SafeAreaView>
  );
}

// Styled Components
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f2d894;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 16px;
  color: #8b4513;
  margin-top: 16px;
`;

const PermissionContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const PermissionTitle = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 20px;
  color: #8b4513;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const PermissionText = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 16px;
  color: #8b4513;
  text-align: center;
  line-height: 24px;
  margin-bottom: 32px;
`;

const PermissionButton = styled.TouchableOpacity`
  background-color: #d9a441;
  padding: 16px 32px;
  border-radius: 30px;
`;

const PermissionButtonText = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 16px;
  color: #8b4513;
  text-align: center;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const ErrorText = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 16px;
  color: #8b4513;
  text-align: center;
  margin-bottom: 24px;
  line-height: 24px;
`;

const BackButton = styled.TouchableOpacity`
  background-color: #d9a441;
  padding: 12px 24px;
  border-radius: 20px;
`;

const BackButtonText = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 16px;
  color: #8b4513;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.3);
`;

const BackIconButton = styled.TouchableOpacity`
  padding: 8px;
`;

const HeaderTitle = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 16px;
  color: #f2d894;
  flex: 1;
  text-align: center;
  margin: 0 16px;
`;

const StepCounter = styled.View`
  background-color: rgba(217, 164, 65, 0.8);
  padding: 6px 12px;
  border-radius: 16px;
`;

const StepCounterText = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 12px;
  color: #8b4513;
  text-align: center;
`;

const StepContainer = styled.View`
  position: absolute;
  top: ${height * 0.15}px;
  left: 16px;
  right: 16px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 16px;
`;

const StepTitle = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 18px;
  color: #d9a441;
  margin-bottom: 8px;
`;

const StepText = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 16px;
  color: #f2d894;
  line-height: 24px;
`;

const Controls = styled.View`
  position: absolute;
  bottom: 32px;
  left: 16px;
  right: 16px;
  align-items: center;
`;

const VoiceButton = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-width: 2px;
  border-color: rgba(242, 216, 148, 0.5);
`;

const NavigationControls = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const NavButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: rgba(217, 164, 65, 0.9);
  padding: 12px 16px;
  border-radius: 25px;
  min-width: 100px;
  justify-content: center;
`;

const NavButtonText = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 14px;
  color: #8b4513;
  margin: 0 4px;
`;

const RepeatButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: rgba(242, 216, 148, 0.9);
  padding: 12px 16px;
  border-radius: 25px;
`;

const RepeatButtonText = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 14px;
  color: #8b4513;
  margin-left: 4px;
`;

const AIStatus = styled.View`
  position: absolute;
  top: ${height * 0.4}px;
  right: 16px;
  align-items: flex-end;
`;

const AIIndicator = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 8px;
`;

const AIStatusText = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 12px;
  color: #f2d894;
  margin-left: 6px;
`;

// Regular StyleSheet for camera-specific styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2D894',
  },
  camera: {
    flex: 1,
  },
  voiceButtonListening: {
    backgroundColor: 'rgba(217, 164, 65, 0.8)',
    borderColor: '#D9A441',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
  },
});