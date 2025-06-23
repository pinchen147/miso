import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import {
  useFonts,
  LibreBaskerville_400Regular,
  LibreBaskerville_400Regular_Italic,
  LibreBaskerville_700Bold,
} from '@expo-google-fonts/libre-baskerville';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    LibreBaskerville_400Regular,
    LibreBaskerville_400Regular_Italic,
    LibreBaskerville_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2D894' }}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }


  return (
    <>
      <StatusBar style="dark" backgroundColor="#F2D894" />
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: 'Miso',
          headerTitleStyle: {
            fontFamily: 'LibreBaskerville_700Bold',
            fontSize: 24,
            color: '#8B4513'
          },
          headerStyle: { backgroundColor: '#F2D894' },
          headerShadowVisible: false,
          headerTintColor: '#8B4513',
          contentStyle: { backgroundColor: '#F2D894' }
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="session"
          options={{
            headerBackTitle: 'Recipes',
          }}
        />
      </Stack>
    </>
  );
}