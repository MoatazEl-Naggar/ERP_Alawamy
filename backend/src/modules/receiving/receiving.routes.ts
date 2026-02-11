import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { checkPermission } from "../../middleware/permission.middleware";
import * as controller from "./receiving.controller";

const router = Router();

router.post(
  "/receiving",
  authenticate,
  checkPermission("RECEIVING", "add"),
  controller.createReceiving
);

router.get(
  "/receiving",
  authenticate,
  checkPermission("RECEIVING", "view"),
  controller.getReceiving
);

export default router;
