import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import { practiceReducer } from "./features/practice/practiceSlice";
import { tenseReducer } from "./features/tense/tenseSlice";
import { vocabularyReducer } from "./features/vocabulary/vocabularySlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      vocabulary: vocabularyReducer,
      practice: practiceReducer,
      tense: tenseReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
