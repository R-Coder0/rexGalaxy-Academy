import { Request, Response } from "express";
import mongoose from "mongoose";
import { CourseCategory } from "../models/CourseCategory.model";
import { CourseSubcategory } from "../models/CourseSubcategory.model";

function makeSlug(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* =========================
   CATEGORY - CREATE
========================= */
export const createCourseCategory = async (req: Request, res: Response) => {
  try {
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const icon = String(req.body.icon || "").trim();
    const order = Number(req.body.order ?? 0);
    const isActive =
      typeof req.body.isActive === "boolean" ? req.body.isActive : true;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Category title is required.",
      });
    }

    const slug = makeSlug(req.body.slug || title);

    const exists = await CourseCategory.findOne({ slug });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category with same slug already exists.",
      });
    }

    const item = await CourseCategory.create({
      title,
      slug,
      description: description || undefined,
      icon: icon || undefined,
      order: Number.isFinite(order) ? order : 0,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Course category created successfully.",
      data: item,
    });
  } catch (err) {
    console.error("createCourseCategory error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/* =========================
   CATEGORY - LIST ADMIN
========================= */
export const adminListCourseCategories = async (_req: Request, res: Response) => {
  try {
    const items = await CourseCategory.find().sort({ order: 1, createdAt: -1 });
    return res.json({
      success: true,
      message: "OK",
      data: items,
    });
  } catch (err) {
    console.error("adminListCourseCategories error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/* =========================
   CATEGORY - UPDATE
========================= */
export const updateCourseCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id.",
      });
    }

    const title = req.body.title ? String(req.body.title).trim() : undefined;
    const description =
      req.body.description !== undefined
        ? String(req.body.description || "").trim()
        : undefined;
    const icon =
      req.body.icon !== undefined ? String(req.body.icon || "").trim() : undefined;
    const order =
      req.body.order !== undefined ? Number(req.body.order) : undefined;
    const isActive =
      typeof req.body.isActive === "boolean" ? req.body.isActive : undefined;

    const updateData: any = {};

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description || undefined;
    if (icon !== undefined) updateData.icon = icon || undefined;
    if (order !== undefined && Number.isFinite(order)) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (req.body.slug || title) {
      const slug = makeSlug(req.body.slug || title);
      const existing = await CourseCategory.findOne({
        slug,
        _id: { $ne: id },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Another category with same slug already exists.",
        });
      }

      updateData.slug = slug;
    }

    const updated = await CourseCategory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.json({
      success: true,
      message: "Course category updated successfully.",
      data: updated,
    });
  } catch (err) {
    console.error("updateCourseCategory error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/* =========================
   CATEGORY - DELETE
========================= */
export const deleteCourseCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id.",
      });
    }

    const subCount = await CourseSubcategory.countDocuments({ categoryId: id });
    if (subCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Delete subcategories first before deleting this category.",
      });
    }

    const deleted = await CourseCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.json({
      success: true,
      message: "Course category deleted successfully.",
      data: { id: deleted._id },
    });
  } catch (err) {
    console.error("deleteCourseCategory error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/* =========================
   SUBCATEGORY - CREATE
========================= */
export const createCourseSubcategory = async (req: Request, res: Response) => {
  try {
    const categoryId = String(req.body.categoryId || "").trim();
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const order = Number(req.body.order ?? 0);
    const isActive =
      typeof req.body.isActive === "boolean" ? req.body.isActive : true;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Valid categoryId is required.",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Subcategory title is required.",
      });
    }

    const category = await CourseCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Parent category not found.",
      });
    }

    const slug = makeSlug(req.body.slug || title);

    const exists = await CourseSubcategory.findOne({ categoryId, slug });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Subcategory with same slug already exists in this category.",
      });
    }

    const item = await CourseSubcategory.create({
      categoryId,
      title,
      slug,
      description: description || undefined,
      order: Number.isFinite(order) ? order : 0,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Course subcategory created successfully.",
      data: item,
    });
  } catch (err) {
    console.error("createCourseSubcategory error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/* =========================
   SUBCATEGORY - LIST ADMIN
========================= */
export const adminListCourseSubcategories = async (_req: Request, res: Response) => {
  try {
    const items = await CourseSubcategory.find()
      .populate("categoryId", "title slug")
      .sort({ order: 1, createdAt: -1 });

    return res.json({
      success: true,
      message: "OK",
      data: items,
    });
  } catch (err) {
    console.error("adminListCourseSubcategories error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/* =========================
   SUBCATEGORY - UPDATE
========================= */
export const updateCourseSubcategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory id.",
      });
    }

    const current = await CourseSubcategory.findById(id);
    if (!current) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found.",
      });
    }

    const title = req.body.title ? String(req.body.title).trim() : undefined;
    const description =
      req.body.description !== undefined
        ? String(req.body.description || "").trim()
        : undefined;
    const order =
      req.body.order !== undefined ? Number(req.body.order) : undefined;
    const isActive =
      typeof req.body.isActive === "boolean" ? req.body.isActive : undefined;
    const categoryId =
      req.body.categoryId !== undefined ? String(req.body.categoryId || "").trim() : undefined;

    const updateData: any = {};

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description || undefined;
    if (order !== undefined && Number.isFinite(order)) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    let finalCategoryId = current.categoryId.toString();

    if (categoryId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid categoryId.",
        });
      }

      const parentExists = await CourseCategory.findById(categoryId);
      if (!parentExists) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found.",
        });
      }

      finalCategoryId = categoryId;
      updateData.categoryId = categoryId;
    }

    if (req.body.slug || title) {
      const slug = makeSlug(req.body.slug || title);
      const exists = await CourseSubcategory.findOne({
        categoryId: finalCategoryId,
        slug,
        _id: { $ne: id },
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Another subcategory with same slug already exists in this category.",
        });
      }

      updateData.slug = slug;
    }

    const updated = await CourseSubcategory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("categoryId", "title slug");

    return res.json({
      success: true,
      message: "Course subcategory updated successfully.",
      data: updated,
    });
  } catch (err) {
    console.error("updateCourseSubcategory error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/* =========================
   SUBCATEGORY - DELETE
========================= */
export const deleteCourseSubcategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory id.",
      });
    }

    const deleted = await CourseSubcategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found.",
      });
    }

    return res.json({
      success: true,
      message: "Course subcategory deleted successfully.",
      data: { id: deleted._id },
    });
  } catch (err) {
    console.error("deleteCourseSubcategory error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

/* =========================
   PUBLIC MENU API
========================= */
export const getCourseMenuTree = async (_req: Request, res: Response) => {
  try {
    const categories = await CourseCategory.find({ isActive: true })
      .sort({ order: 1, title: 1 })
      .lean();

    const subcategories = await CourseSubcategory.find({ isActive: true })
      .sort({ order: 1, title: 1 })
      .lean();

    const tree = categories.map((cat) => ({
      _id: cat._id,
      title: cat.title,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      order: cat.order,
      children: subcategories
        .filter((sub) => String(sub.categoryId) === String(cat._id))
        .map((sub) => ({
          _id: sub._id,
          title: sub.title,
          slug: sub.slug,
          description: sub.description,
          order: sub.order,
        })),
    }));

    return res.json({
      success: true,
      message: "OK",
      data: tree,
    });
  } catch (err) {
    console.error("getCourseMenuTree error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};