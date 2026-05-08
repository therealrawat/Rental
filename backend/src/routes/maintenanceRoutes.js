import { Router } from "express";
import { body, param } from "express-validator";
import { createRequest, listRequests, updateRequest, deleteRequest } from "../controllers/maintenanceController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../validators/validate.js";

const router = Router();
router.use(requireAuth);

router.get("/", listRequests);

router.post(
  "/",
  [
    body("title").isString().trim().notEmpty().withMessage("Title is required"),
    body("description").isString().trim().notEmpty().withMessage("Description is required"),
    body("category").optional().isString(),
    body("priority").optional().isIn(["Low", "Medium", "High"])
  ],
  validate,
  createRequest
);

router.patch(
  "/:id",
  [
    param("id").isString().notEmpty(),
    body("status").optional().isIn(["Submitted", "Acknowledged", "In Progress", "Resolved", "Closed"]),
    body("landlordRemarks").optional().isString()
  ],
  validate,
  updateRequest
);

router.delete("/:id", [param("id").isString().notEmpty()], validate, deleteRequest);

export default router;
