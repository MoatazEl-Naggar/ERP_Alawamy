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
