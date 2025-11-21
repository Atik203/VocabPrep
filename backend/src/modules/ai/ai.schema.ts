import { z } from "zod";

/**
 * Validation schemas for AI endpoints
 */

export const enhanceVocabSchema = z.object({
  word: z
    .string()
    .min(1, "Word is required")
    .max(100, "Word too long")
    .regex(/^[a-zA-Z\s-']+$/, "Invalid characters in word"),
  meaning: z
    .string()
    .min(1, "Meaning is required")
    .max(1000, "Meaning too long"),
  context: z
    .enum(["beginner", "intermediate", "advanced"])
    .optional()
    .default("intermediate"),
});

export const practiceFeedbackSchema = z.object({
  vocabularyId: z.string().optional(),
  word: z.string().min(1, "Word is required").max(100, "Word too long"),
  userAnswer: z
    .string()
    .min(1, "Answer is required")
    .max(500, "Answer too long"),
  skill: z
    .enum(["reading", "listening", "writing", "speaking"])
    .default("writing"),
});

export const getUsageStatsSchema = z.object({
  days: z.coerce.number().min(1).max(90).optional().default(30),
});

export type EnhanceVocabInput = z.infer<typeof enhanceVocabSchema>;
export type PracticeFeedbackInput = z.infer<typeof practiceFeedbackSchema>;
export type GetUsageStatsInput = z.infer<typeof getUsageStatsSchema>;
