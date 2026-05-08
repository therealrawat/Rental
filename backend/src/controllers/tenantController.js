import bcrypt from "bcryptjs";
import { Property } from "../models/Property.js";
import { Tenant } from "../models/Tenant.js";
import { User } from "../models/User.js";

export async function listTenants(req, res, next) {
  try {
    if (req.user.role === "tenant") {
      // Find by userId OR email (fallback) to ensure the tenant sees their lease
      const tenants = await Tenant.find({ 
        $or: [
          { userId: req.user.id },
          { email: req.user.email }
        ]
      })
      .populate({
        path: "propertyId",
        select: "name address userId",
        populate: { path: "userId", select: "name email" }
      });
      
      // Auto-link userId if it was found by email but link was missing
      for (const t of tenants) {
        if (!t.userId) {
          t.userId = req.user.id;
          await t.save();
        }
      }

      return res.json(tenants);
    }

    const properties = await Property.find({ userId: req.user.id }).select("_id");
    const propertyIds = properties.map((p) => p._id);

    const tenants = await Tenant.find({ propertyId: { $in: propertyIds } })
      .sort({ createdAt: -1 })
      .populate("propertyId", "name address");

    return res.json(tenants);
  } catch (err) {
    return next(err);
  }
}

export async function joinLease(req, res, next) {
  try {
    return res.status(403).json({ message: "Direct joining is disabled. Only landlords can add tenants." });
  } catch (err) {
    return next(err);
  }
}

export async function createTenant(req, res, next) {
  try {
    if (req.user.role === "tenant") {
      return res.status(403).json({ message: "Tenants cannot create tenant records" });
    }

    const { 
      propertyId, name, email, phone, leaseStart, leaseEnd, rentAmount,
      aadhaarNumber, panNumber, permanentAddress,
      employmentType, companyName, officeAddress, officialEmail,
      numOccupants, occupantsDetails, maritalStatus, foodPreference, vehicleDetails,
      emergencyContact, localContact,
      policeVerificationConsent, smokingAllowed, drinkingAllowed, petsAllowed
    } = req.body;

    const property = await Property.findOne({ _id: propertyId, userId: req.user.id });
    if (!property) return res.status(404).json({ message: "Property not found" });

    const normalizedEmail = email.trim().toLowerCase();
    
    // 1. Check if user already exists
    let tenantUser = await User.findOne({ email: normalizedEmail });

    if (!tenantUser) {
      // 2. Create a new user for the tenant
      const hashedPassword = await bcrypt.hash("pass123", 10);
      tenantUser = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "tenant"
      });
    }

    // 3. Create the tenant record linked to the user
    const tenant = await Tenant.create({
      propertyId,
      name,
      email: normalizedEmail,
      phone,
      leaseStart,
      leaseEnd,
      rentAmount,
      userId: tenantUser._id,
      aadhaarNumber, panNumber, permanentAddress,
      employmentType, companyName, officeAddress, officialEmail,
      numOccupants, occupantsDetails, maritalStatus, foodPreference, vehicleDetails,
      emergencyContact, localContact,
      policeVerificationConsent, smokingAllowed, drinkingAllowed, petsAllowed
    });

    return res.status(201).json({
      message: "Tenant added and user account created successfully",
      tenant,
      tempPassword: "pass123"
    });
  } catch (err) {
    return next(err);
  }
}

export async function getTenant(req, res, next) {
  try {
    const tenant = await Tenant.findById(req.params.id)
      .populate({
        path: "propertyId",
        select: "name address userId",
        populate: { path: "userId", select: "name email" }
      });
    
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    const isLandlord = String(tenant.propertyId.userId._id || tenant.propertyId.userId) === String(req.user.id);
    const isSelf = String(tenant.userId) === String(req.user.id) || tenant.email === req.user.email;

    if (!isLandlord && !isSelf) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    return res.json(tenant);
  } catch (err) {
    return next(err);
  }
}

export async function updateTenant(req, res, next) {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    const property = await Property.findById(tenant.propertyId);
    const isLandlord = String(property.userId) === String(req.user.id);
    const isSelf = String(tenant.userId) === String(req.user.id) || tenant.email === req.user.email;

    if (!isLandlord && !isSelf) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { 
      name, email, phone, leaseStart, leaseEnd, rentAmount,
      aadhaarNumber, panNumber, permanentAddress,
      employmentType, companyName, officeAddress, officialEmail,
      numOccupants, occupantsDetails, maritalStatus, foodPreference, vehicleDetails,
      emergencyContact, localContact,
      policeVerificationConsent, smokingAllowed, drinkingAllowed, petsAllowed
    } = req.body;
    
    tenant.name = name ?? tenant.name;
    tenant.phone = phone ?? tenant.phone;
    
    // Update profile info (allowed for both or restricted depending on business logic, 
    // here we let both update non-sensitive info)
    tenant.aadhaarNumber = aadhaarNumber ?? tenant.aadhaarNumber;
    tenant.panNumber = panNumber ?? tenant.panNumber;
    tenant.permanentAddress = permanentAddress ?? tenant.permanentAddress;
    tenant.employmentType = employmentType ?? tenant.employmentType;
    tenant.companyName = companyName ?? tenant.companyName;
    tenant.officeAddress = officeAddress ?? tenant.officeAddress;
    tenant.officialEmail = officialEmail ?? tenant.officialEmail;
    tenant.numOccupants = numOccupants ?? tenant.numOccupants;
    tenant.occupantsDetails = occupantsDetails ?? tenant.occupantsDetails;
    tenant.maritalStatus = maritalStatus ?? tenant.maritalStatus;
    tenant.foodPreference = foodPreference ?? tenant.foodPreference;
    tenant.vehicleDetails = vehicleDetails ?? tenant.vehicleDetails;
    tenant.emergencyContact = emergencyContact ?? tenant.emergencyContact;
    tenant.localContact = localContact ?? tenant.localContact;
    tenant.policeVerificationConsent = policeVerificationConsent ?? tenant.policeVerificationConsent;
    tenant.smokingAllowed = smokingAllowed ?? tenant.smokingAllowed;
    tenant.drinkingAllowed = drinkingAllowed ?? tenant.drinkingAllowed;
    tenant.petsAllowed = petsAllowed ?? tenant.petsAllowed;
    
    if (isLandlord) {
      tenant.email = email ?? tenant.email;
      tenant.leaseStart = leaseStart ?? tenant.leaseStart;
      tenant.leaseEnd = leaseEnd ?? tenant.leaseEnd;
      tenant.rentAmount = rentAmount ?? tenant.rentAmount;
    }

    await tenant.save();
    return res.json(tenant);
  } catch (err) {
    return next(err);
  }
}

export async function deleteTenant(req, res, next) {
  try {
    if (req.user.role === "tenant") {
      return res.status(403).json({ message: "Tenants cannot delete records" });
    }

    const tenant = await Tenant.findById(req.params.id).populate("propertyId", "userId");
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    if (String(tenant.propertyId.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await Tenant.deleteOne({ _id: tenant._id });
    return res.json({ message: "Tenant deleted" });
  } catch (err) {
    return next(err);
  }
}
