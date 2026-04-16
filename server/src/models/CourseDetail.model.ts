import mongoose from "mongoose";

type RichContentBlock = {
  title: string;
  content: string;
  order: number;
};

type CourseModule = {
  moduleNumber: number;
  title: string;
  content: string;
};

export interface ICourseDetail extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  canonicalUrl?: string;
  categoryId: mongoose.Types.ObjectId;
  subcategoryId?: mongoose.Types.ObjectId | null;
  brochureUrl?: string;
  duration: string;
  aboutCourse: RichContentBlock[];
  modules: CourseModule[];
  conclusionTitle?: string;
  conclusionContent?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RichContentBlockSchema = new mongoose.Schema<RichContentBlock>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const CourseModuleSchema = new mongoose.Schema<CourseModule>(
  {
    moduleNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const CourseDetailSchema = new mongoose.Schema<ICourseDetail>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 180,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 180,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 320,
    },
    metaKeywords: {
      type: [String],
      default: [],
    },
    canonicalUrl: {
      type: String,
      trim: true,
      maxlength: 400,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseCategory",
      required: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseSubcategory",
      default: null,
    },
    brochureUrl: {
      type: String,
      trim: true,
      maxlength: 400,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    aboutCourse: {
      type: [RichContentBlockSchema],
      default: [],
    },
    modules: {
      type: [CourseModuleSchema],
      default: [],
    },
    conclusionTitle: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    conclusionContent: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

CourseDetailSchema.pre("validate", function autoNumberModules() {
  if (Array.isArray(this.modules)) {
    this.modules = this.modules.map((module, index) => ({
      ...module,
      moduleNumber: index + 1,
    }));
  }

  if (Array.isArray(this.aboutCourse)) {
    this.aboutCourse = this.aboutCourse.map((block, index) => ({
      ...block,
      order:
        typeof block.order === "number" && Number.isFinite(block.order)
          ? block.order
          : index,
    }));
  }
});

CourseDetailSchema.index({ categoryId: 1, isActive: 1 });
CourseDetailSchema.index({ subcategoryId: 1, isActive: 1 });
CourseDetailSchema.index({ title: 1 });

export const CourseDetail = mongoose.model<ICourseDetail>(
  "CourseDetail",
  CourseDetailSchema
);
