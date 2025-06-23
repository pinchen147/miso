import React from 'react';
import { router } from 'expo-router';
import {
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

// --------------------------------------------------
// Types & Mock Data
// --------------------------------------------------
export interface Recipe {
  id: number;
  title: string;
  origin: string;
  description: string;
  imageUrl: string;
  timeInMins: number;
  isFeatured: boolean;
}

const recipes: Recipe[] = [
  {
    id: 1,
    title: 'Classic Miso Soup',
    origin: 'Japanese',
    description: 'A comforting soup made with dashi stock, miso paste, tofu, and seaweed.',
    imageUrl: 'https://images.unsplash.com/photo-1543353071-873f17a7a088',
    timeInMins: 15,
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Spaghetti Carbonara',
    origin: 'Italian',
    description: 'Creamy pasta tossed with pancetta, eggs, and plenty of Parmesan cheese.',
    imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e',
    timeInMins: 25,
    isFeatured: false,
  },
  {
    id: 3,
    title: 'Tacos al Pastor',
    origin: 'Mexican',
    description: 'Juicy pork tacos marinated with chilies and pineapple, served on warm tortillas.',
    imageUrl: 'https://images.unsplash.com/photo-1617191519307-b6fe10499c42',
    timeInMins: 40,
    isFeatured: false,
  },
  {
    id: 4,
    title: 'Pad Thai',
    origin: 'Thai',
    description: 'Stir-fried rice noodles with shrimp, tofu, peanuts, and tamarind sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1625946341056-361ef3e50918',
    timeInMins: 30,
    isFeatured: false,
  },
];

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

// --------------------------------------------------
// Components
// --------------------------------------------------
const FeaturedRecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const handlePress = () =>
    router.push({
      pathname: '/session',
      params: { recipeId: String(recipe.id), recipeName: recipe.title },
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

const RecipeListItem: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const handlePress = () =>
    router.push({
      pathname: '/session',
      params: { recipeId: String(recipe.id), recipeName: recipe.title },
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

const RecipeList: React.FC<{ data: Recipe[] }> = ({ data }) => (
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
  const featuredRecipe = recipes.find((r) => r.isFeatured)!;
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