import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { createPayment, listPayments, approvePayment } from "../controllers/paymentController.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createPayment);
router.get("/", listPayments);
router.patch("/:id/approve", approvePayment);

export default router;
