import { z } from "zod";
import type { Difficulty, LearningStatus } from "./vocab.model";

const difficultyEnum: readonly [Difficulty, Difficulty, Difficulty] = [
  "easy",
  "medium",
  "hard",
];
const statusEnum: readonly [LearningStatus, LearningStatus, LearningStatus] = [
  "new",
  "learning",
  "learned",
];

export const createVocabularySchema = z.object({
  word: z.string().min(1).trim(),
  meaning: z.string().min(1).trim(),
  meaningBn: z.string().trim().optional(),
  partOfSpeech: z.string().trim().optional(),
  phonetic: z.string().trim().optional(),
  phoneticAudio: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
  exampleSentence: z.string().trim().optional(),
  synonyms: z.array(z.string().trim()).max(10).optional().default([]),
  antonyms: z.array(z.string().trim()).max(10).optional().default([]),
  topicTags: z.array(z.string().trim()).max(20).optional().default([]),
  difficulty: z.enum(difficultyEnum).default("medium"),
  status: z.enum(statusEnum).default("new"),
  notes: z.string().trim().optional(),
});

export const updateVocabularySchema = createVocabularySchema.partial();

export const filterVocabularySchema = z.object({
  difficulty: z.enum(difficultyEnum).optional(),
  status: z.enum(statusEnum).optional(),
  search: z.string().trim().optional(),
});

export type CreateVocabularyInput = z.infer<typeof createVocabularySchema>;
export type UpdateVocabularyInput = z.infer<typeof updateVocabularySchema>;
export type FilterVocabularyInput = z.infer<typeof filterVocabularySchema>;
