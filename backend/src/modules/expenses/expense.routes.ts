import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { checkPermission } from "../../middleware/permission.middleware";
import * as controller from "./expense.controller";

const router = Router();

router.post("/expenses", authenticate, checkPermission("EXPENSES", "add"), controller.createExpense);
router.get("/expenses", authenticate, checkPermission("EXPENSES", "view"), controller.getExpenses);
router.put("/expenses/:id", authenticate, checkPermission("EXPENSES", "edit"), controller.updateExpense);
router.delete("/expenses/:id", authenticate, checkPermission("EXPENSES", "delete"), controller.deleteExpense);

export default router;
