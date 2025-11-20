"use client";

import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { logout, setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Routes that don't require authentication
const publicRoutes = ["/", "/login", "/register", "/auth", "/words"];

// Helper function to get cookie
function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const token = typeof window !== "undefined" ? getCookie("token") : null;

  // Only fetch user data if token exists
  const { data, isSuccess, isError, isLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (isSuccess && data?.data?.user && token) {
      dispatch(setCredentials({ user: data.data.user, token }));
    }
  }, [isSuccess, data, token, dispatch]);

  // Handle authentication errors
  useEffect(() => {
    if (isError && token) {
      // Token is invalid or expired
      dispatch(logout());

      // Redirect to login if on protected route
      const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
      );
      if (!isPublicRoute) {
        router.push(`/login?from=${encodeURIComponent(pathname)}`);
      }
    }
  }, [isError, token, pathname, router, dispatch]);

  // Show loading spinner while checking auth on protected routes
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isLoading && token && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            Loading your session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
