import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AIState {
  quota: {
    remaining: number;
    limit: number;
    resetDate: string | null;
    tier: "free" | "premium";
  };
  isEnhancing: boolean;
  isFeedbackGenerating: boolean;
}

const initialState: AIState = {
  quota: {
    remaining: 100,
    limit: 100,
    resetDate: null,
    tier: "free",
  },
  isEnhancing: false,
  isFeedbackGenerating: false,
};

export const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setQuota: (
      state,
      action: PayloadAction<{
        remaining: number;
        limit: number;
        resetDate: string;
        tier: "free" | "premium";
      }>
    ) => {
      state.quota = action.payload;
    },
    decrementQuota: (state) => {
      if (state.quota.remaining > 0) {
        state.quota.remaining -= 1;
      }
    },
    setEnhancing: (state, action: PayloadAction<boolean>) => {
      state.isEnhancing = action.payload;
    },
    setFeedbackGenerating: (state, action: PayloadAction<boolean>) => {
      state.isFeedbackGenerating = action.payload;
    },
  },
});

export const { setQuota, decrementQuota, setEnhancing, setFeedbackGenerating } =
  aiSlice.actions;

export const aiReducer = aiSlice.reducer;
