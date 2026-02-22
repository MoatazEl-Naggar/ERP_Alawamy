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

router.get(
  "/purchase-invoices/:id",
  authenticate,
  checkPermission("PURCHASES", "view"),
  controller.getInvoiceById
);

router.put(
  "/purchase-invoices/:id",
  authenticate,
  checkPermission("PURCHASES", "edit"),
  controller.updateInvoice
);

router.delete(
  "/purchase-invoices/:id",
  authenticate,
  checkPermission("PURCHASES", "delete"),
  controller.deleteInvoice
);

export default router;