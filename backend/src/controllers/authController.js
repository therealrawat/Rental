import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Tenant } from "../models/Tenant.js";
import { signAccessToken } from "../utils/jwt.js";
import { supabase } from "../config/supabase.js";

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: normalizedEmail, password: hashed, role: role || "landlord" });

    // If tenant, try to link to any existing tenant records that might have been created by email before registration
    if (user.role === "tenant") {
      await Tenant.updateMany({ email: normalizedEmail }, { userId: user._id });
    }

    const token = signAccessToken(user);
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl, createdAt: user.createdAt }
    });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signAccessToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl, createdAt: user.createdAt }
    });
  } catch (err) {
    return next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    await user.save();

    // If tenant, also update their record
    if (user.role === "tenant") {
      await Tenant.updateMany({ userId: user._id }, { name: user.name });
    }

    return res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl, createdAt: user.createdAt }
    });
  } catch (err) {
    return next(err);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ message: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return next(err);
  }
}

export async function updateAvatar(req, res, next) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });
    if (!supabase) return res.status(503).json({ message: "Storage not configured" });

    const fileExt = file.originalname.split(".").pop();
    const fileName = `avatars/${req.user.id}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("tenant-documents") // Reusing the same bucket for simplicity, or create an 'avatars' bucket
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) throw error;

    const { data: signedData } = await supabase.storage
      .from("tenant-documents")
      .createSignedUrl(fileName, 31536000); // 1 year expiry for avatar

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl: signedData?.signedUrl || publicUrl },
      { new: true }
    );

    return res.json({
      avatarUrl: user.avatarUrl,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl, createdAt: user.createdAt }
    });
  } catch (err) {
    return next(err);
  }
}
