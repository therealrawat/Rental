import { Property } from "../models/Property.js";
import { Tenant } from "../models/Tenant.js";

export async function listTenants(req, res, next) {
  try {
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

export async function createTenant(req, res, next) {
  try {
    const { propertyId, name, email, phone, leaseStart, leaseEnd, rentAmount } = req.body;

    const property = await Property.findOne({ _id: propertyId, userId: req.user.id });
    if (!property) return res.status(404).json({ message: "Property not found" });

    const tenant = await Tenant.create({
      propertyId,
      name,
      email,
      phone,
      leaseStart,
      leaseEnd,
      rentAmount
    });

    return res.status(201).json(tenant);
  } catch (err) {
    return next(err);
  }
}

export async function getTenant(req, res, next) {
  try {
    const tenant = await Tenant.findById(req.params.id).populate("propertyId", "name address userId");
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    if (String(tenant.propertyId.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.json(tenant);
  } catch (err) {
    return next(err);
  }
}

export async function updateTenant(req, res, next) {
  try {
    const tenant = await Tenant.findById(req.params.id).populate("propertyId", "userId");
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    if (String(tenant.propertyId.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, email, phone, leaseStart, leaseEnd, rentAmount } = req.body;
    tenant.name = name ?? tenant.name;
    tenant.email = email ?? tenant.email;
    tenant.phone = phone ?? tenant.phone;
    tenant.leaseStart = leaseStart ?? tenant.leaseStart;
    tenant.leaseEnd = leaseEnd ?? tenant.leaseEnd;
    tenant.rentAmount = rentAmount ?? tenant.rentAmount;
    await tenant.save();

    return res.json(tenant);
  } catch (err) {
    return next(err);
  }
}

export async function deleteTenant(req, res, next) {
  try {
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

