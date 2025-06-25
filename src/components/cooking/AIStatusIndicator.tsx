import React from 'react';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

const { height } = Dimensions.get('window');

interface AIStatusIndicatorProps {
  isSpeaking: boolean;
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({ isSpeaking }) => {
  return (
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
  );
};

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