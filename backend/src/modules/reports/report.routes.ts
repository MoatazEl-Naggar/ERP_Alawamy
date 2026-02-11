import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { checkPermission } from "../../middleware/permission.middleware";
import * as controller from "./report.controller";

const router = Router();

router.get("/reports/treasury", authenticate, checkPermission("REPORTS", "view"), controller.treasuryReport);
router.get("/reports/expenses", authenticate, checkPermission("REPORTS", "view"), controller.expenseReport);
router.get("/reports/cashflow", authenticate, checkPermission("REPORTS", "view"), controller.cashFlowReport);

export default router;
