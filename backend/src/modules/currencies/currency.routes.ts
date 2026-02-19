import { Router } from "express";
import * as controller from "./currency.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { checkPermission } from "../../middleware/permission.middleware";

const router = Router();

router.get(
  "/currencies",
  authenticate,
  checkPermission("FINANCE", "view"),
  controller.getCurrencies
);

router.get(
  "/currencies/:id",
  authenticate,
  checkPermission("FINANCE", "view"),
  controller.getCurrencyById
);

router.post(
  "/currencies",
  authenticate,
  checkPermission("FINANCE", "add"),
  controller.createCurrency
);

router.put(
  "/currencies/:id",
  authenticate,
  checkPermission("FINANCE", "edit"),
  controller.updateCurrency
);

router.delete(
  "/currencies/:id",
  authenticate,
  checkPermission("FINANCE", "delete"),
  controller.deleteCurrency
);

export default router;