import { prisma } from "../../config/prisma";

export const createTreasury = (name: string) =>
  prisma.treasury.create({ data: { name } });

export const getTreasuries = () =>
  prisma.treasury.findMany({ orderBy: { createdAt: "desc" } });

// Receipt (Money IN)
export const createReceipt = async (data: any) => {
  await prisma.treasury.update({
    where: { id: data.treasuryId },
    data: { balance: { increment: data.amount } }
  });

  return prisma.receiptVoucher.create({ data });
};

// Payment (Money OUT)
export const createPayment = async (data: any) => {
  await prisma.treasury.update({
    where: { id: data.treasuryId },
    data: { balance: { decrement: data.amount } }
  });

  return prisma.paymentVoucher.create({ data });
};
