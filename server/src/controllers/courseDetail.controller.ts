import { Request, Response } from "express";
import mongoose from "mongoose";
import { CourseCategory } from "../models/CourseCategory.model";
import { CourseSubcategory } from "../models/CourseSubcategory.model";
import { CourseDetail } from "../models/CourseDetail.model";

const toPublicUrl = (filePath: string) => {
  const normalized = filePath.replace(/\\/g, "/");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

function makeSlug(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeKeywords(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function parsePossiblyJson(value: unknown) {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return value;

  if (
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  return value;
}

function normalizeAboutCourse(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      const block = item as { title?: unknown; content?: unknown; order?: unknown };
      const title = String(block?.title || "").trim();
      const content = String(block?.content || "").trim();
      const order = Number(block?.order ?? index);

      if (!title || !content) return null;

      return {
        title,
        content,
        order: Number.isFinite(order) ? order : index,
      };
    })
    .filter(
      (
        block
      ): block is { title: string; content: string; order: number } => block !== null
    );
}

function normalizeModules(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const module = item as { title?: unknown; content?: unknown };
      const title = String(module?.title || "").trim();
      const content = String(module?.content || "").trim();

      if (!title || !content) return null;

      return {
        moduleNumber: 0,
        title,
        content,
      };
    })
    .filter(
      (
        module
      ): module is { moduleNumber: number; title: string; content: string } =>
        module !== null
    );
}

async function validateCategoryLinks(
  categoryId: string,
  subcategoryId?: string | null
) {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return "Valid categoryId is required.";
  }

  const category = await CourseCategory.findById(categoryId);
  if (!category) return "Selected category not found.";

  if (subcategoryId) {
    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
      return "Invalid subcategoryId.";
    }

    const subcategory = await CourseSubcategory.findById(subcategoryId);
    if (!subcategory) return "Selected subcategory not found.";

    if (String(subcategory.categoryId) !== String(categoryId)) {
      return "Subcategory does not belong to the selected category.";
    }
  }

  return null;
}

function detailPopulateQuery() {
  return [
    {
      path: "categoryId",
      select: "title slug",
    },
    {
      path: "subcategoryId",
      select: "title slug categoryId",
    },
  ];
}

