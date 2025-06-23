# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
npm install                 # Install dependencies
npm start                   # Start Expo development server
npm run ios                 # Run in iOS Simulator
npm run android             # Run on Android device/emulator
npm run web                 # Run in web browser
```

### Testing & Validation
```bash
npx tsc --noEmit           # Check TypeScript compilation
npx expo export --platform web --clear --dev  # Test build process
```

## Project Architecture

This is a React Native Expo app for an AI-powered cooking assistant called "Miso AI". The app uses Expo Router for navigation and integrates camera, speech, and AI capabilities.

### Key Architecture Patterns

**Navigation Structure:**
- Uses Expo Router with file-based routing in `app/` directory
- Two main screens: `index.tsx` (home/recipe browser) and `session.tsx` (cooking session)
- Navigation handled via `router.push()` with typed parameters

**Font & Theming System:**
- Custom Japanese fonts (GenRyuMin2) loaded globally via `app/_layout.tsx`
- Global text transformation to lowercase applied to all Text components
- Consistent color scheme: `#F2D894` (background), `#D9A441` (header), `#8B4513` (text)
- `ThemedText` component for consistent styling across the app

**Recipe Data Architecture:**
- Strongly typed recipe system with `Recipe`, `Ingredient`, and `RecipeStep` interfaces
- Recipe data stored in `src/data/recipes.ts` with sample Japanese miso-based recipes
- Recipe selection and parameter passing between screens using search params

**Camera & Voice Integration:**
- Expo Camera with permission handling for ingredient analysis
- Expo Speech for text-to-speech functionality
- Session screen combines camera feed with step-by-step cooking guidance

### Key File Structure
```
app/                        # Expo Router screens
├── _layout.tsx            # Root layout with fonts, navigation, global styles
├── index.tsx              # Home screen (recipe browser)
└── session.tsx            # Camera session screen (cooking guidance)

src/
├── types/recipe.ts        # TypeScript interfaces for recipe data
├── data/recipes.ts        # Sample recipe data
├── components/            # Reusable UI components
│   └── ThemedText.tsx     # Text component with lowercase transformation
└── font/                  # Custom font files (GenRyuMin2)
```

### Path Aliases
- `@/*` → `./src/*` (configured in tsconfig.json and babel.config.js)
- `@assets` → `./assets` (configured in babel.config.js)

### Permissions & Platform Configuration
- Camera and microphone permissions configured in `app.config.ts`
- iOS bundle identifier: `com.misoai.app`
- Required permissions: Camera (ingredient analysis), Microphone (voice commands)

### Development Notes
- Uses TypeScript with strict mode enabled
- Expo SDK ~53.0.0 with React Native 0.79.4
- Uses Expo Router for navigation (NOT React Navigation)
- Font loading handled in root layout with proper loading states
- Text transformation to lowercase handled via `ThemedText` component
- Recipe navigation uses typed search parameters for data passing
- Fast refresh enabled - avoid modifying React component prototypes directly

### Important
- Project uses Expo Router exclusively - do not add React Navigation dependencies
- Global font and theming should be handled through components, not prototype modification
- TypeScript compilation should be clean before committing changes