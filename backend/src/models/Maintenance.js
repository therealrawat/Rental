import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true, index: true },
    landlordId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { 
      type: String, 
      enum: ["Plumbing", "Electrical", "HVAC", "Appliance", "Structural", "Pest Control", "Other"], 
      default: "Other" 
    },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { 
      type: String, 
      enum: ["Submitted", "Acknowledged", "In Progress", "Resolved", "Closed"], 
      default: "Submitted" 
    },
    landlordRemarks: { type: String, trim: true },
    resolvedAt: { type: Date }
  },
  { timestamps: true }
);

export const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
