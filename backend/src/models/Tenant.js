import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    leaseStart: { type: Date, required: true },
    leaseEnd: { type: Date, required: true },
    rentAmount: { type: Number, required: true, min: 0 },
    
    // Identity & KYC
    aadhaarNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    permanentAddress: { type: String, trim: true },
    
    // Employment & Income
    employmentType: { type: String, enum: ["salaried", "self-employed", "student", "other"], default: "salaried" },
    companyName: { type: String, trim: true },
    officeAddress: { type: String, trim: true },
    officialEmail: { type: String, trim: true, lowercase: true },
    
    // Occupancy Details
    numOccupants: { type: Number, default: 1 },
    occupantsDetails: { type: String, trim: true }, // Names and relationship
    maritalStatus: { type: String, trim: true },
    foodPreference: { type: String, enum: ["veg", "non-veg", "any"], default: "any" },
    vehicleDetails: { type: String, trim: true }, // Two-wheeler / Four-wheeler info
    
    // References
    emergencyContact: { type: String, trim: true },
    localContact: { type: String, trim: true },
    
    // Legal & Policy
    policeVerificationConsent: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },
    drinkingAllowed: { type: Boolean, default: false },
    petsAllowed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Tenant = mongoose.model("Tenant", tenantSchema);
