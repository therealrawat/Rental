import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    units: { type: Number, required: true, min: 0 },
    rent: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Property = mongoose.model("Property", propertySchema);

