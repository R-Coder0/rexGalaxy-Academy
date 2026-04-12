import { Router } from "express";
import { createEnquiry } from "../controllers/enquiry.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// attachment field name: "attachment"
router.post("/", upload.single("attachment"), createEnquiry);

export default router;
