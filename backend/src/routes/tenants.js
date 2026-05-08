import { Router } from "express";
import { body, param } from "express-validator";
import {
  createTenant,
  deleteTenant,
  getTenant,
  listTenants,
  updateTenant,
  joinLease,
  permanentlyDeleteTenant
} from "../controllers/tenantController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../validators/validate.js";

const router = Router();

router.use(requireAuth);

router.get("/", listTenants);

router.post("/join", joinLease);

router.post(
  "/",
  [
    body("propertyId").isString().notEmpty(),
    body("name").isString().trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("phone").isString().trim().notEmpty(),
    body("leaseStart").isISO8601().toDate(),
    body("leaseEnd").isISO8601().toDate(),
    body("rentAmount").isFloat({ min: 0 }).toFloat()
  ],
  validate,
  createTenant
);

router.get("/:id", [param("id").isString().notEmpty()], validate, getTenant);

router.put(
  "/:id",
  [
    param("id").isString().notEmpty(),
    body("name").optional().isString().trim().notEmpty(),
    body("email").optional().isEmail().normalizeEmail(),
    body("phone").optional().isString().trim().notEmpty(),
    body("leaseStart").optional().isISO8601().toDate(),
    body("leaseEnd").optional().isISO8601().toDate(),
    body("rentAmount").optional().isFloat({ min: 0 }).toFloat()
  ],
  validate,
  updateTenant
);

router.delete("/:id", [param("id").isString().notEmpty()], validate, deleteTenant);
router.delete("/:id/permanent", [param("id").isString().notEmpty()], validate, permanentlyDeleteTenant);

export default router;
