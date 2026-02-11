import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { checkPermission } from "../../middleware/permission.middleware";
import * as controller from "./purchase.controller";

const router = Router();

router.post(
  "/purchase-invoices",
  authenticate,
  checkPermission("PURCHASES", "add"),
  controller.createInvoice
);

router.get(
  "/purchase-invoices",
  authenticate,
  checkPermission("PURCHASES", "view"),
  controller.getInvoices
);

export default router;
