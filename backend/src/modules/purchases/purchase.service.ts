import { prisma } from "../../config/prisma";

export const createPurchaseInvoice = async (data: any) => {
  return prisma.purchaseInvoice.create({
    data: {
      invoiceNumber: data.invoiceNumber,
      referenceNo: data.referenceNo,
      date: new Date(data.date),
      supplierId: data.supplierId,
      notes: data.notes,
      items: {
        create: data.items
      }
    },
    include: { items: true }
  });
};

export const getPurchaseInvoices = () =>
  prisma.purchaseInvoice.findMany({
    include: { supplier: true, items: true },
    orderBy: { createdAt: "desc" }
  });
