import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  googleId?: string;
  isAdmin?: boolean;
  subscriptionTier?: "free" | "premium";
  aiRequestsRemaining?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Custom base query with token from Redux state
const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      // Get token from Redux state (persisted in localStorage)
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  return baseQuery(args, api, extraOptions);
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterInput>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginInput>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getMe: builder.query<{ success: boolean; data: { user: User } }, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<
      { success: boolean; message: string; data: { user: User } },
      Partial<Pick<User, "name" | "avatar">>
    >({
      query: (data) => ({
        url: "/auth/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useUpdateUserMutation,
} = authApi;
