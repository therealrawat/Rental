import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["landlord", "tenant"], default: "landlord", required: true },
    avatarUrl: { type: String, trim: true }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const User = mongoose.model("User", userSchema);
