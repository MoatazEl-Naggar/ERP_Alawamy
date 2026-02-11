import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { checkPermission } from "../../middleware/permission.middleware";
import * as controller from "./inventory.controller";

const router = Router();

router.get(
  "/inventory/report",
  authenticate,
  checkPermission("INVENTORY", "view"),
  controller.inventoryReport
);

export default router;
