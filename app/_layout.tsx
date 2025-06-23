import React from 'react';
// @ts-ignore - expo-router types provided via expo package
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';

// helper to lowercase recursively
function toLower(node: any): any {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node).toLowerCase();
  }
  if (Array.isArray(node)) {
    return node.map(toLower);
  }
  return node;
}

export default function RootLayout() {
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'GenRyuHead': require('../assets/font/GenRyuMin2TW-H.ttf'),
    'GenRyuBody': require('../assets/font/GenRyuMin2TW-B.ttf'),
  });

  // Wait until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Apply global font & lowercase once fonts are ready
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Text as any).defaultProps = {
    ...(Text as any).defaultProps,
    style: [{ fontFamily: 'GenRyuBody', textTransform: 'lowercase' }, (Text as any).defaultProps?.style],
  };

  // Patch the render method once
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!Text.__patchedForLowercase) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Text.__patchedForLowercase = true;
    const oldRender = (Text as any).render;
    (Text as any).render = function (...args: any[]) {
      const origin = oldRender.apply(this, args);
      return React.cloneElement(origin, origin.props, toLower(origin.props.children));
    };
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor="#F2D894" />
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: 'miso',
          headerTitleStyle: {
            fontFamily: 'GenRyuHead',
            fontSize: 28,
            color: '#8B4513'
          },
          headerStyle: { backgroundColor: '#F2D894', shadowColor: 'transparent' },
          contentStyle: { backgroundColor: '#F2D894' }
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="session" />
      </Stack>
    </>
  );
}