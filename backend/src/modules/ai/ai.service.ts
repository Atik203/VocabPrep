import { generateWithGemini } from "../../config/gemini";

/**
 * AI Service for vocabulary learning features
 */

interface EnhanceVocabParams {
  word: string;
  meaning: string;
  context?: string;
}

interface EnhanceVocabResult {
  enhancedMeaning: string;
  exampleSentences: string[];
  suggestedDifficulty: "easy" | "medium" | "hard";
  suggestedTopicTags: string[];
  memoryTip: string;
  synonyms: string[];
  tokensUsed: number;
}

interface PracticeFeedbackParams {
  word: string;
  userAnswer: string;
  skill: string;
}

interface PracticeFeedbackResult {
  isCorrect: boolean;
  rating: number; // 1-5
  feedback: string;
  suggestions: string[];
  encouragement: string;
  tokensUsed: number;
}

/**
 * Enhance vocabulary with AI-generated content
 */
export async function enhanceVocabulary(
  params: EnhanceVocabParams
): Promise<EnhanceVocabResult> {
  const { word, meaning, context = "intermediate" } = params;

  const prompt = `As an English vocabulary learning assistant, enhance this word for ${context}-level learners:

Word: "${word}"
Dictionary Meaning: "${meaning}"

Provide a JSON response with:
1. enhancedMeaning: Simplify the definition in clear, learner-friendly language (1-2 sentences max)
2. exampleSentences: Create 3 diverse, realistic example sentences showing different contexts
3. suggestedDifficulty: Rate as "easy", "medium", or "hard" based on word complexity
4. suggestedTopicTags: List 3-5 relevant topic categories (e.g., "Business", "Travel", "Emotions")
5. memoryTip: Create a creative mnemonic or memory technique to remember this word
6. synonyms: List 4-6 common synonyms

Format as valid JSON only, no markdown.`;

  const systemInstruction = `You are an expert English vocabulary teacher. Provide clear, concise, and engaging explanations suitable for language learners. Always return valid JSON format.`;

  try {
    const response = await generateWithGemini(prompt, systemInstruction, 0.7);

    // Parse JSON response
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const aiData = JSON.parse(jsonMatch[0]);

    return {
      enhancedMeaning: aiData.enhancedMeaning || meaning,
      exampleSentences: Array.isArray(aiData.exampleSentences)
        ? aiData.exampleSentences.slice(0, 3)
        : [],
      suggestedDifficulty: aiData.suggestedDifficulty || "medium",
      suggestedTopicTags: Array.isArray(aiData.suggestedTopicTags)
        ? aiData.suggestedTopicTags.slice(0, 5)
        : [],
      memoryTip: aiData.memoryTip || "",
      synonyms: Array.isArray(aiData.synonyms)
        ? aiData.synonyms.slice(0, 6)
        : [],
      tokensUsed: response.tokensUsed,
    };
  } catch (error: any) {
    console.error("AI Enhancement Error:", error);
    throw new Error(`Failed to enhance vocabulary: ${error.message}`);
  }
}

/**
 * Generate AI feedback for practice answers
 */
export async function generatePracticeFeedback(
  params: PracticeFeedbackParams
): Promise<PracticeFeedbackResult> {
  const { word, userAnswer, skill } = params;

  const prompt = `As an English teacher, evaluate this student's ${skill} practice:

Target Word: "${word}"
Student's Answer: "${userAnswer}"

Provide a JSON response with:
1. isCorrect: Boolean - Is the word used correctly?
2. rating: Number 1-5 - Overall quality (1=poor, 5=excellent)
3. feedback: String - Constructive feedback (2-3 sentences) explaining what's good and what could improve
4. suggestions: Array of 2-3 specific improvement tips
5. encouragement: String - Positive, motivating message (1 sentence)

Be supportive and constructive. Focus on helping the learner improve.
Format as valid JSON only, no markdown.`;

  const systemInstruction = `You are a patient, encouraging English teacher providing constructive feedback. Always be positive while identifying areas for improvement. Return valid JSON format.`;

  try {
    const response = await generateWithGemini(prompt, systemInstruction, 0.3);

    // Parse JSON response
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const aiData = JSON.parse(jsonMatch[0]);

    return {
      isCorrect: Boolean(aiData.isCorrect),
      rating: Math.min(5, Math.max(1, Number(aiData.rating) || 3)),
      feedback: aiData.feedback || "Good effort! Keep practicing.",
      suggestions: Array.isArray(aiData.suggestions)
        ? aiData.suggestions.slice(0, 3)
        : [],
      encouragement: aiData.encouragement || "Keep up the great work!",
      tokensUsed: response.tokensUsed,
    };
  } catch (error: any) {
    console.error("AI Feedback Error:", error);
    throw new Error(`Failed to generate feedback: ${error.message}`);
  }
}

/**
 * Generate smart vocabulary suggestions based on user's learning level
 */
export async function generateVocabSuggestions(params: {
  learnedWords: string[];
  targetLevel: string;
  count: number;
}): Promise<{
  suggestions: Array<{ word: string; reason: string }>;
  tokensUsed: number;
}> {
  const { learnedWords, targetLevel, count } = params;

  const prompt = `Based on these learned words: ${learnedWords
    .slice(-20)
    .join(", ")}

Suggest ${count} new ${targetLevel}-level vocabulary words that would be a natural progression.

Provide JSON with:
suggestions: Array of objects with "word" and "reason" (why this word fits their learning path)

Format as valid JSON only, no markdown.`;

  try {
    const response = await generateWithGemini(
      prompt,
      "You are an adaptive English vocabulary curriculum designer.",
      0.8
    );

    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const aiData = JSON.parse(jsonMatch[0]);

    return {
      suggestions: aiData.suggestions || [],
      tokensUsed: response.tokensUsed,
    };
  } catch (error: any) {
    console.error("AI Suggestions Error:", error);
    throw new Error(`Failed to generate suggestions: ${error.message}`);
  }
}
