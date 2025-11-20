import type { FilterQuery } from "mongoose";
import { HttpError } from "../../utils/httpError";
import { VocabularyModel, type VocabularyDocument } from "./vocab.model";
import type {
  CreateVocabularyInput,
  FilterVocabularyInput,
  UpdateVocabularyInput,
} from "./vocab.schema";

export const checkDuplicateWord = async (
  word: string
): Promise<VocabularyDocument | null> => {
  return VocabularyModel.findOne({
    word: { $regex: new RegExp(`^${word}$`, "i") },
  }).lean();
};

export const createVocabulary = async (
  payload: CreateVocabularyInput
): Promise<VocabularyDocument> => {
  const existingWord = await checkDuplicateWord(payload.word);
  if (existingWord) {
    throw new HttpError(409, `Word "${payload.word}" already exists`);
  }
  return VocabularyModel.create(payload);
};

export const listVocabulary = async (
  filters: FilterVocabularyInput
): Promise<VocabularyDocument[]> => {
  const query: FilterQuery<VocabularyDocument> = {};

  if (filters.difficulty) {
    query.difficulty = filters.difficulty;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.search) {
    query.word = { $regex: filters.search, $options: "i" };
  }

  return VocabularyModel.find(query).sort({ updatedAt: -1 }).lean();
};

export const updateVocabulary = async (
  vocabId: string,
  payload: UpdateVocabularyInput
): Promise<VocabularyDocument> => {
  const updated = await VocabularyModel.findByIdAndUpdate(vocabId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw new HttpError(404, "Vocabulary not found");
  }

  return updated;
};

export const getVocabularyById = async (
  vocabId: string
): Promise<VocabularyDocument> => {
  const vocab = await VocabularyModel.findById(vocabId).lean();
  if (!vocab) {
    throw new HttpError(404, "Vocabulary not found");
  }
  return vocab;
};

export const deleteVocabulary = async (vocabId: string): Promise<void> => {
  const result = await VocabularyModel.findByIdAndDelete(vocabId);
  if (!result) {
    throw new HttpError(404, "Vocabulary not found");
  }
};
