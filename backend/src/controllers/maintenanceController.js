import { Maintenance } from "../models/Maintenance.js";
import { Tenant } from "../models/Tenant.js";
import { Property } from "../models/Property.js";

// Tenant submits a new request
export async function createRequest(req, res, next) {
  try {
    if (req.user.role !== "tenant") {
      return res.status(403).json({ message: "Only tenants can submit maintenance requests" });
    }

    const { title, description, category, priority } = req.body;

    // Find tenant's active lease
    const tenant = await Tenant.findOne({ 
      userId: req.user.id, 
      isDeleted: { $ne: true } 
    }).populate("propertyId", "userId");

    if (!tenant) {
      return res.status(404).json({ message: "No active lease found for this tenant" });
    }

    const request = await Maintenance.create({
      tenantId: tenant._id,
      propertyId: tenant.propertyId._id,
      landlordId: tenant.propertyId.userId,
      title,
      description,
      category,
      priority
    });

    return res.status(201).json(request);
  } catch (err) {
    return next(err);
  }
}

// Both tenant (own) and landlord (their properties) can list
export async function listRequests(req, res, next) {
  try {
    let query;

    if (req.user.role === "tenant") {
      const tenant = await Tenant.findOne({ userId: req.user.id, isDeleted: { $ne: true } });
      if (!tenant) return res.json([]);
      query = { tenantId: tenant._id };
    } else {
      // Landlord: get all requests for their properties
      const properties = await Property.find({ userId: req.user.id }).select("_id");
      const propertyIds = properties.map(p => p._id);
      query = { propertyId: { $in: propertyIds } };
    }

    const requests = await Maintenance.find(query)
      .sort({ createdAt: -1 })
      .populate("tenantId", "name phone")
      .populate("propertyId", "name address");

    return res.json(requests);
  } catch (err) {
    return next(err);
  }
}

// Landlord updates status/remarks
export async function updateRequest(req, res, next) {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can update request status" });
    }

    const { status, landlordRemarks } = req.body;

    const request = await Maintenance.findById(req.params.id).populate("propertyId", "userId");
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (String(request.propertyId.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (status) request.status = status;
    if (landlordRemarks !== undefined) request.landlordRemarks = landlordRemarks;
    if (status === "Resolved" || status === "Closed") {
      request.resolvedAt = new Date();
    }

    await request.save();
    return res.json(request);
  } catch (err) {
    return next(err);
  }
}

// Delete a request (tenant can delete own, landlord can delete any in their property)
export async function deleteRequest(req, res, next) {
  try {
    const request = await Maintenance.findById(req.params.id).populate("propertyId", "userId");
    if (!request) return res.status(404).json({ message: "Request not found" });

    const isLandlord = req.user.role === "landlord" && String(request.propertyId.userId) === String(req.user.id);
    const isTenantOwner = req.user.role === "tenant" && String(request.tenantId) !== undefined;

    if (!isLandlord && !isTenantOwner) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Maintenance.deleteOne({ _id: request._id });
    return res.json({ message: "Request deleted" });
  } catch (err) {
    return next(err);
  }
}
