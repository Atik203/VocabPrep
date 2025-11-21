"use client";

import { setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      router.push("/login?error=oauth_failed");
      return;
    }

    if (token) {
      // Fetch user data
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Store credentials in Redux (persisted to localStorage)
            dispatch(setCredentials({ user: data.data.user, token }));
            router.push("/");
          } else {
            router.push("/login?error=oauth_failed");
          }
        })
        .catch(() => {
          router.push("/login?error=oauth_failed");
        });
    } else {
      router.push("/login");
    }
  }, [searchParams, router, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
