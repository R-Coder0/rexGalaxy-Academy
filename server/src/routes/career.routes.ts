import { Router } from "express";
import { createApplication, deleteApplicationAdmin, listApplicationsAdmin } from "../controllers/career.controller";
import { upload } from "../middleware/upload.middleware";
// import { requireAdmin } from "../middleware/auth.middleware"; // (later)

const router = Router();

// Public: apply job (resume upload)
router.post("/", upload.single("resume"), createApplication);

// Admin: list applications (protected later)
router.get("/admin", /* requireAdmin, */ listApplicationsAdmin);

router.delete("/admin/:id", deleteApplicationAdmin);

export default router;

