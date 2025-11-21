import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "./baseApi";
import { aiReducer } from "./features/ai/aiSlice";
import { authApi } from "./features/auth/authApi";
import authReducer from "./features/auth/authSlice";
import { practiceReducer } from "./features/practice/practiceSlice";
import { tenseReducer } from "./features/tense/tenseSlice";
import { vocabularyReducer } from "./features/vocabulary/vocabularySlice";

// Persist config for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      auth: persistedAuthReducer,
      ai: aiReducer,
      vocabulary: vocabularyReducer,
      practice: practiceReducer,
      tense: tenseReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApi.middleware, authApi.middleware),
  });
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;

export const persistor = (store: AppStore) => persistStore(store);
