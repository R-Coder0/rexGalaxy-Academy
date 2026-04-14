"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseMenuTree = exports.deleteCourseSubcategory = exports.updateCourseSubcategory = exports.adminListCourseSubcategories = exports.createCourseSubcategory = exports.deleteCourseCategory = exports.updateCourseCategory = exports.adminListCourseCategories = exports.createCourseCategory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CourseCategory_model_1 = require("../models/CourseCategory.model");
const CourseSubcategory_model_1 = require("../models/CourseSubcategory.model");
function makeSlug(value) {
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
const createCourseCategory = async (req, res) => {
    try {
        const title = String(req.body.title || "").trim();
        const description = String(req.body.description || "").trim();
        const icon = String(req.body.icon || "").trim();
        const order = Number(req.body.order ?? 0);
        const isActive = typeof req.body.isActive === "boolean" ? req.body.isActive : true;
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Category title is required.",
            });
        }
        const slug = makeSlug(req.body.slug || title);
        const exists = await CourseCategory_model_1.CourseCategory.findOne({ slug });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Category with same slug already exists.",
            });
        }
        const item = await CourseCategory_model_1.CourseCategory.create({
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
    }
    catch (err) {
        console.error("createCourseCategory error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.createCourseCategory = createCourseCategory;
/* =========================
   CATEGORY - LIST ADMIN
========================= */
const adminListCourseCategories = async (_req, res) => {
    try {
        const items = await CourseCategory_model_1.CourseCategory.find().sort({ order: 1, createdAt: -1 });
        return res.json({
            success: true,
            message: "OK",
            data: items,
        });
    }
    catch (err) {
        console.error("adminListCourseCategories error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.adminListCourseCategories = adminListCourseCategories;
/* =========================
   CATEGORY - UPDATE
========================= */
const updateCourseCategory = async (req, res) => {
    try {
        const id = String(req.params.id || "").trim();
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category id.",
            });
        }
        const title = req.body.title ? String(req.body.title).trim() : undefined;
        const description = req.body.description !== undefined
            ? String(req.body.description || "").trim()
            : undefined;
        const icon = req.body.icon !== undefined ? String(req.body.icon || "").trim() : undefined;
        const order = req.body.order !== undefined ? Number(req.body.order) : undefined;
        const isActive = typeof req.body.isActive === "boolean" ? req.body.isActive : undefined;
        const updateData = {};
        if (title)
            updateData.title = title;
        if (description !== undefined)
            updateData.description = description || undefined;
        if (icon !== undefined)
            updateData.icon = icon || undefined;
        if (order !== undefined && Number.isFinite(order))
            updateData.order = order;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        if (req.body.slug || title) {
            const slug = makeSlug(req.body.slug || title);
            const existing = await CourseCategory_model_1.CourseCategory.findOne({
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
        const updated = await CourseCategory_model_1.CourseCategory.findByIdAndUpdate(id, updateData, {
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
    }
    catch (err) {
        console.error("updateCourseCategory error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.updateCourseCategory = updateCourseCategory;
/* =========================
   CATEGORY - DELETE
========================= */
const deleteCourseCategory = async (req, res) => {
    try {
        const id = String(req.params.id || "").trim();
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category id.",
            });
        }
        const subCount = await CourseSubcategory_model_1.CourseSubcategory.countDocuments({ categoryId: id });
        if (subCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Delete subcategories first before deleting this category.",
            });
        }
        const deleted = await CourseCategory_model_1.CourseCategory.findByIdAndDelete(id);
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
    }
    catch (err) {
        console.error("deleteCourseCategory error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.deleteCourseCategory = deleteCourseCategory;
/* =========================
   SUBCATEGORY - CREATE
========================= */
const createCourseSubcategory = async (req, res) => {
    try {
        const categoryId = String(req.body.categoryId || "").trim();
        const title = String(req.body.title || "").trim();
        const description = String(req.body.description || "").trim();
        const order = Number(req.body.order ?? 0);
        const isActive = typeof req.body.isActive === "boolean" ? req.body.isActive : true;
        if (!mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
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
        const category = await CourseCategory_model_1.CourseCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Parent category not found.",
            });
        }
        const slug = makeSlug(req.body.slug || title);
        const exists = await CourseSubcategory_model_1.CourseSubcategory.findOne({ categoryId, slug });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Subcategory with same slug already exists in this category.",
            });
        }
        const item = await CourseSubcategory_model_1.CourseSubcategory.create({
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
    }
    catch (err) {
        console.error("createCourseSubcategory error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.createCourseSubcategory = createCourseSubcategory;
/* =========================
   SUBCATEGORY - LIST ADMIN
========================= */
const adminListCourseSubcategories = async (_req, res) => {
    try {
        const items = await CourseSubcategory_model_1.CourseSubcategory.find()
            .populate("categoryId", "title slug")
            .sort({ order: 1, createdAt: -1 });
        return res.json({
            success: true,
            message: "OK",
            data: items,
        });
    }
    catch (err) {
        console.error("adminListCourseSubcategories error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.adminListCourseSubcategories = adminListCourseSubcategories;
/* =========================
   SUBCATEGORY - UPDATE
========================= */
const updateCourseSubcategory = async (req, res) => {
    try {
        const id = String(req.params.id || "").trim();
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subcategory id.",
            });
        }
        const current = await CourseSubcategory_model_1.CourseSubcategory.findById(id);
        if (!current) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found.",
            });
        }
        const title = req.body.title ? String(req.body.title).trim() : undefined;
        const description = req.body.description !== undefined
            ? String(req.body.description || "").trim()
            : undefined;
        const order = req.body.order !== undefined ? Number(req.body.order) : undefined;
        const isActive = typeof req.body.isActive === "boolean" ? req.body.isActive : undefined;
        const categoryId = req.body.categoryId !== undefined ? String(req.body.categoryId || "").trim() : undefined;
        const updateData = {};
        if (title)
            updateData.title = title;
        if (description !== undefined)
            updateData.description = description || undefined;
        if (order !== undefined && Number.isFinite(order))
            updateData.order = order;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        let finalCategoryId = current.categoryId.toString();
        if (categoryId !== undefined) {
            if (!mongoose_1.default.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid categoryId.",
                });
            }
            const parentExists = await CourseCategory_model_1.CourseCategory.findById(categoryId);
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
            const exists = await CourseSubcategory_model_1.CourseSubcategory.findOne({
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
        const updated = await CourseSubcategory_model_1.CourseSubcategory.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate("categoryId", "title slug");
        return res.json({
            success: true,
            message: "Course subcategory updated successfully.",
            data: updated,
        });
    }
    catch (err) {
        console.error("updateCourseSubcategory error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.updateCourseSubcategory = updateCourseSubcategory;
/* =========================
   SUBCATEGORY - DELETE
========================= */
const deleteCourseSubcategory = async (req, res) => {
    try {
        const id = String(req.params.id || "").trim();
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subcategory id.",
            });
        }
        const deleted = await CourseSubcategory_model_1.CourseSubcategory.findByIdAndDelete(id);
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
    }
    catch (err) {
        console.error("deleteCourseSubcategory error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.deleteCourseSubcategory = deleteCourseSubcategory;
/* =========================
   PUBLIC MENU API
========================= */
const getCourseMenuTree = async (_req, res) => {
    try {
        const categories = await CourseCategory_model_1.CourseCategory.find({ isActive: true })
            .sort({ order: 1, title: 1 })
            .lean();
        const subcategories = await CourseSubcategory_model_1.CourseSubcategory.find({ isActive: true })
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
    }
    catch (err) {
        console.error("getCourseMenuTree error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
exports.getCourseMenuTree = getCourseMenuTree;
