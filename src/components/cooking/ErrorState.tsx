import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface ErrorStateProps {
  message: string;
  onBack: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onBack }) => {
  return (
    <Container>
      <ErrorContainer>
        <ErrorText>{message}</ErrorText>
        <BackButton onPress={onBack}>
          <BackButtonText>Go Back</BackButtonText>
        </BackButton>
      </ErrorContainer>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f2d894;
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