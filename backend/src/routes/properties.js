import { Router } from "express";
import { body, param } from "express-validator";
import {
  createProperty,
  deleteProperty,
  getProperty,
  listProperties,
  updateProperty
} from "../controllers/propertyController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../validators/validate.js";

const router = Router();

router.use(requireAuth);

router.get("/", listProperties);

router.post(
  "/",
  [
    body("name").isString().trim().notEmpty(),
    body("address").isString().trim().notEmpty(),
    body("units").isInt({ min: 0 }).toInt(),
    body("rent").isFloat({ min: 0 }).toFloat(),
    body("status").optional().isIn(["active", "inactive"])
  ],
  validate,
  createProperty
);

router.get("/:id", [param("id").isString().notEmpty()], validate, getProperty);

router.put(
  "/:id",
  [
    param("id").isString().notEmpty(),
    body("name").isString().trim().notEmpty(),
    body("address").isString().trim().notEmpty(),
    body("units").isInt({ min: 0 }).toInt(),
    body("rent").isFloat({ min: 0 }).toFloat(),
    body("status").optional().isIn(["active", "inactive"])
  ],
  validate,
  updateProperty
);

router.delete("/:id", [param("id").isString().notEmpty()], validate, deleteProperty);

export default router;