export const createCourseDetail = async (req: Request, res: Response) => {
  try {
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const slug = makeSlug(req.body.slug || title);
    const metaTitle = String(req.body.metaTitle || "").trim();
    const metaDescription = String(req.body.metaDescription || "").trim();
    const metaKeywords = normalizeKeywords(parsePossiblyJson(req.body.metaKeywords));
    const canonicalUrl = String(req.body.canonicalUrl || "").trim();
    const categoryId = String(req.body.categoryId || "").trim();
    const subcategoryId = String(req.body.subcategoryId || "").trim();
    const brochureUrl = String(req.body.brochureUrl || "").trim();
    const duration = String(req.body.duration || "").trim();
    const aboutCourse = normalizeAboutCourse(parsePossiblyJson(req.body.aboutCourse));
    const modules = normalizeModules(parsePossiblyJson(req.body.modules));
    const conclusionTitle = String(req.body.conclusionTitle || "").trim();
    const conclusionContent = String(req.body.conclusionContent || "").trim();
    const isActive =
      typeof req.body.isActive === "boolean"
        ? req.body.isActive
        : String(req.body.isActive || "").trim() === "false"
          ? false
          : true;
    const brochureFile = req.file;

    if (!title || !description || !duration) {
      return res.status(400).json({
        success: false,
        message: "Title, description and duration are required.",
      });
    }

    if (aboutCourse.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Add at least one about course block.",
      });
    }

    if (modules.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Add at least one module.",
      });
    }

    const relationError = await validateCategoryLinks(
      categoryId,
      subcategoryId || null
    );
    if (relationError) {
      return res.status(400).json({ success: false, message: relationError });
    }

    const exists = await CourseDetail.findOne({ slug });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Course detail with same slug already exists.",
      });
    }

    const created = await CourseDetail.create({
      title,
      slug,
      description,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      metaKeywords,
      canonicalUrl: canonicalUrl || undefined,
      categoryId,
      subcategoryId: subcategoryId || null,
      brochureUrl: brochureFile
        ? toPublicUrl(brochureFile.path)
        : brochureUrl || undefined,
      duration,
      aboutCourse,
      modules,
      conclusionTitle: conclusionTitle || undefined,
      conclusionContent: conclusionContent || undefined,
      isActive,
    });

    const item = await CourseDetail.findById(created.id).populate(
      detailPopulateQuery()
    );

    return res.status(201).json({
      success: true,
      message: "Course detail created successfully.",
      data: item,
    });
  } catch (err) {
    console.error("createCourseDetail error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const adminListCourseDetails = async (req: Request, res: Response) => {
  try {
    const categoryId = String(req.query.categoryId || "").trim();
    const subcategoryId = String(req.query.subcategoryId || "").trim();
    const isActiveRaw = String(req.query.isActive || "").trim();

    const filter: Record<string, unknown> = {};

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.categoryId = categoryId;
    }

    if (subcategoryId && mongoose.Types.ObjectId.isValid(subcategoryId)) {
      filter.subcategoryId = subcategoryId;
    }

    if (isActiveRaw === "true") filter.isActive = true;
    if (isActiveRaw === "false") filter.isActive = false;

    const items = await CourseDetail.find(filter)
      .populate(detailPopulateQuery())
      .sort({ updatedAt: -1, createdAt: -1 });

    return res.json({
      success: true,
      message: "OK",
      data: items,
    });
  } catch (err) {
    console.error("adminListCourseDetails error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const publicListCourseDetails = async (req: Request, res: Response) => {
  try {
    const categoryId = String(req.query.categoryId || "").trim();
    const subcategoryId = String(req.query.subcategoryId || "").trim();

    const filter: Record<string, unknown> = { isActive: true };

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      filter.categoryId = categoryId;
    }

    if (subcategoryId && mongoose.Types.ObjectId.isValid(subcategoryId)) {
      filter.subcategoryId = subcategoryId;
    }

    const items = await CourseDetail.find(filter)
      .select(
        "title slug description metaTitle metaDescription metaKeywords canonicalUrl categoryId subcategoryId brochureUrl duration updatedAt"
      )
      .populate(detailPopulateQuery())
      .sort({ updatedAt: -1, createdAt: -1 });

    return res.json({
      success: true,
      message: "OK",
      data: items,
    });
  } catch (err) {
    console.error("publicListCourseDetails error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const getCourseDetailBySlug = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug || "").trim().toLowerCase();

    const item = await CourseDetail.findOne({ slug, isActive: true }).populate(
      detailPopulateQuery()
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Course detail not found.",
      });
    }

    return res.json({
      success: true,
      message: "OK",
      data: item,
    });
  } catch (err) {
    console.error("getCourseDetailBySlug error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const updateCourseDetail = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course detail id.",
      });
    }

    const current = await CourseDetail.findById(id);
    if (!current) {
      return res.status(404).json({
        success: false,
        message: "Course detail not found.",
      });
    }

    const title =
      req.body.title !== undefined ? String(req.body.title || "").trim() : undefined;
    const description =
      req.body.description !== undefined
        ? String(req.body.description || "").trim()
        : undefined;
    const duration =
      req.body.duration !== undefined
        ? String(req.body.duration || "").trim()
        : undefined;
    const metaTitle =
      req.body.metaTitle !== undefined
        ? String(req.body.metaTitle || "").trim()
        : undefined;
    const metaDescription =
      req.body.metaDescription !== undefined
        ? String(req.body.metaDescription || "").trim()
        : undefined;
    const canonicalUrl =
      req.body.canonicalUrl !== undefined
        ? String(req.body.canonicalUrl || "").trim()
        : undefined;
    const brochureUrl =
      req.body.brochureUrl !== undefined
        ? String(req.body.brochureUrl || "").trim()
        : undefined;
    const conclusionTitle =
      req.body.conclusionTitle !== undefined
        ? String(req.body.conclusionTitle || "").trim()
        : undefined;
    const conclusionContent =
      req.body.conclusionContent !== undefined
        ? String(req.body.conclusionContent || "").trim()
        : undefined;
    const categoryId =
      req.body.categoryId !== undefined
        ? String(req.body.categoryId || "").trim()
        : undefined;
    const subcategoryId =
      req.body.subcategoryId !== undefined
        ? String(req.body.subcategoryId || "").trim()
        : undefined;
    const isActive =
      typeof req.body.isActive === "boolean"
        ? req.body.isActive
        : req.body.isActive !== undefined
          ? String(req.body.isActive || "").trim() !== "false"
          : undefined;
    const brochureFile = req.file;

    const finalCategoryId = categoryId || String(current.categoryId);
    const finalSubcategoryId =
      subcategoryId !== undefined ? subcategoryId : String(current.subcategoryId || "");

    const relationError = await validateCategoryLinks(
      finalCategoryId,
      finalSubcategoryId || null
    );
    if (relationError) {
      return res.status(400).json({ success: false, message: relationError });
    }

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) {
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty.",
        });
      }
      updateData.title = title;
    }

    if (description !== undefined) {
      if (!description) {
        return res.status(400).json({
          success: false,
          message: "Description cannot be empty.",
        });
      }
      updateData.description = description;
    }

    if (duration !== undefined) {
      if (!duration) {
        return res.status(400).json({
          success: false,
          message: "Duration cannot be empty.",
        });
      }
      updateData.duration = duration;
    }

    if (metaTitle !== undefined) updateData.metaTitle = metaTitle || undefined;
    if (metaDescription !== undefined) {
      updateData.metaDescription = metaDescription || undefined;
    }
    if (canonicalUrl !== undefined) updateData.canonicalUrl = canonicalUrl || undefined;
    if (brochureUrl !== undefined) updateData.brochureUrl = brochureUrl || undefined;
    if (conclusionTitle !== undefined) {
      updateData.conclusionTitle = conclusionTitle || undefined;
    }
    if (conclusionContent !== undefined) {
      updateData.conclusionContent = conclusionContent || undefined;
    }
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (subcategoryId !== undefined) updateData.subcategoryId = subcategoryId || null;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (req.body.metaKeywords !== undefined) {
      updateData.metaKeywords = normalizeKeywords(
        parsePossiblyJson(req.body.metaKeywords)
      );
    }

    if (req.body.aboutCourse !== undefined) {
      const aboutCourse = normalizeAboutCourse(
        parsePossiblyJson(req.body.aboutCourse)
      );
      if (aboutCourse.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Add at least one valid about course block.",
        });
      }
      updateData.aboutCourse = aboutCourse;
    }

    if (req.body.modules !== undefined) {
      const modules = normalizeModules(parsePossiblyJson(req.body.modules));
      if (modules.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Add at least one valid module.",
        });
      }
      updateData.modules = modules;
    }

    if (req.body.slug || title) {
      const nextSlug = makeSlug(req.body.slug || title || current.title);
      const existing = await CourseDetail.findOne({
        slug: nextSlug,
        _id: { $ne: id },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Another course detail with same slug already exists.",
        });
      }

      updateData.slug = nextSlug;
    }

    if (brochureFile) {
      updateData.brochureUrl = toPublicUrl(brochureFile.path);
    }

    const updated = await CourseDetail.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate(detailPopulateQuery());

    return res.json({
      success: true,
      message: "Course detail updated successfully.",
      data: updated,
    });
  } catch (err) {
    console.error("updateCourseDetail error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const deleteCourseDetail = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course detail id.",
      });
    }

    const deleted = await CourseDetail.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Course detail not found.",
      });
    }

    return res.json({
      success: true,
      message: "Course detail deleted successfully.",
      data: { id: deleted._id },
    });
  } catch (err) {
    console.error("deleteCourseDetail error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
