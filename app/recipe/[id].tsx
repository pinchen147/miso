import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Text,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Recipe, RecipeIngredient, RecipeStep } from '@/types/recipe';

const { width } = Dimensions.get('window');

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRecipeDetails();
    }
  }, [id]);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch recipe basic info
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (recipeError) {
        console.error('Error fetching recipe:', recipeError);
        console.log('Recipe error details:', recipeError);
        setError('Failed to load recipe');
        return;
      }

      console.log('Fetched recipe data:', recipeData);
      console.log('Recipe ID being used:', id);
      setRecipe(recipeData);

      // Fetch ingredients
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select(`
          *,
          ingredient:ingredients(*)
        `)
        .eq('recipe_id', id);

      if (ingredientsError) {
        console.error('Error fetching ingredients:', ingredientsError);
        console.log('Ingredients error details:', ingredientsError);
      } else {
        console.log('Fetched ingredients data:', ingredientsData);
        setIngredients(ingredientsData || []);
      }

      // Fetch steps
      const { data: stepsData, error: stepsError } = await supabase
        .from('recipe_steps')
        .select('*')
        .eq('recipe_id', id)
        .order('step_number', { ascending: true });

      if (stepsError) {
        console.error('Error fetching steps:', stepsError);
        console.log('Steps error details:', stepsError);
      } else {
        console.log('Fetched steps data:', stepsData);
        setSteps(stepsData || []);
      }

    } catch (err) {
      console.error('Error in fetchRecipeDetails:', err);
      setError('Failed to load recipe details');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCooking = () => {
    if (recipe) {
      router.push({
        pathname: '/session',
        params: { 
          recipeId: recipe.id, 
          recipeName: recipe.title 
        },
      });
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#8B4513" />
        </LoadingContainer>
      </Container>
    );
  }

  if (error || !recipe) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorText>{error || 'Recipe not found'}</ErrorText>
          <BackButton onPress={() => router.back()}>
            <BackButtonText>Go Back</BackButtonText>
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTitle numberOfLines={1}>{recipe.title}</HeaderTitle>
      </Header>

      <ContentScroll>
        {recipe.image_url && (
          <RecipeImage source={{ uri: recipe.image_url }} resizeMode="cover" />
        )}
        
        <ContentContainer>
          <TitleSection>
            <RecipeTitle>{recipe.title}</RecipeTitle>
            {recipe.cuisine_type && (
              <CuisineTag>
                <CuisineText>{recipe.cuisine_type}</CuisineText>
              </CuisineTag>
            )}
          </TitleSection>

          <StartButton onPress={handleStartCooking}>
            <Ionicons name="play" size={20} color="#8B4513" />
            <StartButtonText>Start Cooking</StartButtonText>
          </StartButton>

          {recipe.description && (
            <DescriptionSection>
              <SectionTitle>About</SectionTitle>
              <Description>{recipe.description}</Description>
            </DescriptionSection>
          )}

          <MetaInfo>
            {recipe.time && (
              <MetaItem>
                <Ionicons name="time" size={16} color="#8B4513" />
                <MetaText>{recipe.time} mins</MetaText>
              </MetaItem>
            )}
            <MetaItem>
              <Ionicons name="restaurant" size={16} color="#8B4513" />
              <MetaText>{ingredients.length} ingredients</MetaText>
            </MetaItem>
            <MetaItem>
              <Ionicons name="list" size={16} color="#8B4513" />
              <MetaText>{steps.length} steps</MetaText>
            </MetaItem>
          </MetaInfo>

          <Section>
            <SectionTitle>Ingredients ({ingredients.length})</SectionTitle>
            {ingredients.length > 0 ? (
              ingredients.map((item, index) => (
                <IngredientListItem key={item.id}>
                  <IngredientBullet />
                  <IngredientDetails>
                    <IngredientName>
                      {item.ingredient?.name || 'Unknown ingredient'}
                    </IngredientName>
                    <IngredientAmount>
                      {item.quantity && item.unit 
                        ? `${item.quantity} ${item.unit}`
                        : item.quantity 
                        ? `${item.quantity}`
                        : item.unit 
                        ? `${item.unit}`
                        : 'To taste'
                      }
                      {item.preparation && `, ${item.preparation}`}
                    </IngredientAmount>
                  </IngredientDetails>
                </IngredientListItem>
              ))
            ) : (
              <NoIngredientsContainer>
                <DebugInfo>
                  No ingredients found for this recipe.
                  {"\n"}
                  {"\n"}To fix this, you need to:
                  {"\n"}1. Add ingredients to the 'ingredients' table
                  {"\n"}2. Link them via 'recipe_ingredients' table
                  {"\n"}
                  {"\n"}Recipe ID: {id}
                </DebugInfo>
                <SampleIngredientsTitle>Expected ingredients for this recipe:</SampleIngredientsTitle>
                <SampleIngredientsList>
                  <SampleIngredientItem>• Sweet potatoes - 2 large</SampleIngredientItem>
                  <SampleIngredientItem>• White sugar - 1 cup</SampleIngredientItem>
                  <SampleIngredientItem>• Cornstarch - 3 tbsp</SampleIngredientItem>
                  <SampleIngredientItem>• Water - 1/4 cup</SampleIngredientItem>
                  <SampleIngredientItem>• Sesame seeds - 2 tbsp</SampleIngredientItem>
                  <SampleIngredientItem>• Vegetable oil - for frying</SampleIngredientItem>
                </SampleIngredientsList>
              </NoIngredientsContainer>
            )}
          </Section>

          {steps.length > 0 && (
            <Section>
              <SectionTitle>Instructions</SectionTitle>
              {steps.map((step, index) => (
                <StepItem key={step.id}>
                  <StepNumber>
                    <StepNumberText>{step.step_number}</StepNumberText>
                  </StepNumber>
                  <StepText>{step.instruction}</StepText>
                </StepItem>
              ))}
            </Section>
          )}
        </ContentContainer>
      </ContentScroll>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f2d894;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #f2d894;
  border-bottom-width: 1px;
  border-bottom-color: rgba(139, 69, 19, 0.1);
`;

const BackIconButton = styled.TouchableOpacity`
  padding: 8px;
`;

const HeaderTitle = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 18px;
  color: #8b4513;
  flex: 1;
  text-align: center;
  margin: 0 16px;
`;

const PlaceholderView = styled.View`
  width: 40px;
`;

const ContentScroll = styled(ScrollView).attrs({
  contentContainerStyle: { paddingBottom: 32 },
})``;

const RecipeImage = styled(Image)`
  width: ${width}px;
  height: 250px;
`;

const ContentContainer = styled.View`
  padding: 20px;
`;

const TitleSection = styled.View`
  margin-bottom: 16px;
`;

const RecipeTitle = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 28px;
  color: #8b4513;
  margin-bottom: 8px;
`;

const CuisineTag = styled.View`
  background-color: #d9a441;
  padding: 6px 12px;
  border-radius: 12px;
  align-self: flex-start;
`;

const CuisineText = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 12px;
  color: #8b4513;
  font-weight: 600;
`;

const DescriptionSection = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 20px;
  color: #8b4513;
  margin-bottom: 12px;
`;

const Description = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 16px;
  color: #8b4513;
  line-height: 24px;
`;

const MetaInfo = styled.View`
  flex-direction: row;
  justify-content: space-around;
  background-color: #fce3ad;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const MetaText = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 14px;
  color: #8b4513;
  margin-left: 6px;
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const IngredientListItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const IngredientNumber = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #fce3ad;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  margin-top: 2px;
`;

const IngredientNumberText = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 14px;
  color: #8b4513;
  text-align: center;
`;

const IngredientDetails = styled.View`
  flex: 1;
`;

const IngredientName = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 16px;
  color: #8b4513;
  margin-bottom: 4px;
`;

const IngredientAmount = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 14px;
  color: #8b4513;
  opacity: 0.8;
  line-height: 20px;
`;

const IngredientItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const IngredientBullet = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #d9a441;
  margin-top: 8px;
  margin-right: 12px;
`;

const IngredientText = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 16px;
  color: #8b4513;
  flex: 1;
  line-height: 22px;
`;

const StepItem = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`;

const StepNumber = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #d9a441;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  margin-top: 2px;
`;

const StepNumberText = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 14px;
  color: #8b4513;
  text-align: center;
`;

const StepText = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 16px;
  color: #8b4513;
  flex: 1;
  line-height: 24px;
`;

const StartButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #d9a441;
  padding: 16px 32px;
  border-radius: 30px;
  margin: 16px 0;
`;

const StartButtonText = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 18px;
  color: #8b4513;
  margin-left: 8px;
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
  padding: 32px;
`;

const ErrorText = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 16px;
  color: #8b4513;
  text-align: center;
  margin-bottom: 24px;
`;

const BackButton = styled.TouchableOpacity`
  background-color: #d9a441;
  padding: 12px 24px;
  border-radius: 20px;
`;

const BackButtonText = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 16px;
  color: #8b4513;
`;

const DebugInfo = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 14px;
  color: #8b4513;
  padding: 16px;
  background-color: #fce3ad;
  border-radius: 8px;
  line-height: 20px;
  margin-bottom: 16px;
`;

const NoIngredientsContainer = styled.View`
  padding: 8px 0;
`;

const SampleIngredientsTitle = styled.Text`
  font-family: LibreBaskerville_700Bold;
  font-size: 16px;
  color: #8b4513;
  margin-bottom: 12px;
`;

const SampleIngredientsList = styled.View`
  background-color: rgba(217, 164, 65, 0.1);
  padding: 16px;
  border-radius: 8px;
  border-left-width: 4px;
  border-left-color: #d9a441;
`;

const SampleIngredientItem = styled.Text`
  font-family: LibreBaskerville_400Regular;
  font-size: 14px;
  color: #8b4513;
  margin-bottom: 6px;
  line-height: 20px;
`;