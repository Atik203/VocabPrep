import { Request, Response, NextFunction } from "express";
import { verifyToken, getUserById } from "../modules/auth/auth.service";
import { HttpError } from "../utils/httpError";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
        googleId?: string;
      };
      userId?: string;
    }
  }
}

// Middleware to authenticate user
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "No token provided");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);

    // Get user
    const user = await getUserById(decoded.userId);

    // Attach user to request
    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      googleId: user.googleId,
    };
    req.userId = user._id.toString();

    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      const user = await getUserById(decoded.userId);
      req.user = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        googleId: user.googleId,
      };
      req.userId = user._id.toString();
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
