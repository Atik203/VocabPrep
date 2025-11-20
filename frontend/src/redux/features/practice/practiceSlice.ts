import type { CreatePracticePayload } from "@/lib/api";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const examOptions = ["IELTS", "TOEFL", "GRE"] as const;
export const skillOptions = [
  "reading",
  "listening",
  "writing",
  "speaking",
] as const;

export type ExamOption = (typeof examOptions)[number];
export type SkillOption = (typeof skillOptions)[number];

interface PracticeState {
  form: CreatePracticePayload;
}

const createInitialForm = (): CreatePracticePayload => ({
  exam: "IELTS",
  skill: "writing",
  prompt: "",
  yourAnswer: "",
  feedbackOrNotes: "",
});

const initialState: PracticeState = {
  form: createInitialForm(),
};

const practiceSlice = createSlice({
  name: "practice",
  initialState,
  reducers: {
    updateForm(
      state,
      action: PayloadAction<{
        key: keyof CreatePracticePayload;
        value: CreatePracticePayload[keyof CreatePracticePayload];
      }>
    ) {
      const { key, value } = action.payload;
      state.form[key] = value;
    },
    resetForm(state) {
      state.form = createInitialForm();
    },
  },
});

export const practiceReducer = practiceSlice.reducer;
export const { resetForm: resetPracticeForm, updateForm: updatePracticeForm } =
  practiceSlice.actions;
