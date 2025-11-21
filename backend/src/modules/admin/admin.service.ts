import { getSystemUsageStats, getUserUsageStats } from "../ai/aiUsage.service";
import { UserModel } from "../auth/user.model";

/**
 * Get all users with pagination
 */
export async function getAllUsers(params: {
  page: number;
  limit: number;
  search?: string;
  tier?: string;
}) {
  const { page, limit, search, tier } = params;
  const skip = (page - 1) * limit;

  // Build query
  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (tier) {
    query.subscriptionTier = tier;
  }

  const [users, total] = await Promise.all([
    UserModel.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    UserModel.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Update user subscription tier
 */
export async function updateUserSubscription(
  userId: string,
  tier: "free" | "premium",
  expiresAt?: Date
) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.subscriptionTier = tier;

  if (tier === "premium") {
    user.subscriptionExpiresAt = expiresAt;
    // Set monthly quota
    user.aiRequestsRemaining = 500;
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    user.aiResetDate = nextMonth;
  } else {
    user.subscriptionExpiresAt = undefined;
    // Reset to daily quota
    user.aiRequestsRemaining = 100;
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    user.aiResetDate = tomorrow;
  }

  await user.save();
  return user;
}

/**
 * Get specific user's AI usage details
 */
export async function getUserAIUsageDetails(userId: string) {
  const user = await UserModel.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }

  const usageStats = await getUserUsageStats(userId);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
      aiRequestsRemaining: user.aiRequestsRemaining,
      aiResetDate: user.aiResetDate,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    },
    usage: usageStats,
  };
}

/**
 * Get system-wide AI statistics (admin dashboard)
 */
export async function getAdminStats() {
  return await getSystemUsageStats();
}
