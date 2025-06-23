import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function SessionScreen() {
  const { recipeId, recipeName } = useLocalSearchParams<{
    recipeId: string;
    recipeName: string;
  }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Cooking Session</Text>
        <Text style={styles.recipeTitle}>{recipeName || 'Recipe'}</Text>
        <Text style={styles.subtitle}>Camera and AI features coming soon!</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2D894',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontFamily: 'LibreBaskerville_700Bold',
    fontSize: 28,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 10,
  },
  recipeTitle: {
    fontFamily: 'LibreBaskerville_400Regular_Italic',
    fontSize: 20,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: 'LibreBaskerville_400Regular',
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#D9A441',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: 'LibreBaskerville_700Bold',
    color: '#8B4513',
    fontSize: 18,
  },
});