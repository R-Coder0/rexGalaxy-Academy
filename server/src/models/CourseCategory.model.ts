import mongoose from "mongoose";

export interface ICourseCategory extends mongoose.Document {
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseCategorySchema = new mongoose.Schema<ICourseCategory>(
  {
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
      unique: true,
      maxlength: 140,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    icon: {
      type: String,
      trim: true,
      maxlength: 300,
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

CourseCategorySchema.index({ title: 1 });
CourseCategorySchema.index({ isActive: 1, order: 1 });

export const CourseCategory = mongoose.model<ICourseCategory>(
  "CourseCategory",
  CourseCategorySchema
);
