import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

export const LoadingState: React.FC = () => {
  return (
    <Container>
      <LoadingContainer>
        <ActivityIndicator size="large" color="#8B4513" />
        <LoadingText>Loading recipe...</LoadingText>
      </LoadingContainer>
    </Container>
  );
};

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