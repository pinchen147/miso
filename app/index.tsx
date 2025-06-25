import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Recipe } from '@/types/recipe';

// --------------------------------------------------
// Interfaces for app compatibility
// --------------------------------------------------
export interface AppRecipe {
  id: string;
  title: string;
  origin: string;
  description: string;
  imageUrl: string;
  timeInMins: number;
  isFeatured: boolean;
}

// --------------------------------------------------
// Styled-components
// --------------------------------------------------
const ScreenContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #f2d894;
`;

const ContentScroll = styled(ScrollView).attrs({
  contentContainerStyle: { paddingBottom: 32 },
})``;

// Featured Section
const FeaturedContainer = styled.View`
  background-color: #fce3ad;
  margin: 16px;
  border-radius: 18px;
  overflow: hidden;
`;

const FeaturedImage = styled(Image)`
  width: 100%;
  height: 220px;
`;

const FeaturedDetails = styled.View`
  padding: 16px;
`;

const FeaturedTitle = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 22px;
  color: #8b4513;
`;

const FeaturedOrigin = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 14px;
  color: #8b4513;
  margin-top: 4px;
`;

const FeaturedDescription = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 14px;
  color: #8b4513;
  margin-top: 8px;
`;

const TimeRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
`;

const TimeText = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 14px;
  color: #8b4513;
  margin-left: 6px;
`;

// List Section
const ListDivider = styled.View`
  height: 1px;
  background-color: rgba(139, 69, 19, 0.2);
  margin: 0 16px;
`;

const ListItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-start;
  padding: 16px;
`;

const ListImage = styled(Image)`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: #d9d9d9;
`;

const ListInfo = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const ListTitle = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 16px;
  color: #8b4513;
`;

const ListOrigin = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 12px;
  color: #8b4513;
  margin-top: 2px;
`;

const ListDescription = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 13px;
  color: #8b4513;
  margin-top: 4px;
`;

const ListTimeRow = styled(TimeRow)`
  margin-top: 6px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 16px;
  color: #8b4513;
  text-align: center;
`;

// --------------------------------------------------
// Components
// --------------------------------------------------
const FeaturedRecipeCard: React.FC<{ recipe: AppRecipe }> = ({ recipe }) => {
  const handlePress = () =>
    router.push({
      pathname: `/recipe/${recipe.id}`,
    });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
      <FeaturedContainer>
        <FeaturedImage source={{ uri: recipe.imageUrl }} resizeMode="cover" />
        <FeaturedDetails>
          <FeaturedTitle>{recipe.title}</FeaturedTitle>
          <FeaturedOrigin>{recipe.origin}</FeaturedOrigin>
          <FeaturedDescription numberOfLines={3}>{recipe.description}</FeaturedDescription>
          <TimeRow>
            <Ionicons name="time" size={16} color="#8B4513" />
            <TimeText>{recipe.timeInMins} mins</TimeText>
          </TimeRow>
        </FeaturedDetails>
      </FeaturedContainer>
    </TouchableOpacity>
  );
};

const RecipeListItem: React.FC<{ recipe: AppRecipe }> = ({ recipe }) => {
  const handlePress = () =>
    router.push({
      pathname: `/recipe/${recipe.id}`,
    });

  return (
    <ListItemContainer activeOpacity={0.7} onPress={handlePress}>
      <ListImage source={{ uri: recipe.imageUrl }} resizeMode="cover" />
      <ListInfo>
        <ListTitle>{recipe.title}</ListTitle>
        <ListOrigin>{recipe.origin}</ListOrigin>
        <ListDescription numberOfLines={2}>{recipe.description}</ListDescription>
        <ListTimeRow>
          <Ionicons name="time-outline" size={14} color="#8B4513" />
          <TimeText>{recipe.timeInMins} mins</TimeText>
        </ListTimeRow>
      </ListInfo>
    </ListItemContainer>
  );
};

const RecipeList: React.FC<{ data: AppRecipe[] }> = ({ data }) => (
  <>
    {data.map((recipe, idx) => (
      <React.Fragment key={recipe.id}>
        <RecipeListItem recipe={recipe} />
        {idx !== data.length - 1 && <ListDivider />}
      </React.Fragment>
    ))}
  </>
);

// --------------------------------------------------
// Screen Component
// --------------------------------------------------
export default function HomeScreen() {
  const [recipes, setRecipes] = useState<AppRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        setError('Failed to load recipes');
        return;
      }

      const appRecipes: AppRecipe[] = data.map((recipe: Recipe, index: number) => ({
        id: recipe.id,
        title: recipe.title,
        origin: recipe.cuisine_type || 'Unknown',
        description: recipe.description || 'No description available',
        imageUrl: recipe.image_url || 'https://images.unsplash.com/photo-1543353071-873f17a7a088',
        timeInMins: recipe.time || 30,
        isFeatured: index === 0,
      }));

      setRecipes(appRecipes);
    } catch (err) {
      console.error('Error in fetchRecipes:', err);
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#8B4513" />
        </LoadingContainer>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      </ScreenContainer>
    );
  }

  const featuredRecipe = recipes.find((r) => r.isFeatured);
  const otherRecipes = recipes.filter((r) => !r.isFeatured);

  return (
    <ScreenContainer>
      <ContentScroll>
        {featuredRecipe && <FeaturedRecipeCard recipe={featuredRecipe} />}
        <RecipeList data={otherRecipes} />
      </ContentScroll>
    </ScreenContainer>
  );
}