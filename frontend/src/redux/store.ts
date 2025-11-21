import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import { authApi } from "./features/auth/authApi";
import authReducer from "./features/auth/authSlice";
import { aiReducer } from "./features/ai/aiSlice";
import { practiceReducer } from "./features/practice/practiceSlice";
import { tenseReducer } from "./features/tense/tenseSlice";
import { vocabularyReducer } from "./features/vocabulary/vocabularySlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      auth: authReducer,
      ai: aiReducer,
      vocabulary: vocabularyReducer,
      practice: practiceReducer,
      tense: tenseReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(baseApi.middleware, authApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
