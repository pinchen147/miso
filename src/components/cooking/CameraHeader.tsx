import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

interface CameraHeaderProps {
  onBack: () => void;
  title: string;
  currentStep: number;
  totalSteps: number;
}

export const CameraHeader: React.FC<CameraHeaderProps> = ({
  onBack,
  title,
  currentStep,
  totalSteps,
}) => {
  return (
    <Header>
      <BackIconButton onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#F2D894" />
      </BackIconButton>
      <HeaderTitle numberOfLines={1}>{title}</HeaderTitle>
      <StepCounter>
        <StepCounterText>{currentStep}/{totalSteps}</StepCounterText>
      </StepCounter>
    </Header>
  );
};

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