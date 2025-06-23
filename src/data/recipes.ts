import { Recipe } from '../types/recipe';

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Classic Miso Soup',
    description: 'Traditional Japanese soup with miso paste, tofu, and seaweed',
    featured: true,
    cuisine: 'Japanese',
    difficulty: 'Easy',
    estimatedTime: 15,
    ingredients: [
      { id: '1', name: 'Miso paste', quantity: '3', unit: 'tablespoons' },
      { id: '2', name: 'Dashi stock', quantity: '4', unit: 'cups' },
      { id: '3', name: 'Silken tofu', quantity: '200', unit: 'grams' },
      { id: '4', name: 'Wakame seaweed', quantity: '2', unit: 'tablespoons' },
      { id: '5', name: 'Green onions', quantity: '2', unit: 'stalks' }
    ],
    steps: [
      {
        id: '1',
        stepNumber: 1,
        instruction: 'Heat dashi stock in a medium saucepan over medium heat',
        duration: 3
      },
      {
        id: '2',
        stepNumber: 2,
        instruction: 'In a small bowl, whisk miso paste with a little warm dashi until smooth',
        duration: 2
      },
      {
        id: '3',
        stepNumber: 3,
        instruction: 'Add cubed tofu and wakame to the saucepan',
        duration: 2
      },
      {
        id: '4',
        stepNumber: 4,
        instruction: 'Stir in the miso mixture and heat until just about to boil',
        duration: 3
      },
      {
        id: '5',
        stepNumber: 5,
        instruction: 'Remove from heat, garnish with chopped green onions, and serve',
        duration: 1
      }
    ]
  },
  {
    id: '2',
    title: 'Miso Glazed Salmon',
    description: 'Tender salmon with a sweet and savory miso glaze',
    cuisine: 'Japanese',
    difficulty: 'Medium',
    estimatedTime: 25,
    ingredients: [
      { id: '1', name: 'Salmon fillets', quantity: '4', unit: 'pieces' },
      { id: '2', name: 'White miso paste', quantity: '3', unit: 'tablespoons' },
      { id: '3', name: 'Mirin', quantity: '2', unit: 'tablespoons' },
      { id: '4', name: 'Sake', quantity: '2', unit: 'tablespoons' },
      { id: '5', name: 'Sugar', quantity: '1', unit: 'tablespoon' }
    ]
  },
  {
    id: '3',
    title: 'Miso Ramen Bowl',
    description: 'Rich and hearty ramen with miso-based broth',
    cuisine: 'Japanese',
    difficulty: 'Hard',
    estimatedTime: 45,
    ingredients: [
      { id: '1', name: 'Ramen noodles', quantity: '2', unit: 'portions' },
      { id: '2', name: 'Red miso paste', quantity: '4', unit: 'tablespoons' },
      { id: '3', name: 'Chicken broth', quantity: '4', unit: 'cups' },
      { id: '4', name: 'Soft-boiled eggs', quantity: '2', unit: 'pieces' },
      { id: '5', name: 'Chashu pork', quantity: '200', unit: 'grams' }
    ]
  }
];