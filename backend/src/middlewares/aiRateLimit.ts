import { NextFunction, Request, Response } from "express";
import { checkRateLimit, decrementQuota } from "../modules/ai/aiUsage.service";
import { HttpError } from "../utils/httpError";

/**
 * Middleware to enforce AI request rate limits per user
 * Blocks requests if user has exceeded their daily/monthly quota
 */
export async function aiRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new HttpError(401, "Authentication required");
    }

    // Check if user has remaining quota
    const rateLimitStatus = await checkRateLimit(userId);

    if (!rateLimitStatus.allowed) {
      return res.status(429).json({
        success: false,
        error: "AI request limit exceeded",
        message: `You've reached your ${rateLimitStatus.tier} tier limit. ${
          rateLimitStatus.tier === "free"
            ? "Upgrade to premium for more requests!"
            : "Your quota will reset soon."
        }`,
        quota: {
          remaining: 0,
          resetDate: rateLimitStatus.resetDate,
          tier: rateLimitStatus.tier,
        },
        upgradeUrl: rateLimitStatus.tier === "free" ? "/pricing" : null,
      });
    }

    // Decrement quota for this request
    const remaining = await decrementQuota(userId);

    // Attach quota info to request for use in controllers
    req.aiQuota = {
      remaining,
      resetDate: rateLimitStatus.resetDate,
      tier: rateLimitStatus.tier,
    };

    // Warn user if running low on quota
    if (remaining <= 10 && remaining > 0) {
      res.setHeader(
        "X-AI-Quota-Warning",
        `Only ${remaining} AI requests remaining`
      );
    }

    next();
  } catch (error: any) {
    next(error);
  }
}

// Extend Express Request type to include aiQuota
declare global {
  namespace Express {
    interface Request {
      aiQuota?: {
        remaining: number;
        resetDate: Date;
        tier: string;
      };
    }
  }
}
