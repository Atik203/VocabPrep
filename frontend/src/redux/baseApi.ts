import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
  type FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

// Helper function to get cookie
function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// Base query with error handling
const baseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      const token = getCookie("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  // Handle errors globally
  if (result.error) {
    const status = result.error.status;
    const errorData = result.error.data as any;

    if (status === 401) {
      toast.error("Authentication Required", {
        description: "Please log in to continue.",
      });
      // Clear invalid token
      document.cookie = "token=; path=/; max-age=0";
      // Redirect to login after a short delay
      setTimeout(() => {
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }
      }, 1500);
    } else if (status === 403) {
      toast.error("Access Denied", {
        description: "You don't have permission to perform this action.",
      });
    } else if (status === 404) {
      // Don't show toast for 404s as they're often expected
      console.log("Resource not found:", errorData?.message);
    } else if (status === 500) {
      toast.error("Server Error", {
        description: "Something went wrong on our end. Please try again.",
      });
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "vocabPrepApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [
    "Vocabulary",
    "Practice",
    "Tense",
    "Progress",
    "AIUsage",
    "AIQuota",
    "AdminUsers",
    "AdminStats",
    "AdminUserUsage",
  ],
  endpoints: () => ({}),
});
