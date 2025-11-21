import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import {
  checkDuplicateHandler,
  createVocabularyHandler,
  deleteVocabularyHandler,
  getVocabularyHandler,
  listVocabularyHandler,
  updateVocabularyHandler,
} from "./vocab.controller";

const router = Router();

// Specific routes MUST come before parameterized routes
router.get("/check-duplicate", checkDuplicateHandler);

// Public routes (no authentication required)
router.get("/", listVocabularyHandler);
router.get("/:id", getVocabularyHandler);

// Protected routes (authentication required)
router.post("/", authenticate, createVocabularyHandler);
router.patch("/:id", authenticate, updateVocabularyHandler);
router.delete("/:id", authenticate, deleteVocabularyHandler);

export default router;
