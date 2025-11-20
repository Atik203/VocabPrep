"use client";

import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Only fetch user data if token exists
  const { data, isSuccess } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (isSuccess && data?.data?.user && token) {
      dispatch(setCredentials({ user: data.data.user, token }));
    }
  }, [isSuccess, data, token, dispatch]);

  return <>{children}</>;
}
