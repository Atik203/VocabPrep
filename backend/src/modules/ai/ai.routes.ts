import { Router } from "express";
import { aiRateLimit } from "../../middlewares/aiRateLimit";
import { authenticate } from "../../middlewares/authenticate";
import {
  enhanceVocab,
  getQuota,
  getUsage,
  practiceFeedback,
} from "./ai.controller";

const router = Router();

/**
 * All AI routes require authentication
 * Rate-limited routes also check AI quota before processing
 */

// AI Enhancement routes (with rate limiting)
router.post("/enhance-vocab", authenticate, aiRateLimit, enhanceVocab);
router.post("/practice-feedback", authenticate, aiRateLimit, practiceFeedback);

// Usage statistics routes (no rate limiting)
router.get("/usage", authenticate, getUsage);
router.get("/quota", authenticate, getQuota);

export const aiRoutes = router;
