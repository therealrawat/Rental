import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["payment_received", "payment_approved", "lease_update", "maintenance", "system"], default: "system" },
    isRead: { type: Boolean, default: false },
    link: { type: String } // Optional link to direct user
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Notification = mongoose.model("Notification", notificationSchema);
