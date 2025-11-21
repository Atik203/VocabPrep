import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { HttpError } from "../../utils/httpError";
import { enhanceVocabSchema, practiceFeedbackSchema } from "./ai.schema";
import { enhanceVocabulary, generatePracticeFeedback } from "./ai.service";
import { getUserUsageStats, trackUsage } from "./aiUsage.service";

/**
 * @route   POST /api/v1/ai/enhance-vocab
 * @desc    Enhance vocabulary with AI suggestions
 * @access  Private (requires authentication + rate limiting)
 */
export const enhanceVocab = asyncHandler(
  async (req: Request, res: Response) => {
    const startTime = Date.now();

    // Validate input
    const validatedData = enhanceVocabSchema.parse(req.body);
    const userId = req.userId!;

    try {
      // Generate AI enhancement
      const enhancement = await enhanceVocabulary({
        word: validatedData.word,
        meaning: validatedData.meaning,
        context: validatedData.context,
      });

      const responseTime = Date.now() - startTime;

      // Track usage for analytics
      await trackUsage({
        userId,
        endpoint: "/ai/enhance-vocab",
        tokensUsed: enhancement.tokensUsed,
        responseTime,
        success: true,
      });

      res.status(200).json({
        success: true,
        data: {
          enhancedMeaning: enhancement.enhancedMeaning,
          exampleSentences: enhancement.exampleSentences,
          suggestedDifficulty: enhancement.suggestedDifficulty,
          suggestedTopicTags: enhancement.suggestedTopicTags,
          memoryTip: enhancement.memoryTip,
          synonyms: enhancement.synonyms,
          tokensUsed: enhancement.tokensUsed,
        },
        quota: req.aiQuota,
      });
    } catch (error: any) {
      const responseTime = Date.now() - startTime;

      // Track failed attempt
      await trackUsage({
        userId,
        endpoint: "/ai/enhance-vocab",
        tokensUsed: 0,
        responseTime,
        success: false,
        errorMessage: error.message,
      });

      throw new HttpError(500, `AI enhancement failed: ${error.message}`);
    }
  }
);

/**
 * @route   POST /api/v1/ai/practice-feedback
 * @desc    Get AI feedback on practice answer
 * @access  Private (requires authentication + rate limiting)
 */
export const practiceFeedback = asyncHandler(
  async (req: Request, res: Response) => {
    const startTime = Date.now();

    // Validate input
    const validatedData = practiceFeedbackSchema.parse(req.body);
    const userId = req.userId!;

    try {
      // Generate AI feedback
      const feedback = await generatePracticeFeedback({
        word: validatedData.word,
        userAnswer: validatedData.userAnswer,
        skill: validatedData.skill,
      });

      const responseTime = Date.now() - startTime;

      // Track usage
      await trackUsage({
        userId,
        endpoint: "/ai/practice-feedback",
        tokensUsed: feedback.tokensUsed,
        responseTime,
        success: true,
        vocabularyId: validatedData.vocabularyId,
      });

      res.status(200).json({
        success: true,
        data: {
          isCorrect: feedback.isCorrect,
          rating: feedback.rating,
          feedback: feedback.feedback,
          suggestions: feedback.suggestions,
          encouragement: feedback.encouragement,
          tokensUsed: feedback.tokensUsed,
        },
        quota: req.aiQuota,
      });
    } catch (error: any) {
      const responseTime = Date.now() - startTime;

      await trackUsage({
        userId,
        endpoint: "/ai/practice-feedback",
        tokensUsed: 0,
        responseTime,
        success: false,
        errorMessage: error.message,
      });

      throw new HttpError(500, `AI feedback failed: ${error.message}`);
    }
  }
);

/**
 * @route   GET /api/v1/ai/usage
 * @desc    Get user's AI usage statistics
 * @access  Private (requires authentication)
 */
export const getUsage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;

  const stats = await getUserUsageStats(userId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * @route   GET /api/v1/ai/quota
 * @desc    Get user's remaining AI quota
 * @access  Private (requires authentication)
 */
export const getQuota = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const stats = await getUserUsageStats(userId);

  res.status(200).json({
    success: true,
    data: {
      remaining: stats.currentPeriod.remaining,
      limit: stats.currentPeriod.limit,
      resetDate: stats.currentPeriod.resetDate,
      tier: stats.subscriptionTier,
      periodType: stats.currentPeriod.periodType,
    },
  });
});
