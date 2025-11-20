import { createSlice } from "@reduxjs/toolkit";

type TenseViewMode = "grid" | "list";

interface TenseState {
  viewMode: TenseViewMode;
}

const initialState: TenseState = {
  viewMode: "grid",
};

const tenseSlice = createSlice({
  name: "tense",
  initialState,
  reducers: {
    toggleViewMode(state) {
      state.viewMode = state.viewMode === "grid" ? "list" : "grid";
    },
  },
});

export const tenseReducer = tenseSlice.reducer;
export const { toggleViewMode } = tenseSlice.actions;
