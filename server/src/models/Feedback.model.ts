import mongoose from "mongoose";

export interface IFeedback extends mongoose.Document {
  fullName: string;
  email: string;
  organization: string; // Feedback / Suggestion (short)
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new mongoose.Schema<IFeedback>(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    organization: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
message: { type: String, required: true, trim: true, minlength: 1, maxlength: 2000 },

  },
  { timestamps: true }
);

// helpful indexes
FeedbackSchema.index({ createdAt: -1 });
FeedbackSchema.index({ email: 1 });

export const Feedback = mongoose.model<IFeedback>("Feedback", FeedbackSchema);
