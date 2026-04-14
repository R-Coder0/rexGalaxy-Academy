"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseMenu_controller_1 = require("../controllers/courseMenu.controller");
const router = (0, express_1.Router)();
/* Public */
router.get("/menu", courseMenu_controller_1.getCourseMenuTree);
/* Admin - Categories */
router.get("/admin/categories", courseMenu_controller_1.adminListCourseCategories);
router.post("/admin/categories", courseMenu_controller_1.createCourseCategory);
router.patch("/admin/categories/:id", courseMenu_controller_1.updateCourseCategory);
router.delete("/admin/categories/:id", courseMenu_controller_1.deleteCourseCategory);
/* Admin - Subcategories */
router.get("/admin/subcategories", courseMenu_controller_1.adminListCourseSubcategories);
router.post("/admin/subcategories", courseMenu_controller_1.createCourseSubcategory);
router.patch("/admin/subcategories/:id", courseMenu_controller_1.updateCourseSubcategory);
router.delete("/admin/subcategories/:id", courseMenu_controller_1.deleteCourseSubcategory);
exports.default = router;
