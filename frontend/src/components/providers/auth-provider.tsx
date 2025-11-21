"use client";

import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { logout, setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/auth",
  "/words",
  "/pricing",
];

// Routes that require authentication
const protectedRoutes = [
  "/practice",
  "/progress",
  "/profile",
  "/add-word",
  "/dashboard",
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Get token and auth status from Redux state (persisted in localStorage)
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);

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

  // Redirect to login if accessing protected route without authentication
  useEffect(() => {
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute && !token && !isLoading) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, token, isLoading, router]);

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
