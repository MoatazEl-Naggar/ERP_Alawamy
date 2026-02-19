import { prisma } from "../../config/prisma";

// ================= TREASURIES =================
export const createTreasury = (name: string) =>
  prisma.treasury.create({ data: { name } });

export const getTreasuries = () =>
  prisma.treasury.findMany({ orderBy: { createdAt: "desc" } });

// ================= SHARED INCLUDE =================
const receiptInclude = {
  treasury: true,
  expenseCategory: true,
  shipment: { select: { id: true, referenceNo: true } },
  customer: { select: { id: true, name: true } },
  supplier: { select: { id: true, name: true } },
};

const paymentInclude = {
  treasury: true,
  expenseCategory: true,
  shipment: { select: { id: true, referenceNo: true } },
  customer: { select: { id: true, name: true } },
  supplier: { select: { id: true, name: true } },
};

// ================= RECEIPT VOUCHERS =================
export const createReceipt = async (data: any) => {
  await prisma.treasury.update({
    where: { id: data.treasuryId },
    data: { balance: { increment: Number(data.amount) } },
  });

  return prisma.receiptVoucher.create({
    data: {
      voucherNumber:     data.voucherNumber || "",
      date:              new Date(data.date),
      treasuryId:        data.treasuryId,
      expenseCategoryId: data.expenseCategoryId || null,
      amount:            Number(data.amount),
      costPrice:         data.costPrice != null ? Number(data.costPrice) : null,
      description:       data.description || null,
      receivedFrom:      data.receivedFrom || null,
      notes:             data.notes || null,
      currency:          data.currency || "جنيه",
      exchangeRate:      Number(data.exchangeRate) || 1,
      shipmentId:        data.shipmentId || null,
      customerId:        data.customerId || null,
      supplierId:        data.supplierId || null,
    },
    include: receiptInclude,
  });
};

export const getReceipts = (from?: string, to?: string) => {
  const where: any = {};
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      where.date.lte = toDate;
    }
  }
  return prisma.receiptVoucher.findMany({
    where,
    include: receiptInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const getReceiptById = (id: string) =>
  prisma.receiptVoucher.findUnique({ where: { id }, include: receiptInclude });

export const updateReceipt = async (id: string, data: any) => {
  const old = await prisma.receiptVoucher.findUnique({ where: { id } });
  if (!old) throw new Error("Receipt not found");

  const diff = Number(data.amount) - old.amount;
  if (diff !== 0)
    await prisma.treasury.update({
      where: { id: old.treasuryId },
      data: { balance: { increment: diff } },
    });

  return prisma.receiptVoucher.update({
    where: { id },
    data: {
      voucherNumber:     data.voucherNumber ?? old.voucherNumber,
      date:              new Date(data.date),
      treasuryId:        data.treasuryId ?? old.treasuryId,
      expenseCategoryId: data.expenseCategoryId || null,
      amount:            Number(data.amount),
      costPrice:         data.costPrice != null ? Number(data.costPrice) : null,
      description:       data.description || null,
      receivedFrom:      data.receivedFrom || null,
      notes:             data.notes || null,
      currency:          data.currency || "جنيه",
      exchangeRate:      Number(data.exchangeRate) || 1,
      shipmentId:        data.shipmentId || null,
      customerId:        data.customerId || null,
      supplierId:        data.supplierId || null,
    },
    include: receiptInclude,
  });
};

export const deleteReceipt = async (id: string) => {
  const r = await prisma.receiptVoucher.findUnique({ where: { id } });
  if (!r) throw new Error("Receipt not found");
  await prisma.treasury.update({
    where: { id: r.treasuryId },
    data: { balance: { decrement: r.amount } },
  });
  return prisma.receiptVoucher.delete({ where: { id } });
};

// ================= PAYMENT VOUCHERS =================
export const createPayment = async (data: any) => {
  await prisma.treasury.update({
    where: { id: data.treasuryId },
    data: { balance: { decrement: Number(data.amount) } },
  });

  return prisma.paymentVoucher.create({
    data: {
      voucherNumber:     data.voucherNumber || "",
      date:              new Date(data.date),
      treasuryId:        data.treasuryId,
      expenseCategoryId: data.expenseCategoryId || null,
      amount:            Number(data.amount),
      costPrice:         data.costPrice != null ? Number(data.costPrice) : null,
      description:       data.description || null,
      paidTo:            data.paidTo || null,
      notes:             data.notes || null,
      currency:          data.currency || "جنيه",
      exchangeRate:      Number(data.exchangeRate) || 1,
      shipmentId:        data.shipmentId || null,
      customerId:        data.customerId || null,
      supplierId:        data.supplierId || null,
    },
    include: paymentInclude,
  });
};

export const getPayments = (from?: string, to?: string) => {
  const where: any = {};
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      where.date.lte = toDate;
    }
  }
  return prisma.paymentVoucher.findMany({
    where,
    include: paymentInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const getPaymentById = (id: string) =>
  prisma.paymentVoucher.findUnique({ where: { id }, include: paymentInclude });

export const updatePayment = async (id: string, data: any) => {
  const old = await prisma.paymentVoucher.findUnique({ where: { id } });
  if (!old) throw new Error("Payment not found");

  const diff = Number(data.amount) - old.amount;
  if (diff !== 0)
    await prisma.treasury.update({
      where: { id: old.treasuryId },
      data: { balance: { decrement: diff } },
    });

  return prisma.paymentVoucher.update({
    where: { id },
    data: {
      voucherNumber:     data.voucherNumber ?? old.voucherNumber,
      date:              new Date(data.date),
      treasuryId:        data.treasuryId ?? old.treasuryId,
      expenseCategoryId: data.expenseCategoryId || null,
      amount:            Number(data.amount),
      costPrice:         data.costPrice != null ? Number(data.costPrice) : null,
      description:       data.description || null,
      paidTo:            data.paidTo || null,
      notes:             data.notes || null,
      currency:          data.currency || "جنيه",
      exchangeRate:      Number(data.exchangeRate) || 1,
      shipmentId:        data.shipmentId || null,
      customerId:        data.customerId || null,
      supplierId:        data.supplierId || null,
    },
    include: paymentInclude,
  });
};

export const deletePayment = async (id: string) => {
  const p = await prisma.paymentVoucher.findUnique({ where: { id } });
  if (!p) throw new Error("Payment not found");
  await prisma.treasury.update({
    where: { id: p.treasuryId },
    data: { balance: { increment: p.amount } },
  });
  return prisma.paymentVoucher.delete({ where: { id } });
};