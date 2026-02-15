import { Router } from "express";
import * as controller from "./user.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { prisma } from "../../config/prisma";

const router = Router();

router.post("/", authenticate, controller.createUser);
router.get("/", authenticate, controller.getUsers);   
router.put("/password", authenticate, controller.changePassword);
router.put("/status", authenticate, controller.toggleStatus);
router.post("/permissions", authenticate, controller.setPermissions);

export default router;
