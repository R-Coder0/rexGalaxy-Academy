import { Router } from "express";
import {
  getCourseMenuTree,
  adminListCourseCategories,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
  adminListCourseSubcategories,
  createCourseSubcategory,
  updateCourseSubcategory,
  deleteCourseSubcategory,
} from "../controllers/courseMenu.controller";

const router = Router();

/* Public */
router.get("/menu", getCourseMenuTree);

/* Admin - Categories */
router.get("/admin/categories", adminListCourseCategories);
router.post("/admin/categories", createCourseCategory);
router.patch("/admin/categories/:id", updateCourseCategory);
router.delete("/admin/categories/:id", deleteCourseCategory);

/* Admin - Subcategories */
router.get("/admin/subcategories", adminListCourseSubcategories);
router.post("/admin/subcategories", createCourseSubcategory);
router.patch("/admin/subcategories/:id", updateCourseSubcategory);
router.delete("/admin/subcategories/:id", deleteCourseSubcategory);

export default router;