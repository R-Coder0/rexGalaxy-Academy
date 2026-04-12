import { Schema, model, Document } from "mongoose";

export type JobType = "full-time" | "part-time" | "internship";

export interface IJob extends Document {
  title: string;
  description: string;
  type: JobType;
  location: string;
  experienceMin: number;
  experienceMax: number;
  salaryLabel: string;
  responsibilities: string[];
  qualificationAndExperience: string;
  requirements: string[];
  goodToHave: string[];

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },

    type: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "internship"],
    },

    location: { type: String, required: true, trim: true, maxlength: 120 },

    experienceMin: { type: Number, required: true, min: 0, max: 50, default: 0 },
    experienceMax: { type: Number, required: true, min: 0, max: 50 },

    // Salary is stored as string so it can be "Not disclosed" or numeric range text.
    salaryLabel: { type: String, required: true, trim: true, maxlength: 80 },

    responsibilities: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.every((s) => typeof s === "string" && s.trim().length > 2),
        message: "Responsibilities items must be valid strings.",
      },
    },
    qualificationAndExperience: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },


    requirements: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.every((s) => typeof s === "string" && s.trim().length > 2),
        message: "Requirements items must be valid strings.",
      },
    },

    goodToHave: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.every((s) => typeof s === "string" && s.trim().length > 2),
        message: "Good-to-have items must be valid strings.",
      },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// logical validation
JobSchema.pre("validate", function () {
  if (this.experienceMax < this.experienceMin) {
    this.invalidate("experienceMax", "experienceMax cannot be less than experienceMin.");
  }
});

export const Job = model<IJob>("Job", JobSchema);
