import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true, index: true },
    landlordId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ["UPI", "Bank Transfer", "Cash", "Other"], default: "UPI" },
    transactionId: { type: String, trim: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    notes: { type: String, trim: true },
    proofUrl: { type: String } // Optional: image/document URL
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Payment = mongoose.model("Payment", paymentSchema);
