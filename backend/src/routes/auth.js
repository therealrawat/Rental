import { Router } from "express";
import { body } from "express-validator";
import { login, register } from "../controllers/authController.js";
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

export default router;

