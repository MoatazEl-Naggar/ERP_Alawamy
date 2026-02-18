import { prisma } from "../../config/prisma";

// ================= TREASURIES =================
export const createTreasury = (name: string) =>
  prisma.treasury.create({ data: { name } });

export const getTreasuries = () =>
  prisma.treasury.findMany({ orderBy: { createdAt: "desc" } });

// ================= RECEIPT VOUCHERS =================
// Receipt (Money IN)
export const createReceipt = async (data: any) => {
  // ✅ Map voucherNumber to voucherNumber (was voucherNo)
  const receiptData = {
    voucherNumber: data.voucherNumber || "",
    date: new Date(data.date),
    treasuryId: data.treasuryId,
    amount: Number(data.amount),
    description: data.description || null,
    receivedFrom: data.receivedFrom || null, // ✅ NEW
    notes: data.notes || null,
    currency: data.currency || "جنيه", // ✅ NEW
    exchangeRate: Number(data.exchangeRate) || 1 // ✅ NEW
  };

  // Update treasury balance
  await prisma.treasury.update({
    where: { id: data.treasuryId },
    data: { balance: { increment: data.amount } }
  });

  return prisma.receiptVoucher.create({ data: receiptData });
};

// Get all receipts
export const getReceipts = () =>
  prisma.receiptVoucher.findMany({
    include: { treasury: true },
    orderBy: { createdAt: "desc" }
  });

// Get single receipt
export const getReceiptById = (id: string) =>
  prisma.receiptVoucher.findUnique({
    where: { id },
    include: { treasury: true }
  });

// Update receipt
export const updateReceipt = async (id: string, data: any) => {
  const oldReceipt = await prisma.receiptVoucher.findUnique({
    where: { id }
  });

  if (!oldReceipt) throw new Error("Receipt not found");

  // Adjust treasury balance for amount difference
  const amountDifference = Number(data.amount) - oldReceipt.amount;
  if (amountDifference !== 0) {
    await prisma.treasury.update({
      where: { id: oldReceipt.treasuryId },
      data: { balance: { increment: amountDifference } }
    });
  }

  const receiptData = {
    voucherNumber: data.voucherNumber || oldReceipt.voucherNumber,
    date: new Date(data.date),
    treasuryId: data.treasuryId || oldReceipt.treasuryId,
    amount: Number(data.amount),
    description: data.description || null,
    receivedFrom: data.receivedFrom || null,
    notes: data.notes || null,
    currency: data.currency || "جنيه",
    exchangeRate: Number(data.exchangeRate) || 1
  };

  return prisma.receiptVoucher.update({
    where: { id },
    data: receiptData,
    include: { treasury: true }
  });
};

// Delete receipt
export const deleteReceipt = async (id: string) => {
  const receipt = await prisma.receiptVoucher.findUnique({
    where: { id }
  });

  if (!receipt) throw new Error("Receipt not found");

  // Reverse treasury balance
  await prisma.treasury.update({
    where: { id: receipt.treasuryId },
    data: { balance: { decrement: receipt.amount } }
  });

  return prisma.receiptVoucher.delete({
    where: { id }
  });
};

// ================= PAYMENT VOUCHERS =================
// Payment (Money OUT)
export const createPayment = async (data: any) => {
  // ✅ Map voucherNumber to voucherNumber (was voucherNo)
  const paymentData = {
    voucherNumber: data.voucherNumber || "",
    date: new Date(data.date),
    treasuryId: data.treasuryId,
    expenseCategoryId: data.expenseCategoryId || null,
    amount: Number(data.amount),
    description: data.description || null,
    paidTo: data.paidTo || null, // ✅ NEW
    notes: data.notes || null,
    currency: data.currency || "جنيه", // ✅ NEW
    exchangeRate: Number(data.exchangeRate) || 1 // ✅ NEW
  };

  // Update treasury balance
  await prisma.treasury.update({
    where: { id: data.treasuryId },
    data: { balance: { decrement: data.amount } }
  });

  return prisma.paymentVoucher.create({ data: paymentData });
};

// Get all payments
export const getPayments = () =>
  prisma.paymentVoucher.findMany({
    include: {
      treasury: true,
      expenseCategory: true
    },
    orderBy: { createdAt: "desc" }
  });

// Get single payment
export const getPaymentById = (id: string) =>
  prisma.paymentVoucher.findUnique({
    where: { id },
    include: {
      treasury: true,
      expenseCategory: true
    }
  });

// Update payment
export const updatePayment = async (id: string, data: any) => {
  const oldPayment = await prisma.paymentVoucher.findUnique({
    where: { id }
  });

  if (!oldPayment) throw new Error("Payment not found");

  // Adjust treasury balance for amount difference
  const amountDifference = Number(data.amount) - oldPayment.amount;
  if (amountDifference !== 0) {
    await prisma.treasury.update({
      where: { id: oldPayment.treasuryId },
      data: { balance: { decrement: amountDifference } }
    });
  }

  const paymentData = {
    voucherNumber: data.voucherNumber || oldPayment.voucherNumber,
    date: new Date(data.date),
    treasuryId: data.treasuryId || oldPayment.treasuryId,
    expenseCategoryId: data.expenseCategoryId || null,
    amount: Number(data.amount),
    description: data.description || null,
    paidTo: data.paidTo || null,
    notes: data.notes || null,
    currency: data.currency || "جنيه",
    exchangeRate: Number(data.exchangeRate) || 1
  };

  return prisma.paymentVoucher.update({
    where: { id },
    data: paymentData,
    include: {
      treasury: true,
      expenseCategory: true
    }
  });
};

// Delete payment
export const deletePayment = async (id: string) => {
  const payment = await prisma.paymentVoucher.findUnique({
    where: { id }
  });

  if (!payment) throw new Error("Payment not found");

  // Reverse treasury balance
  await prisma.treasury.update({
    where: { id: payment.treasuryId },
    data: { balance: { increment: payment.amount } }
  });

  return prisma.paymentVoucher.delete({
    where: { id }
  });
};