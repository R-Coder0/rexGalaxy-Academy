import mongoose from "mongoose";

export interface ICourseSubcategory extends mongoose.Document {
  categoryId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSubcategorySchema = new mongoose.Schema<ICourseSubcategory>(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseCategory",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 140,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

CourseSubcategorySchema.index({ categoryId: 1, order: 1 });
CourseSubcategorySchema.index({ categoryId: 1, slug: 1 }, { unique: true });
CourseSubcategorySchema.index({ isActive: 1 });

export const CourseSubcategory = mongoose.model<ICourseSubcategory>(
  "CourseSubcategory",
  CourseSubcategorySchema
);