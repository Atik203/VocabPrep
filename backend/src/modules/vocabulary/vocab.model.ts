import { Schema, model, type Document } from "mongoose";

export type Difficulty = "easy" | "medium" | "hard";
export type LearningStatus = "new" | "learning" | "learned";

export interface VocabularyDocument extends Document {
  word: string;
  meaning: string;
  meaningBn?: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: Difficulty;
  status: LearningStatus;
  notes?: string;
  // Dictionary API fields
  phonetic?: string;
  phoneticAudio?: string;
  sourceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const vocabularySchema = new Schema<VocabularyDocument>(
  {
    word: { type: String, required: true, trim: true, lowercase: false },
    meaning: { type: String, required: true, trim: true },
    meaningBn: { type: String, trim: true },
    partOfSpeech: { type: String, trim: true },
    exampleSentence: { type: String, trim: true },
    synonyms: { type: [String], default: [] },
    antonyms: { type: [String], default: [] },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["new", "learning", "learned"],
      default: "new",
    },
    notes: { type: String, trim: true },
    // Dictionary API fields
    phonetic: { type: String, trim: true },
    phoneticAudio: { type: String, trim: true },
    sourceUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

vocabularySchema.index(
  { word: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

export const VocabularyModel = model<VocabularyDocument>(
  "Vocabulary",
  vocabularySchema
);
