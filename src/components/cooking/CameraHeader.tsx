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
      <HeaderTitle numberOfLines={1}>{title}</HeaderTitle>
    </Header>
  );
};

const Header = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
  padding-top: 50px;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
`;

const BackIconButton = styled.TouchableOpacity`
  padding: 8px;
`;

const HeaderTitle = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 16px;
  color: #f2d894;
  text-align: center;
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