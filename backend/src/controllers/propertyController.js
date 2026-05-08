import { Property } from "../models/Property.js";
import { User } from "../models/User.js";

export async function listProperties(req, res, next) {
  try {
    const properties = await Property.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(properties);
  } catch (err) {
    return next(err);
  }
}

export async function searchProperties(req, res, next) {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    // Find users (landlords) by email if query looks like email
    let landlordIds = [];
    if (query.includes("@")) {
      const landlords = await User.find({ email: new RegExp(query, "i"), role: "landlord" }).select("_id");
      landlordIds = landlords.map(l => l._id);
    }

    const properties = await Property.find({
      $or: [
        { name: new RegExp(query, "i") },
        { userId: { $in: landlordIds } }
      ]
    })
    .limit(10)
    .populate("userId", "name email");

    return res.json(properties);
  } catch (err) {
    return next(err);
  }
}

export async function createProperty(req, res, next) {
  try {
    const property = await Property.create({
      ...req.body,
      userId: req.user.id
    });
    return res.status(201).json(property);
  } catch (err) {
    return next(err);
  }
}

export async function getProperty(req, res, next) {
  try {
    const property = await Property.findOne({ _id: req.params.id, userId: req.user.id });
    if (!property) return res.status(404).json({ message: "Property not found" });
    return res.json(property);
  } catch (err) {
    return next(err);
  }
}

export async function updateProperty(req, res, next) {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: "Property not found" });
    return res.json(property);
  } catch (err) {
    return next(err);
  }
}

export async function deleteProperty(req, res, next) {
  try {
    const deleted = await Property.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Property not found" });
    return res.json({ message: "Property deleted" });
  } catch (err) {
    return next(err);
  }
}
