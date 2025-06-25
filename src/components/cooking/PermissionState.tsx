import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

interface PermissionStateProps {
  onRequestPermission: () => void;
}

export const PermissionState: React.FC<PermissionStateProps> = ({ onRequestPermission }) => {
  return (
    <Container>
      <PermissionContainer>
        <Ionicons name="camera" size={64} color="#8B4513" />
        <PermissionTitle>camera access required</PermissionTitle>
        <PermissionText>
          miso ai needs camera access to provide real-time cooking guidance and monitor your progress.
        </PermissionText>
        <PermissionButton onPress={onRequestPermission}>
          <PermissionButtonText>grant camera access</PermissionButtonText>
        </PermissionButton>
      </PermissionContainer>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f2d894;
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