import { Router } from "express";
import jobRoutes from "./job.routes";
import careerRoutes from "./career.routes";
import enquiryRoutes from "./enquiry.routes";
import feedbackRoutes from "./feedback.routes";
import adminRoutes from "./admin.routes";
import authRoutes from "./auth.routes";
import courseMenu from "./courseMenu.routes"
import registrationRoutes from "./registration.routes";
import offerLetterRoutes from "./offerLetter.routes";
import experienceLetterRoutes from "./experienceLetter.routes";
import courseDetailRoutes from "./courseDetail.routes";

const router = Router();

router.use("/jobs", jobRoutes);
router.use("/careers", careerRoutes);
router.use("/enquiry", enquiryRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/admin", adminRoutes);
router.use("/course-menu", courseMenu);
router.use("/registrations", registrationRoutes);
router.use("/offer-letters", offerLetterRoutes);
router.use("/experience-letters", experienceLetterRoutes);
router.use("/course-details", courseDetailRoutes);
router.use("/auth", authRoutes);

export default router;
    
