import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import practiceRoutes from "../modules/practice/practice.routes";
import tenseRoutes from "../modules/tenses/tenses.routes";
import vocabularyRoutes from "../modules/vocabulary/vocab.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/vocab", vocabularyRoutes);
router.use("/practices", practiceRoutes);
router.use("/tenses", tenseRoutes);

export default router;
