import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Miso AI',
  slug: 'miso-ai',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#F2D894'
  },
  assetBundlePatterns: [
    '**/*',
    'assets/font/*.ttf'
  ],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.misoai.app',
    infoPlist: {
      NSCameraUsageDescription: 'Miso AI uses the camera to analyze your cooking ingredients and provide real-time guidance.',
      NSMicrophoneUsageDescription: 'Miso AI uses the microphone for voice commands and wake-word detection during cooking sessions.'
    }
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#ffffff'
    },
    permissions: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO'
    ]
  },
  web: {
    bundler: 'metro',
    output: 'single'
  },
  plugins: [
    [
      'expo-camera',
      {
        cameraPermission: 'Allow Miso AI to access your camera to analyze cooking ingredients.'
      }
    ],
    [
      'expo-av',
      {
        microphonePermission: 'Allow Miso AI to access your microphone for voice commands and wake-word detection.'
      }
    ],
    'expo-router'
  ]
});