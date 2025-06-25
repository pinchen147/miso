import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { RecipeStep } from '@/types/recipe';

const { height } = Dimensions.get('window');

interface StepDisplayProps {
  step: RecipeStep;
}

export const StepDisplay: React.FC<StepDisplayProps> = ({ step }) => {
  return (
    <StepContainer>
      <StepTitle>step {step.step_number}</StepTitle>
      <StepText>{step.instruction}</StepText>
    </StepContainer>
  );
};

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