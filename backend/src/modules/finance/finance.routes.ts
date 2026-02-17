import { Router } from "express";
import * as treasury from "./treasury.controller";
import * as voucher from "./voucher.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { checkPermission } from "../../middleware/permission.middleware";

const router = Router();

// Treasuries
router.post("/treasuries", authenticate, checkPermission("TREASURY", "add"), treasury.createTreasury);
router.get("/treasuries", authenticate, checkPermission("TREASURY", "view"), treasury.getTreasuries);

// Vouchers
router.post("/receipts", authenticate, checkPermission("FINANCE", "add"), voucher.createReceipt);
router.get("/receipts", authenticate, checkPermission("FINANCE", "view"), voucher.getReceipts);
router.post("/payments", authenticate, checkPermission("FINANCE", "add"), voucher.createPayment);
router.get("/payments", authenticate, checkPermission("FINANCE", "view"), voucher.getPayments);

export default router;
