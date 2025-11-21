import { baseApi } from "../../baseApi";

/**
 * Admin API endpoints for user and system management
 */

interface User {
  _id: string;
  name: string;
  email: string;
  subscriptionTier: "free" | "premium";
  aiRequestsRemaining: number;
  aiResetDate: string;
  isAdmin: boolean;
  createdAt: string;
  avatar?: string;
}

interface GetUsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface AIStatsResponse {
  success: boolean;
  data: {
    today: {
      totalRequests: number;
      totalTokens: number;
      successRate: number;
      avgResponseTime: number;
    };
    thisMonth: {
      totalRequests: number;
      totalTokens: number;
    };
    users: {
      total: number;
      premium: number;
      free: number;
    };
  };
}

interface UserAIUsageResponse {
  success: boolean;
  data: {
    user: User;
    usage: {
      currentPeriod: {
        used: number;
        remaining: number;
        limit: number;
        resetDate: string;
        periodType: "daily" | "monthly";
      };
      subscriptionTier: "free" | "premium";
      totalLifetimeRequests: number;
      recentUsage: Array<{
        date: string;
        requests: number;
        tokensUsed: number;
        successRate: number;
      }>;
    };
  };
}

interface UpdateSubscriptionRequest {
  userId: string;
  tier: "free" | "premium";
  expiresAt?: string;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination
    getUsers: builder.query<
      GetUsersResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        tier?: "free" | "premium";
      }
    >({
      query: (params) => ({
        url: "/admin/users",
        params,
      }),
      providesTags: ["AdminUsers"],
    }),

    // Get system-wide AI statistics
    getAIStats: builder.query<AIStatsResponse, void>({
      query: () => "/admin/ai-stats",
      providesTags: ["AdminStats"],
    }),

    // Get specific user's AI usage
    getUserAIUsage: builder.query<UserAIUsageResponse, string>({
      query: (userId) => `/admin/users/${userId}/ai-usage`,
      providesTags: ["AdminUserUsage"],
    }),

    // Update user subscription tier
    updateUserSubscription: builder.mutation<
      { success: boolean; message: string; data: User },
      UpdateSubscriptionRequest
    >({
      query: ({ userId, tier, expiresAt }) => ({
        url: `/admin/users/${userId}/subscription`,
        method: "PATCH",
        body: { tier, expiresAt },
      }),
      invalidatesTags: ["AdminUsers", "AdminUserUsage"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetAIStatsQuery,
  useGetUserAIUsageQuery,
  useUpdateUserSubscriptionMutation,
} = adminApi;

// Add new tag types
declare module "../../baseApi" {
  export interface TagTypes {
    AdminUsers: string;
    AdminStats: string;
    AdminUserUsage: string;
  }
}
