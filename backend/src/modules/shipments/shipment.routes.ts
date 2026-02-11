import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { checkPermission } from "../../middleware/permission.middleware";
import * as controller from "./shipment.controller";

const router = Router();

router.post(
  "/shipments",
  authenticate,
  checkPermission("SHIPMENTS", "add"),
  controller.createShipment
);

router.get(
  "/shipments",
  authenticate,
  checkPermission("SHIPMENTS", "view"),
  controller.getShipments
);

export default router;
