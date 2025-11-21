import { NextFunction, Request, Response } from "express";
import { UserModel } from "../modules/auth/user.model";
import { HttpError } from "../utils/httpError";

/**
 * Middleware to check if user has admin privileges
 * Must be used after authenticate middleware
 */
export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new HttpError(401, "Authentication required");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (!user.isAdmin) {
      throw new HttpError(403, "Access denied. Admin privileges required.");
    }

    next();
  } catch (error: any) {
    next(error);
  }
}
