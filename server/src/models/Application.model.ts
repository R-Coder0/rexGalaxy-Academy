import { Schema, model, Document, Types } from "mongoose";

export interface IApplication extends Document {
  jobId?: Types.ObjectId; // optional for general profile
  jobTitle: string;

  fullName: string;
  phone: string;
  email: string;

  experience?: string;
  location?: string;
  noticePeriod?: string;
  message?: string;

  resumeUrl: string;     // "/uploads/xyz.pdf"
  resumeName: string;    // original filename
  resumeMime: string;
  resumeSize: number;

  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: false },
    jobTitle: { type: String, required: true, trim: true, minlength: 2 },

    fullName: { type: String, required: true, trim: true, minlength: 2 },
    phone: { type: String, required: true, trim: true, minlength: 8, maxlength: 16 },
    email: { type: String, required: true, trim: true, lowercase: true },

    experience: { type: String, trim: true },
    location: { type: String, trim: true },
    noticePeriod: { type: String, trim: true },
    message: { type: String, trim: true },

    resumeUrl: { type: String, required: true },
    resumeName: { type: String, required: true },
    resumeMime: { type: String, required: true },
    resumeSize: { type: Number, required: true },
  },
  { timestamps: true }
);

// indexes for admin filtering
ApplicationSchema.index({ createdAt: -1 });
ApplicationSchema.index({ jobId: 1, createdAt: -1 });
ApplicationSchema.index({ email: 1, createdAt: -1 });

export const Application = model<IApplication>("Application", ApplicationSchema);
