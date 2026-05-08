import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    units: { type: Number, default: 1 },
    rent: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    
    // Identification & Location
    landmark: { type: String, trim: true },
    pincode: { type: String, trim: true },
    propertyType: { type: String, trim: true }, // e.g., 2BHK, Studio
    floorNumber: { type: Number },
    totalFloors: { type: Number },
    hasLift: { type: Boolean, default: false },
    
    // Financial Details
    securityDeposit: { type: Number, min: 0 },
    maintenanceCharges: { type: Number, default: 0 },
    maintenancePaidBy: { type: String, enum: ["owner", "tenant"], default: "tenant" },
    noticePeriod: { type: Number }, // in months
    lockInPeriod: { type: Number }, // in months
    
    // Utilities & Amenities
    electricityMeterType: { type: String, enum: ["prepaid", "postpaid"], default: "postpaid" },
    waterSupply: { type: String }, // e.g., 24/7 Municipal
    powerBackup: { type: String }, // e.g., Inverter for fans/lights
    parkingDetails: { type: String }, // slot number, covered/open
    
    // Furnishing Status
    furnishingStatus: { type: String, enum: ["unfurnished", "semi-furnished", "fully-furnished"], default: "unfurnished" },
    furnitureInventory: { type: String }, // checklist text
    
    // House Rules
    preferredTenant: { type: String, enum: ["bachelors", "families", "no-preference"], default: "no-preference" },
    foodPolicy: { type: String }, // veg only, etc.
    petPolicy: { type: String }, // allowed/not allowed
    guestPolicy: { type: String },
    
    // Legal & Ownership
    ownershipProofType: { type: String }, // Tax receipt, Sale Deed
    societyNocRequired: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Property = mongoose.model("Property", propertySchema);

