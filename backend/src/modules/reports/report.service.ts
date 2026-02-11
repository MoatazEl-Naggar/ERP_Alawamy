import { prisma } from "../../config/prisma";

export const treasuryMovement = async (start?: string, end?: string) => {
  const dateFilter: any = {};

  if (start && end) {
    dateFilter.date = {
      gte: new Date(start),
      lte: new Date(end)
    };
  }

  const receipts = await prisma.receiptVoucher.findMany({
    where: dateFilter,
    include: { treasury: true }
  });

  const payments = await prisma.paymentVoucher.findMany({
    where: dateFilter,
    include: { treasury: true, expenseCategory: true }
  });

  return { receipts, payments };
};

export const expenseSummary = async (start?: string, end?: string) => {
  const where: any = {};

  if (start && end) {
    where.date = {
      gte: new Date(start),
      lte: new Date(end)
    };
  }

  const payments = await prisma.paymentVoucher.groupBy({
    by: ["expenseCategoryId"],
    where,
    _sum: { amount: true }
  });

  return payments;
};

export const cashFlow = async (start?: string, end?: string) => {
  const dateFilter: any = {};

  if (start && end) {
    dateFilter.date = {
      gte: new Date(start),
      lte: new Date(end)
    };
  }

  const totalIn = await prisma.receiptVoucher.aggregate({
    where: dateFilter,
    _sum: { amount: true }
  });

  const totalOut = await prisma.paymentVoucher.aggregate({
    where: dateFilter,
    _sum: { amount: true }
  });

  return {
    totalIn: totalIn._sum.amount || 0,
    totalOut: totalOut._sum.amount || 0,
    net: (totalIn._sum.amount || 0) - (totalOut._sum.amount || 0)
  };
};
