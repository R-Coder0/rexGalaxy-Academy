"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = require("../controllers/job.controller");
const router = (0, express_1.Router)();
// /api/jobs
router.get("/", job_controller_1.listJobs);
router.get("/:id", job_controller_1.getJob);
exports.default = router;
