import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import authRoutes from "../modules/auth/auth.routes";
import practiceRoutes from "../modules/practice/practice.routes";
import tenseRoutes from "../modules/tenses/tenses.routes";
import userProgressRoutes from "../modules/vocabulary/userProgress.routes";
import vocabularyRoutes from "../modules/vocabulary/vocab.routes";
import { aiRoutes } from "../modules/ai/ai.routes";
import { adminRoutes } from "../modules/admin/admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/vocabulary", vocabularyRoutes);
router.use("/vocab", vocabularyRoutes); // Keep backward compatibility
router.use("/practices", practiceRoutes);
router.use("/tenses", tenseRoutes);
router.use("/progress", authenticate, userProgressRoutes);

// AI routes (authentication + rate limiting handled in router)
router.use("/ai", aiRoutes);

// Admin routes (authentication + admin check handled in router)
router.use("/admin", adminRoutes);

export default router;
