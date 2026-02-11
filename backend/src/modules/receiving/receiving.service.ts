import { prisma } from "../../config/prisma";

export const createReceivingInvoice = async (data: any) => {
  const receiving = await prisma.receivingInvoice.create({
    data: {
      invoiceNumber: data.invoiceNumber,
      date: new Date(data.date),
      purchaseId: data.purchaseId,
      notes: data.notes,
      items: {
        create: data.items
      }
    },
    include: {
      items: {
        include: {
          purchaseItem: true
        }
      }
    }
  });

  // 🔥 Update Inventory
  for (const item of receiving.items) {
    const name = item.purchaseItem.itemName;
    const barcode = item.purchaseItem.barcode;

    const existing = await prisma.inventoryItem.findFirst({
      where: { itemName: name }
    });

    if (existing) {
      await prisma.inventoryItem.update({
        where: { id: existing.id },
        data: {
          totalReceived: { increment: item.receivedUnits },
          balance: { increment: item.receivedUnits }
        }
      });
    } else {
      await prisma.inventoryItem.create({
        data: {
          itemName: name,
          barcode,
          totalReceived: item.receivedUnits,
          balance: item.receivedUnits
        }
      });
    }
  }

  return receiving;
};

export const getReceivingInvoices = () =>
  prisma.receivingInvoice.findMany({
    include: {
      purchase: true,
      items: { include: { purchaseItem: true } }
    },
    orderBy: { createdAt: "desc" }
  });
