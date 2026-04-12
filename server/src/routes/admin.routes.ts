import { Router } from "express";
import { requireAdmin } from "../middleware/auth.middleware";
import { adminGetApplications } from "../controllers/admin.controller";
import {
  adminListJobs,
  createJob,
  updateJob,
  toggleJob,
  deleteJob,
} from "../controllers/job.controller";
import { deleteFeedback, listFeedback } from "../controllers/feedback.controller";
import { deleteEnquiry, listEnquiries } from "../controllers/enquiry.controller";
import { getAdminDashboard } from "../controllers/dashboard.controller";


const router = Router();

router.get("/me", requireAdmin, (req, res) => {
  return res.json({ success: true, admin: (req as any).admin });
});



router.get("/jobs/", adminListJobs);
router.post("/jobs/", createJob);
router.patch("/jobs/:id", updateJob);
router.patch("/jobs/:id/toggle", toggleJob);
router.delete("/jobs/:id", deleteJob);
router.delete("/enquiries/:id", deleteEnquiry);
router.delete("/feedback/:id", deleteFeedback);
router.get("/applications", adminGetApplications);
router.get("/enquiries", listEnquiries);
router.get("/feedback", listFeedback);
router.get("/dashboard", getAdminDashboard);

export default router;
