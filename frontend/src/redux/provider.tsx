"use client";

import type { PropsWithChildren } from "react";
import { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import type { AppStore } from "./store";
import { makeStore, persistor } from "./store";

export function StoreProvider({ children }: PropsWithChildren) {
  const storeRef = useRef<AppStore | undefined>(undefined);
  const persistorRef = useRef<ReturnType<typeof persistor> | undefined>(
    undefined
  );

  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = persistor(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current!}>
        {children}
      </PersistGate>
    </Provider>
  );
}
