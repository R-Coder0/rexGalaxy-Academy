import { Router } from "express";
import jobRoutes from "./job.routes";
import careerRoutes from "./career.routes";
import enquiryRoutes from "./enquiry.routes";
import feedbackRoutes from "./feedback.routes";
import adminRoutes from "./admin.routes";
import authRoutes from "./auth.routes";
const router = Router();

router.use("/jobs", jobRoutes);
router.use("/careers", careerRoutes);
router.use("/enquiry", enquiryRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);

export default router;
    