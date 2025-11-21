import { baseApi } from "../../baseApi";

/**
 * AI API endpoints for Gemini integration
 */

interface EnhanceVocabRequest {
  word: string;
  meaning: string;
  context?: "beginner" | "intermediate" | "advanced";
}

interface EnhanceVocabResponse {
  success: boolean;
  data: {
    enhancedMeaning: string;
    exampleSentences: string[];
    suggestedDifficulty: "easy" | "medium" | "hard";
    suggestedTopicTags: string[];
    memoryTip: string;
    synonyms: string[];
    tokensUsed: number;
  };
  quota: {
    remaining: number;
    resetDate: string;
    tier: string;
  };
}

interface PracticeFeedbackRequest {
  vocabularyId?: string;
  word: string;
  userAnswer: string;
  skill?: "reading" | "listening" | "writing" | "speaking";
}

interface PracticeFeedbackResponse {
  success: boolean;
  data: {
    isCorrect: boolean;
    rating: number;
    feedback: string;
    suggestions: string[];
    encouragement: string;
    tokensUsed: number;
  };
  quota: {
    remaining: number;
    resetDate: string;
    tier: string;
  };
}

interface UsageStatsResponse {
  success: boolean;
  data: {
    currentPeriod: {
      used: number;
      remaining: number;
      limit: number;
      resetDate: string;
      periodType: "daily" | "monthly";
    };
    subscriptionTier: "free" | "premium";
    totalLifetimeRequests: number;
    recentUsage: Array<{
      date: string;
      requests: number;
      tokensUsed: number;
      successRate: number;
    }>;
  };
}

interface QuotaResponse {
  success: boolean;
  data: {
    remaining: number;
    limit: number;
    resetDate: string;
    tier: "free" | "premium";
    periodType: "daily" | "monthly";
  };
}

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Enhance vocabulary with AI
    enhanceVocab: builder.mutation<EnhanceVocabResponse, EnhanceVocabRequest>({
      query: (data) => ({
        url: "/v1/ai/enhance-vocab",
        method: "POST",
        body: data,
      }),
    }),

    // Get practice feedback from AI
    getPracticeFeedback: builder.mutation<
      PracticeFeedbackResponse,
      PracticeFeedbackRequest
    >({
      query: (data) => ({
        url: "/v1/ai/practice-feedback",
        method: "POST",
        body: data,
      }),
    }),

    // Get AI usage statistics
    getUsageStats: builder.query<UsageStatsResponse, void>({
      query: () => "/v1/ai/usage",
      providesTags: ["AIUsage"],
    }),

    // Get AI quota (lightweight endpoint)
    getQuota: builder.query<QuotaResponse, void>({
      query: () => "/v1/ai/quota",
      providesTags: ["AIQuota"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useEnhanceVocabMutation,
  useGetPracticeFeedbackMutation,
  useGetUsageStatsQuery,
  useGetQuotaQuery,
  useLazyGetQuotaQuery,
} = aiApi;

// Add new tag types to baseApi
declare module "../../baseApi" {
  export interface TagTypes {
    AIUsage: string;
    AIQuota: string;
  }
}
