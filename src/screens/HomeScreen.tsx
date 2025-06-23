import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { SAMPLE_RECIPES } from '../data/recipes';
import { Recipe } from '../types/recipe';
import { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const [searchText, setSearchText] = useState('');
  
  const featuredRecipe = SAMPLE_RECIPES.find(recipe => recipe.featured);
  const otherRecipes = SAMPLE_RECIPES.filter(recipe => !recipe.featured);

  const handleRecipePress = (recipe: Recipe) => {
    navigation.navigate('Session', {
      recipeId: recipe.id,
      recipeName: recipe.title
    });
  };

  const renderRecipeImage = () => (
    <View style={styles.recipeImage} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>miso</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Recipe */}
        {featuredRecipe && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>featured recipe</Text>
            
            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => handleRecipePress(featuredRecipe)}
              activeOpacity={0.8}
            >
              {renderRecipeImage()}
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>{featuredRecipe.title}</Text>
                <Text style={styles.featuredDescription}>{featuredRecipe.description}</Text>
                {featuredRecipe.estimatedTime && (
                  <View style={styles.timeContainer}>
                    <Ionicons name="time-outline" size={16} color="#8B4513" />
                    <Text style={styles.timeText}>{featuredRecipe.estimatedTime} min</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Recipe List */}
        <View style={styles.recipeList}>
          {otherRecipes.map((recipe, index) => (
            <View key={recipe.id}>
              <TouchableOpacity
                style={styles.recipeItem}
                onPress={() => handleRecipePress(recipe)}
                activeOpacity={0.7}
              >
                <View style={styles.recipeItemImage} />
                <View style={styles.recipeItemContent}>
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text style={styles.recipeDescription} numberOfLines={2}>
                    {recipe.description}
                  </Text>
                  {recipe.estimatedTime && (
                    <View style={styles.timeContainer}>
                      <Ionicons name="time-outline" size={14} color="#8B4513" />
                      <Text style={styles.timeTextSmall}>{recipe.estimatedTime} min</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              {index !== otherRecipes.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2D894',
  },
  header: {
    backgroundColor: '#D9A441',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'serif',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: width * 0.5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  searchIcon: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#F2D894',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B4513',
    marginBottom: 15,
  },
  featuredCard: {
    backgroundColor: 'transparent',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    backgroundColor: 'rgba(139, 69, 19, 0.7)',
    borderRadius: 12,
    marginBottom: 12,
  },
  featuredContent: {
    
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#8B4513',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 16,
    color: 'rgba(139, 69, 19, 0.8)',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#8B4513',
    marginLeft: 4,
    fontWeight: '500',
  },
  timeTextSmall: {
    fontSize: 12,
    color: '#8B4513',
    marginLeft: 4,
    fontWeight: '500',
  },
  recipeList: {
    paddingHorizontal: 20,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  recipeItemImage: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(139, 69, 19, 0.7)',
    borderRadius: 8,
    marginRight: 15,
  },
  recipeItemContent: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#8B4513',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: 'rgba(139, 69, 19, 0.7)',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(139, 69, 19, 0.2)',
    marginLeft: 95,
  },
  bottomSpacing: {
    height: 40,
  },
});