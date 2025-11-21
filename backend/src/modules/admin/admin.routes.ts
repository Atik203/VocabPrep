import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { isAdmin } from "../../middlewares/isAdmin";
import {
  getAIStats,
  getUserAIUsage,
  getUsers,
  updateSubscription,
} from "./admin.controller";

const router = Router();

/**
 * All admin routes require authentication + admin privileges
 */

// User management
router.get("/users", authenticate, isAdmin, getUsers);
router.get("/users/:userId/ai-usage", authenticate, isAdmin, getUserAIUsage);
router.patch(
  "/users/:userId/subscription",
  authenticate,
  isAdmin,
  updateSubscription
);

// System statistics
router.get("/ai-stats", authenticate, isAdmin, getAIStats);

export const adminRoutes = router;
