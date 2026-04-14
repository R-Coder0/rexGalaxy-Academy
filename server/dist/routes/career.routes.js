"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const career_controller_1 = require("../controllers/career.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
// import { requireAdmin } from "../middleware/auth.middleware"; // (later)
const router = (0, express_1.Router)();
// Public: apply job (resume upload)
router.post("/", upload_middleware_1.upload.single("resume"), career_controller_1.createApplication);
// Admin: list applications (protected later)
router.get("/admin", /* requireAdmin, */ career_controller_1.listApplicationsAdmin);
router.delete("/admin/:id", career_controller_1.deleteApplicationAdmin);
exports.default = router;
