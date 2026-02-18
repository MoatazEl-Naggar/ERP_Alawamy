import { Router } from "express";
import * as treasury from "./treasury.controller";
import * as voucher from "./voucher.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { checkPermission } from "../../middleware/permission.middleware";

const router = Router();

// ================= TREASURIES =================
router.post("/treasuries", authenticate, checkPermission("TREASURY", "add"), treasury.createTreasury);
router.get("/treasuries", authenticate, checkPermission("TREASURY", "view"), treasury.getTreasuries);

// ================= RECEIPT VOUCHERS =================
router.post(
  "/receipts",
  authenticate,
  checkPermission("FINANCE", "add"),
  voucher.createReceipt
);

router.get(
  "/receipts",
  authenticate,
  checkPermission("FINANCE", "view"),
  voucher.getReceipts
);

router.get(
  "/receipts/:id",
  authenticate,
  checkPermission("FINANCE", "view"),
  voucher.getReceiptById
);

router.put(
  "/receipts/:id",
  authenticate,
  checkPermission("FINANCE", "edit"),
  voucher.updateReceipt
);

router.delete(
  "/receipts/:id",
  authenticate,
  checkPermission("FINANCE", "delete"),
  voucher.deleteReceipt
);

// ================= PAYMENT VOUCHERS =================
router.post(
  "/payments",
  authenticate,
  checkPermission("FINANCE", "add"),
  voucher.createPayment
);

router.get(
  "/payments",
  authenticate,
  checkPermission("FINANCE", "view"),
  voucher.getPayments
);

router.get(
  "/payments/:id",
  authenticate,
  checkPermission("FINANCE", "view"),
  voucher.getPaymentById
);

router.put(
  "/payments/:id",
  authenticate,
  checkPermission("FINANCE", "edit"),
  voucher.updatePayment
);

router.delete(
  "/payments/:id",
  authenticate,
  checkPermission("FINANCE", "delete"),
  voucher.deletePayment
);

export default router;