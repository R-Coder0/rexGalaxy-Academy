"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enquiry_controller_1 = require("../controllers/enquiry.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
// attachment field name: "attachment"
router.post("/", upload_middleware_1.upload.single("attachment"), enquiry_controller_1.createEnquiry);
exports.default = router;
