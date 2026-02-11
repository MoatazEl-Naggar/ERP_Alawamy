import { prisma } from "../../config/prisma";

export const createExpenseCategory = (data: any) =>
  prisma.expenseCategory.create({ data });

export const getExpenseCategories = () =>
  prisma.expenseCategory.findMany({ orderBy: { number: "asc" } });

export const updateExpenseCategory = (id: string, data: any) =>
  prisma.expenseCategory.update({ where: { id }, data });

export const deleteExpenseCategory = (id: string) =>
  prisma.expenseCategory.delete({ where: { id } });
