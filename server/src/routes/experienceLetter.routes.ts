import { Router } from "express";
import {
  createExperienceLetter,
  deleteExperienceLetter,
  listExperienceLetters,
} from "../controllers/experienceLetter.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAdmin, listExperienceLetters);
router.post("/", requireAdmin, createExperienceLetter);
router.delete("/:id", requireAdmin, deleteExperienceLetter);

export default router;
