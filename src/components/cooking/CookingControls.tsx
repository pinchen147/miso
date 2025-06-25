import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

interface CookingControlsProps {
  isListening: boolean;
  canGoPrevious: boolean;
  isLastStep: boolean;
  onVoiceCommand: () => void;
  onPrevious: () => void;
  onRepeat: () => void;
  onNext: () => void;
}

export const CookingControls: React.FC<CookingControlsProps> = ({
  isListening,
  canGoPrevious,
  isLastStep,
  onVoiceCommand,
  onPrevious,
  onRepeat,
  onNext,
}) => {
  return (
    <Controls>
      <VoiceButton 
        style={[isListening && styles.voiceButtonListening]}
        onPress={onVoiceCommand}
      >
        <Ionicons 
          name={isListening ? "mic" : "mic-outline"} 
          size={32} 
          color={isListening ? "#D9A441" : "#F2D894"} 
        />
      </VoiceButton>

      <NavigationControls>
        <NavButton 
          style={[!canGoPrevious && styles.navButtonDisabled]}
          onPress={onPrevious}
          disabled={!canGoPrevious}
        >
          <Ionicons name="chevron-back" size={24} color="#8B4513" />
          <NavButtonText>previous</NavButtonText>
        </NavButton>

        <RepeatButton onPress={onRepeat}>
          <Ionicons name="refresh" size={20} color="#8B4513" />
          <RepeatButtonText>repeat</RepeatButtonText>
        </RepeatButton>

        <NavButton onPress={onNext}>
          <NavButtonText>{isLastStep ? 'finish' : 'next'}</NavButtonText>
          <Ionicons name="chevron-forward" size={24} color="#8B4513" />
        </NavButton>
      </NavigationControls>
    </Controls>
  );
};

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

const styles = StyleSheet.create({
  voiceButtonListening: {
    backgroundColor: 'rgba(217, 164, 65, 0.8)',
    borderColor: '#D9A441',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(139, 69, 19, 0.3)',
  },
});