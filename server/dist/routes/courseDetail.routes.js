"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseDetail_controller_1 = require("../controllers/courseDetail.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
/* Public */
router.get("/", courseDetail_controller_1.publicListCourseDetails);
/* Admin */
router.get("/admin/list", auth_middleware_1.requireAdmin, courseDetail_controller_1.adminListCourseDetails);
router.post("/admin", auth_middleware_1.requireAdmin, upload_middleware_1.upload.single("brochure"), courseDetail_controller_1.createCourseDetail);
router.patch("/admin/:id", auth_middleware_1.requireAdmin, upload_middleware_1.upload.single("brochure"), courseDetail_controller_1.updateCourseDetail);
router.delete("/admin/:id", auth_middleware_1.requireAdmin, courseDetail_controller_1.deleteCourseDetail);
/* Public Detail */
router.get("/:slug", courseDetail_controller_1.getCourseDetailBySlug);
exports.default = router;
