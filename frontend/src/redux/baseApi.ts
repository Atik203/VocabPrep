import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
  type FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import type { RootState } from "./store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

// Base query with error handling
const baseQueryWithErrorHandling = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      // Get token from Redux state
      const token = (getState() as RootState).auth.token;
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
