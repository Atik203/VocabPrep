import { GoogleGenAI } from "@google/genai";
import { env } from "./env";

/**
 * Initialize Gemini AI client with API key from environment
 * Using Gemini 2.0 Flash model for cost-effective text generation
 */
export const geminiAI = new GoogleGenAI({});

/**
 * Get Gemini model instance with configuration
 * @param temperature - Controls randomness (0.0 = deterministic, 2.0 = very random)
 * @param maxTokens - Maximum tokens in response
 */
export function getGeminiModel(
  temperature: number = 1.0,
  maxTokens: number = env.AI_MAX_TOKENS_PER_REQUEST
) {
  return {
    model: env.GEMINI_MODEL,
    config: {
      temperature,
      maxOutputTokens: maxTokens,
    },
  };
}

/**
 * Generate content with Gemini AI
 * @param prompt - The prompt to send to Gemini
 * @param systemInstruction - System-level instructions for AI behavior
 * @param temperature - Temperature for response generation
 */
export async function generateWithGemini(
  prompt: string,
  systemInstruction?: string,
  temperature: number = 0.7
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), env.AI_TIMEOUT_MS);

  try {
    const modelConfig = getGeminiModel(temperature);

    const response = await geminiAI.models.generateContent({
      model: modelConfig.model,
      contents: prompt,
      config: {
        ...modelConfig.config,
        systemInstruction:
          systemInstruction ||
          "You are a helpful English vocabulary learning assistant. Provide clear, concise, and learner-friendly explanations.",
      },
    });

    clearTimeout(timeoutId);

    return {
      text: response.text || "",
      tokensUsed: response.usageMetadata?.totalTokenCount || 0,
      inputTokens: response.usageMetadata?.promptTokenCount || 0,
      outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error("AI request timeout - please try again");
    }

    throw new Error(`Gemini AI error: ${error.message}`);
  }
}
