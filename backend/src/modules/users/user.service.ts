import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";

export const createUser = async (username: string, password: string, role: any) => {
  const activeUsers = await prisma.user.count({ where: { isActive: true } });
  if (activeUsers >= 5) throw new Error("Maximum 5 active users allowed");

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) throw new Error("Username already exists");

  const hash = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { username, passwordHash: hash, role }
  });
};

export const changePassword = async (userId: string, newPassword: string) => {
  const hash = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hash }
  });
};

export const toggleUserStatus = async (userId: string, isActive: boolean) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive }
  });
};

export const getUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};


export const assignPermissions = async (userId: string, permissions: any[]) => {
  await prisma.permission.deleteMany({ where: { userId } });

  return prisma.permission.createMany({
    data: permissions.map(p => ({
      userId,
      screen: p.screen,
      canView: p.canView,
      canAdd: p.canAdd,
      canEdit: p.canEdit,
      canDelete: p.canDelete
    }))
  });
};
