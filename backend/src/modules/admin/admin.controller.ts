import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../../utils/asyncHandler";
import { HttpError } from "../../utils/httpError";
import {
  getAdminStats,
  getAllUsers,
  getUserAIUsageDetails,
  updateUserSubscription,
} from "./admin.service";

const getUsersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  tier: z.enum(["free", "premium"]).optional(),
});

const updateSubscriptionSchema = z.object({
  tier: z.enum(["free", "premium"]),
  expiresAt: z.string().datetime().optional(),
});

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users with pagination
 * @access  Private (Admin only)
 */
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const validated = getUsersSchema.parse(req.query);

  const result = await getAllUsers(validated);

  res.status(200).json({
    success: true,
    data: result.users,
    pagination: result.pagination,
  });
});

/**
 * @route   GET /api/v1/admin/ai-stats
 * @desc    Get system-wide AI usage statistics
 * @access  Private (Admin only)
 */
export const getAIStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getAdminStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * @route   GET /api/v1/admin/users/:userId/ai-usage
 * @desc    Get specific user's AI usage details
 * @access  Private (Admin only)
 */
export const getUserAIUsage = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      throw new HttpError(400, "User ID is required");
    }

    const details = await getUserAIUsageDetails(userId);

    res.status(200).json({
      success: true,
      data: details,
    });
  }
);

/**
 * @route   PATCH /api/v1/admin/users/:userId/subscription
 * @desc    Update user's subscription tier
 * @access  Private (Admin only)
 */
export const updateSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const validated = updateSubscriptionSchema.parse(req.body);

    if (!userId) {
      throw new HttpError(400, "User ID is required");
    }

    const expiresAt = validated.expiresAt
      ? new Date(validated.expiresAt)
      : undefined;

    const updatedUser = await updateUserSubscription(
      userId,
      validated.tier,
      expiresAt
    );

    res.status(200).json({
      success: true,
      message: `User subscription updated to ${validated.tier}`,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        subscriptionTier: updatedUser.subscriptionTier,
        aiRequestsRemaining: updatedUser.aiRequestsRemaining,
        aiResetDate: updatedUser.aiResetDate,
        subscriptionExpiresAt: updatedUser.subscriptionExpiresAt,
      },
    });
  }
);
