import { Router } from "express";
import * as controller from "./user.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, controller.createUser);
router.put("/password", authenticate, controller.changePassword);
router.put("/status", authenticate, controller.toggleStatus);
router.post("/permissions", authenticate, controller.setPermissions);

export default router;
