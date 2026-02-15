import { Request, Response } from "express";
import * as service from "./user.service";
import { prisma } from "../../config/prisma";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;
    const user = await service.createUser(username, password, role);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { userId, newPassword } = req.body;
  await service.changePassword(userId, newPassword);
  res.json({ message: "Password updated" });
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await service.getUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


export const toggleStatus = async (req: Request, res: Response) => {
  const { userId, isActive } = req.body;
  await service.toggleUserStatus(userId, isActive);
  res.json({ message: "User status updated" });
};

export const setPermissions = async (req: Request, res: Response) => {
  const { userId, permissions } = req.body;
  await service.assignPermissions(userId, permissions);
  res.json({ message: "Permissions updated" });
};
