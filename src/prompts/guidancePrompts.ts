export const getGuidancePrompt = (
  currentStep: string,
  visionSummary: string,
  relevantContext: string[]
): string => `You are an expert cooking assistant. Given:
- Current recipe step: "${currentStep}"
- What you see in the camera: ${visionSummary}
- Relevant cooking tips: ${relevantContext.join('\n')}

Provide a concise, encouraging cooking instruction or tip (max 50 words).
Focus on what the cook should do next or any adjustments needed.
If the cook is not doing anything, say "Keep going!"`;