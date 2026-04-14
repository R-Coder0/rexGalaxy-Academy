import { Router } from "express";
import {
  createRegistration,
  listRegistrations,
  deleteRegistration,
  updateRegistrationStatus,
} from "../controllers/registration.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

/* Public */
router.post("/", createRegistration);

/* Admin */
router.get("/", requireAdmin, listRegistrations);
router.delete("/:id", requireAdmin, deleteRegistration);
router.patch("/:id/status", requireAdmin, updateRegistrationStatus);

export default router;