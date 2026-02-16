import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { checkPermission } from "../../middleware/permission.middleware";
import * as controller from "./container.controller";

const router = Router();

router.post(
  "/containers",
  authenticate,
  checkPermission("CONTAINERS", "add"),
  controller.createContainer
);

router.get(
  "/containers",
  authenticate,
  checkPermission("CONTAINERS", "view"),
  controller.getContainers
);

router.put(
  "/containers/:id",
  authenticate,
  checkPermission("CONTAINERS", "edit"),
  controller.updateContainer
);

router.delete(
  "/containers/:id",
  authenticate,
  checkPermission("CONTAINERS", "delete"),
  controller.deleteContainer
);

export default router;
