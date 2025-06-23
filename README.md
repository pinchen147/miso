# Miso AI - iOS Cooking Assistant

**Miso AI** transforms your iPhone into an intelligent cooking companion that guides you through recipes with hands-free voice commands, real-time camera analysis, and step-by-step audio instructions. Using advanced AI vision and natural language processing, Miso acts as your personal sous-chef, helping you cook with confidence whether you're a beginner or an experienced home cook. The app features a warm, kitchen-friendly interface designed for messy hands and busy cooking sessions.

## Quick Start

### Run on Your Phone

1. **Install dependencies:**
```bash
npm install
```

2. **Start the Expo development server:**
```bash
npm start
```

3. **Connect your phone:**
   - Install the **Expo Go** app from the App Store
   - Scan the QR code displayed in your terminal or browser
   - The app will load directly on your phone

### Alternative: Run in Simulator

```bash
npm run ios  # Opens iOS Simulator
```

## Features

- **Recipe Browser**: Browse featured recipes and search through our curated collection
- **Live Camera Feed**: Real-time cooking session with camera-based ingredient detection
- **Voice Interaction**: Hands-free control with voice commands and AI responses
- **Step-by-Step Guidance**: Audio instructions with visual overlays and progress tracking
- **Text-to-Speech**: Natural voice narration for each cooking step

## Requirements

- **Node.js** (v18 or later)
- **Expo Go app** on your iPhone (from App Store)
- **Camera and microphone permissions** for full functionality

### Project Structure

```
miso-ai/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with navigation
│   ├── index.tsx          # Home screen (recipe browser)
│   └── session.tsx        # Camera session screen
├── src/
│   ├── types/             # TypeScript type definitions
│   ├── data/              # Sample data and constants
│   └── components/        # Reusable UI components (future)
├── assets/                # Images and static assets
└── package.json
```

## Screens

### 1. Home Screen (`app/index.tsx`)
- **Featured Recipe Section**: Highlights a special recipe with image placeholder
- **Search Bar**: Allows users to search through recipes
- **Recipe List**: Displays available recipes with titles, descriptions, and estimated time
- **Navigation**: Tapping any recipe navigates to the cooking session

### 2. Session Screen (`app/session.tsx`)
- **Live Camera Feed**: Full-screen camera view using device's back camera
- **Step Display**: Shows current step number and instructions
- **Voice Controls**: Microphone button for AI interaction
- **Step Navigation**: Previous/Next buttons for manual step control
- **Text-to-Speech**: Automatic audio narration of recipe steps

## Key Features Implemented

### Recipe Management
- TypeScript interfaces for Recipe, Ingredient, and RecipeStep
- Sample data with 3 Japanese miso-based recipes
- Recipe selection and parameter passing between screens

### Camera Integration
- Expo Camera with proper permission handling
- Back-facing camera for ingredient monitoring
- Permission request flow with user-friendly messaging

### Voice & Audio
- Expo Speech integration for text-to-speech
- Welcome messages and step narration
- Simulated AI responses for user interaction

### UI/UX Design
- Warm color palette (#F2D894, #D9A441, #8B4513)
- Responsive design for different screen sizes
- Accessible touch targets and visual feedback
- Clean, kitchen-friendly interface

## Permissions Required

- **Camera**: For real-time ingredient detection and cooking guidance
- **Microphone**: For voice commands and wake-word detection

## Future Enhancements

Based on the engineering documentation, planned features include:

- **AI Vision**: Gemini 2.5 Pro integration for ingredient recognition
- **RAG System**: ChromaDB vector search for cooking knowledge
- **Wake-word Detection**: Hands-free voice activation
- **Recipe Import**: PDF/text recipe parsing
- **Subscription System**: Premium features and content
- **Advanced Overlays**: AR-style ingredient highlighting

## Development

### Adding New Recipes

Edit `src/data/recipes.ts` to add new recipes:

```typescript
{
  id: 'unique-id',
  title: 'Recipe Name',
  description: 'Brief description',
  featured: false, // Set to true for featured recipe
  estimatedTime: 30,
  ingredients: [...],
  steps: [...]
}
```

### Customizing Styles

Colors and styling are centralized in each component's StyleSheet. Main theme colors:
- Background: `#F2D894`
- Header: `#D9A441`
- Text: `#8B4513`

## License

This project is part of the Miso AI cooking assistant application.