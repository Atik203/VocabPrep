import type { CreateVocabularyPayload } from "@/lib/api";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const difficultyOptions = ["easy", "medium", "hard"] as const;
export const statusOptions = ["new", "learning", "learned"] as const;

export type DifficultyOption = (typeof difficultyOptions)[number];
export type StatusOption = (typeof statusOptions)[number];

export interface VocabularyFilters {
  difficulty?: DifficultyOption;
  status?: StatusOption;
  search?: string;
}

interface VocabularyState {
  filters: VocabularyFilters;
  form: CreateVocabularyPayload;
  synonymsText: string;
  antonymsText: string;
}

const createInitialForm = (): CreateVocabularyPayload => ({
  word: "",
  meaning: "",
  meaningBn: "",
  partOfSpeech: "",
  exampleSentence: "",
  synonyms: [],
  antonyms: [],
  topicTags: [],
  difficulty: "medium",
  status: "new",
  notes: "",
});

const initialState: VocabularyState = {
  filters: {},
  form: createInitialForm(),
  synonymsText: "",
  antonymsText: "",
};

const vocabularySlice = createSlice({
  name: "vocabulary",
  initialState,
  reducers: {
    setFilter(
      state,
      action: PayloadAction<{
        key: keyof VocabularyFilters;
        value?: VocabularyFilters[keyof VocabularyFilters];
      }>
    ) {
      const { key, value } = action.payload;
      if (value === undefined || value === "") {
        delete state.filters[key];
      } else {
        state.filters[key] = value;
      }
    },
    setSearch(state, action: PayloadAction<string>) {
      const value = action.payload;
      if (!value) {
        delete state.filters.search;
      } else {
        state.filters.search = value;
      }
    },
    resetFilters(state) {
      state.filters = {};
    },
    updateForm(
      state,
      action: PayloadAction<{
        key: keyof CreateVocabularyPayload;
        value: CreateVocabularyPayload[keyof CreateVocabularyPayload];
      }>
    ) {
      const { key, value } = action.payload;
      state.form[key] = value;
    },
    resetForm(state) {
      state.form = createInitialForm();
      state.synonymsText = "";
      state.antonymsText = "";
    },
    setSynonymsText(state, action: PayloadAction<string>) {
      state.synonymsText = action.payload;
    },
    setAntonymsText(state, action: PayloadAction<string>) {
      state.antonymsText = action.payload;
    },
  },
});

export const vocabularyReducer = vocabularySlice.reducer;
export const {
  resetFilters,
  resetForm,
  setAntonymsText,
  setFilter,
  setSearch,
  setSynonymsText,
  updateForm,
} = vocabularySlice.actions;
