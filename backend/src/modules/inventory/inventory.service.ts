import { prisma } from "../../config/prisma";

export const getInventoryReport = async (query: any) => {
  const where: any = {};

  if (query.search) {
    where.itemName = { contains: query.search, mode: "insensitive" };
  }

  if (query.lowStock) {
    where.balance = { lte: Number(query.lowStock) };
  }

  return prisma.inventoryItem.findMany({
    where,
    orderBy: { itemName: "asc" }
  });
};

export const getInventoryItems = () =>
  prisma.inventoryItem.findMany({ orderBy: { itemName: "asc" } });

export const createInventoryItem = (data: any) =>
  prisma.inventoryItem.create({ data });

export const updateInventoryItem = (id: string, data: any) =>
  prisma.inventoryItem.update({ where: { id }, data });

export const deleteInventoryItem = (id: string) =>
  prisma.inventoryItem.delete({ where: { id } });
