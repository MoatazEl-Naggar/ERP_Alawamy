import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "./auth.middleware";

export const checkPermission = (screen: string, action: "view" | "add" | "edit" | "delete") =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const role = req.user.role;

    // ✅ ADMIN BYPASS
    if (role === "ADMIN") return next();

    const perm = await prisma.permission.findFirst({ where: { userId, screen } });
    if (!perm) return res.status(403).json({ message: "No permission" });

    if (
      (action === "view" && !perm.canView) ||
      (action === "add" && !perm.canAdd) ||
      (action === "edit" && !perm.canEdit) ||
      (action === "delete" && !perm.canDelete)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
