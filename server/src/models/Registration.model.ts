import mongoose from "mongoose";

export interface IRegistration extends mongoose.Document {
  registrationCode: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  address: string;
  city: string;
  country: string;
  zipcode: string;
  status: "new" | "contacted" | "enrolled" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new mongoose.Schema<IRegistration>(
  {
    registrationCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 40,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 20,
    },
    course: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    zipcode: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "enrolled", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

RegistrationSchema.index({ createdAt: -1 });
RegistrationSchema.index({ email: 1 });
RegistrationSchema.index({ phone: 1 });
RegistrationSchema.index({ course: 1 });

export const Registration = mongoose.model<IRegistration>(
  "Registration",
  RegistrationSchema
);
