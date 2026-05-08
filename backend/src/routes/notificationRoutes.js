import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { listNotifications, markAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listNotifications);
router.post("/read", markAsRead);

export default router;
