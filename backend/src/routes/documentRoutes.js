import express from "express";
import multer from "multer";
import { supabase } from "../config/supabase.js";
import { Document } from "../models/Document.js";
import { Tenant } from "../models/Tenant.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all documents for the logged in tenant
router.get("/", requireAuth, async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ userId: req.user.id });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant record not found" });
    }

    const documents = await Document.find({ tenant: tenant._id }).sort({ createdAt: -1 });
    
    // Generate signed URLs for tenants
    const docsWithSignedUrls = await Promise.all(documents.map(async (doc) => {
      const { data } = await supabase.storage
        .from("tenant-documents")
        .createSignedUrl(doc.storageKey, 3600);
      
      const docObj = doc.toObject();
      if (data?.signedUrl) docObj.url = data.signedUrl;
      return docObj;
    }));

    res.json(docsWithSignedUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get documents for a specific tenant (for landlords) - now generates signed URLs
router.get("/tenant/:tenantId", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can access this" });
    }

    const documents = await Document.find({ tenant: req.params.tenantId }).sort({ createdAt: -1 });
    
    // Generate signed URLs for landlords to ensure they can ALWAYS view/download
    const docsWithSignedUrls = await Promise.all(documents.map(async (doc) => {
      const { data, error } = await supabase.storage
        .from("tenant-documents")
        .createSignedUrl(doc.storageKey, 3600); // 1 hour expiry
      
      const docObj = doc.toObject();
      if (data?.signedUrl) {
        docObj.url = data.signedUrl;
      }
      return docObj;
    }));

    res.json(docsWithSignedUrls);
  } catch (error) {
    console.error("Landlord doc fetch error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Upload a document
router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    const { type, name } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!supabase) {
      return res.status(503).json({ message: "File upload service is not configured" });
    }

    const tenant = await Tenant.findOne({ userId: req.user.id });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant record not found" });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `${tenant._id}/${type}-${Date.now()}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { data, error } = await supabase.storage
      .from("tenant-documents")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("tenant-documents")
      .getPublicUrl(filePath);

    const document = new Document({
      tenant: tenant._id,
      user: req.user.id,
      type,
      name: name || file.originalname,
      url: publicUrl,
      storageKey: filePath,
      status: "pending",
    });

    await document.save();

    res.status(201).json(document);
  } catch (error) {
    console.error("Document upload error details:", {
      message: error.message,
      stack: error.stack,
      supabaseError: error.error // Supabase often puts details here
    });
    res.status(500).json({ message: error.message });
  }
});

// Delete a document
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if user owns the document or is a landlord
    if (document.user.toString() !== req.user.id && req.user.role !== "landlord") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete from Supabase
    if (supabase) {
      const { error } = await supabase.storage
        .from("tenant-documents")
        .remove([document.storageKey]);

      if (error) {
        console.error("Error deleting from Supabase:", error);
      }
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update document status (for landlords)
router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can verify documents" });
    }

    const { status, remarks } = req.body;
    if (!["verified", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
