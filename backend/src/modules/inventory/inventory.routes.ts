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

router.get(
  "/inventory/items",
  authenticate,
  checkPermission("INVENTORY", "view"),
  controller.getInventoryItems
);

router.post(
  "/inventory/items",
  authenticate,
  checkPermission("INVENTORY", "add"),
  controller.createInventoryItem
);

router.put(
  "/inventory/items/:id",
  authenticate,
  checkPermission("INVENTORY", "edit"),
  controller.updateInventoryItem
);

router.delete(
  "/inventory/items/:id",
  authenticate,
  checkPermission("INVENTORY", "delete"),
  controller.deleteInventoryItem
);

export default router;