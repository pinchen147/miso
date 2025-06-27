export const getSubstitutionPrompt = (recipeTitle: string, detectedTools: string[], requiredTools: string[], missingTools: string[]) => `
You are an AI cooking assistant. Generate a warm, welcoming introduction for a recipe, accounting for any missing cookware.

Recipe: "${recipeTitle}"
Detected Cookware: ${detectedTools.join(', ') || 'None'}
Required Cookware: ${requiredTools.join(', ') || 'None'}
Missing Cookware: ${missingTools.join(', ') || 'None'}

Instructions:
1. Start with a friendly welcome to the recipe.
2. If there are missing tools, acknowledge them and suggest that you will provide alternative methods.
3. If there are no missing tools, express confidence that the user is well-prepared.
4. Keep the tone encouraging and helpful.
5. The response should be a single, concise paragraph.
`;
