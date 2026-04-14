import { Router } from "express";
import {
  createOfferLetter,
  deleteOfferLetter,
  listOfferLetters,
} from "../controllers/offerLetter.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAdmin, listOfferLetters);
router.post("/", requireAdmin, createOfferLetter);
router.delete("/:id", requireAdmin, deleteOfferLetter);

export default router;
