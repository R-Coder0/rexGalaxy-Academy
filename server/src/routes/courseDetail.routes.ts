import { Router } from "express";
import {
  adminListCourseDetails,
  createCourseDetail,
  deleteCourseDetail,
  getCourseDetailBySlug,
  publicListCourseDetails,
  updateCourseDetail,
} from "../controllers/courseDetail.controller";
import { requireAdmin } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();
const courseDetailUploads = upload.fields([
  { name: "featureImage", maxCount: 1 },
  { name: "brochure", maxCount: 1 },
]);

/* Public */
router.get("/", publicListCourseDetails);

/* Admin */
router.get("/admin/list", requireAdmin, adminListCourseDetails);
router.post("/admin", requireAdmin, courseDetailUploads, createCourseDetail);
router.patch(
  "/admin/:id",
  requireAdmin,
  courseDetailUploads,
  updateCourseDetail
);
router.delete("/admin/:id", requireAdmin, deleteCourseDetail);

/* Public Detail */
router.get("/:slug", getCourseDetailBySlug);

export default router;
