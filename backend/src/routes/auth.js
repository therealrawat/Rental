import { Router } from "express";
import { body } from "express-validator";
import { login, register, updateProfile, updatePassword, updateAvatar } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
import { validate } from "../validators/validate.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").isString().trim().notEmpty().withMessage("name is required"),
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 6 }).withMessage("password must be at least 6 chars")
  ],
  validate,
  register
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").isString().notEmpty()],
  validate,
  login
);

router.put(
  "/profile",
  requireAuth,
  [body("name").isString().trim().notEmpty().withMessage("name is required")],
  validate,
  updateProfile
);

router.put(
  "/password",
  requireAuth,
  [
    body("currentPassword").isString().notEmpty(),
    body("newPassword").isString().isLength({ min: 6 }).withMessage("new password must be at least 6 chars")
  ],
  validate,
  updatePassword
);

router.post("/avatar", requireAuth, upload.single("avatar"), updateAvatar);

export default router;
