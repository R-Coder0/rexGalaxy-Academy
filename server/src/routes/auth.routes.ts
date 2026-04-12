import { Router } from "express";
import { adminLogin } from "../controllers/auth.controller";

const router = Router();

// ✅ POST /api/auth/admin/login
router.post("/admin/login", adminLogin);

export default router;
