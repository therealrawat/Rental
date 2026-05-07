import { Property } from "../models/Property.js";
import { Tenant } from "../models/Tenant.js";
import { User } from "../models/User.js";

export async function listTenants(req, res, next) {
  try {
    if (req.user.role === "tenant") {
      // Find by userId OR email to handle cases where landlord added by email before tenant registered
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

      // Proactively link the userId if it's missing but email matches
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
    const { propertyId, phone, leaseStart, leaseEnd } = req.body;
    
    if (req.user.role !== "tenant") {
      return res.status(403).json({ message: "Only tenants can join leases" });
    }

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Check if tenant already has an active lease for this user/email
    const existing = await Tenant.findOne({ 
      $or: [
        { userId: req.user.id },
        { email: req.user.email }
      ]
    });

    if (existing) {
      existing.propertyId = propertyId;
      existing.userId = req.user.id;
      existing.phone = phone || existing.phone;
      existing.leaseStart = leaseStart || existing.leaseStart;
      existing.leaseEnd = leaseEnd || existing.leaseEnd;
      await existing.save();
      return res.json(existing);
    }

    const tenant = await Tenant.create({
      propertyId,
      userId: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: phone || "0000000000",
      leaseStart: leaseStart || new Date(),
      leaseEnd: leaseEnd || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      rentAmount: property.rent // Default to property rent
    });

    return res.status(201).json(tenant);
  } catch (err) {
    return next(err);
  }
}

export async function createTenant(req, res, next) {
  try {
    if (req.user.role === "tenant") {
      return res.status(403).json({ message: "Tenants cannot create tenant records" });
    }

    const { propertyId, name, email, phone, leaseStart, leaseEnd, rentAmount } = req.body;

    const property = await Property.findOne({ _id: propertyId, userId: req.user.id });
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Link by email (case-insensitive and trimmed)
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail, role: "tenant" });

    const tenant = await Tenant.create({
      propertyId,
      name,
      email: normalizedEmail,
      phone,
      leaseStart,
      leaseEnd,
      rentAmount,
      userId: existingUser ? existingUser._id : undefined
    });

    return res.status(201).json(tenant);
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

    const { name, email, phone, leaseStart, leaseEnd, rentAmount } = req.body;
    
    tenant.name = name ?? tenant.name;
    tenant.phone = phone ?? tenant.phone;
    
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
