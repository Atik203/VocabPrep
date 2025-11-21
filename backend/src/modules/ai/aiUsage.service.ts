import { env } from "../../config/env";
import { UserModel } from "../auth/user.model";
import { AIUsageModel } from "./aiUsage.model";

/**
 * Check if user has exceeded their AI request quota
 */
export async function checkRateLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetDate: Date;
  tier: string;
}> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();

  // Check if quota needs reset
  if (now >= user.aiResetDate) {
    await resetUserQuota(userId);
    // Refetch user after reset
    const updatedUser = await UserModel.findById(userId);
    if (!updatedUser) {
      throw new Error("User not found after reset");
    }
    return {
      allowed: updatedUser.aiRequestsRemaining > 0,
      remaining: updatedUser.aiRequestsRemaining,
      resetDate: updatedUser.aiResetDate,
      tier: updatedUser.subscriptionTier,
    };
  }

  return {
    allowed: user.aiRequestsRemaining > 0,
    remaining: user.aiRequestsRemaining,
    resetDate: user.aiResetDate,
    tier: user.subscriptionTier,
  };
}

/**
 * Decrement user's AI request quota
 */
export async function decrementQuota(userId: string): Promise<number> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.aiRequestsRemaining = Math.max(0, user.aiRequestsRemaining - 1);
  await user.save();

  return user.aiRequestsRemaining;
}

/**
 * Reset user's AI quota based on their subscription tier
 */
export async function resetUserQuota(userId: string): Promise<void> {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Determine new quota and reset date based on tier
  if (user.subscriptionTier === "free") {
    // Free tier: Daily reset at midnight UTC
    user.aiRequestsRemaining = env.AI_FREE_DAILY_LIMIT;
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    user.aiResetDate = tomorrow;
  } else {
    // Premium tier: Daily reset
    user.aiRequestsRemaining = env.AI_PREMIUM_DAILY_LIMIT;
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    user.aiResetDate = tomorrow;
  }

  await user.save();
}

/**
 * Track AI usage for analytics and billing
 */
export async function trackUsage(params: {
  userId: string;
  endpoint: string;
  tokensUsed: number;
  responseTime: number;
  success: boolean;
  errorMessage?: string;
  vocabularyId?: string;
  practiceId?: string;
}): Promise<void> {
  await AIUsageModel.create({
    userId: params.userId,
    endpoint: params.endpoint,
    tokensUsed: params.tokensUsed,
    responseTime: params.responseTime,
    success: params.success,
    errorMessage: params.errorMessage,
    vocabularyId: params.vocabularyId,
    practiceId: params.practiceId,
    requestTimestamp: new Date(),
  });
}

/**
 * Get user's AI usage statistics
 */
export async function getUserUsageStats(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Get total lifetime requests
  const totalRequests = await AIUsageModel.countDocuments({ userId });

  // Get recent usage (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentUsage = await AIUsageModel.aggregate([
    {
      $match: {
        userId: user._id,
        requestTimestamp: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$requestTimestamp" },
        },
        requests: { $sum: 1 },
        tokensUsed: { $sum: "$tokensUsed" },
        successRate: {
          $avg: { $cond: ["$success", 1, 0] },
        },
      },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $limit: 30,
    },
  ]);

  return {
    currentPeriod: {
      used:
        user.subscriptionTier === "free"
          ? env.AI_FREE_DAILY_LIMIT - user.aiRequestsRemaining
          : env.AI_PREMIUM_DAILY_LIMIT - user.aiRequestsRemaining,
      remaining: user.aiRequestsRemaining,
      limit:
        user.subscriptionTier === "free"
          ? env.AI_FREE_DAILY_LIMIT
          : env.AI_PREMIUM_DAILY_LIMIT,
      resetDate: user.aiResetDate,
      periodType: "daily",
    },
    subscriptionTier: user.subscriptionTier,
    totalLifetimeRequests: totalRequests,
    recentUsage: recentUsage.map((day) => ({
      date: day._id,
      requests: day.requests,
      tokensUsed: day.tokensUsed,
      successRate: Math.round(day.successRate * 100),
    })),
  };
}

/**
 * Get system-wide AI usage statistics (admin only)
 */
export async function getSystemUsageStats() {
  const now = new Date();
  const todayStart = new Date(now.setUTCHours(0, 0, 0, 0));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayStats, monthStats, totalUsers, premiumUsers] = await Promise.all([
    AIUsageModel.aggregate([
      { $match: { requestTimestamp: { $gte: todayStart } } },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          totalTokens: { $sum: "$tokensUsed" },
          successRate: { $avg: { $cond: ["$success", 1, 0] } },
          avgResponseTime: { $avg: "$responseTime" },
        },
      },
    ]),
    AIUsageModel.aggregate([
      { $match: { requestTimestamp: { $gte: monthStart } } },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          totalTokens: { $sum: "$tokensUsed" },
        },
      },
    ]),
    UserModel.countDocuments(),
    UserModel.countDocuments({ subscriptionTier: "premium" }),
  ]);

  return {
    today: todayStats[0] || {
      totalRequests: 0,
      totalTokens: 0,
      successRate: 0,
      avgResponseTime: 0,
    },
    thisMonth: monthStats[0] || { totalRequests: 0, totalTokens: 0 },
    users: {
      total: totalUsers,
      premium: premiumUsers,
      free: totalUsers - premiumUsers,
    },
  };
}
