import { prisma } from "../../config/prisma";

export const createShipment = async (data: any) => {
  const shipment = await prisma.shipment.create({
    data: {
      referenceNo: data.referenceNo,
      date: new Date(data.date),
      customerId: data.customerId,
      containerId: data.containerId,
      shippingCompany: data.shippingCompany || null,
      notes: data.notes || null,
      items: {
        create: data.items.map((item: any) => ({
          receivingItemId: item.receivingItemId,
          shippedUnits: item.shippedUnits,
        })),
      },
    },
    include: {
      items: {
        include: {
          receivingItem: {
            include: {
              purchaseItem: true,
            },
          },
        },
      },
    },
  });

  // 🔥 Reduce Inventory
  for (const item of shipment.items) {
    const name = item.receivingItem.purchaseItem.itemName;

    await prisma.inventoryItem.updateMany({
      where: { itemName: name },
      data: {
        totalShipped: { increment: item.shippedUnits },
        balance: { decrement: item.shippedUnits },
      },
    });
  }

  return shipment;
};

export const getShipments = () =>
  prisma.shipment.findMany({
    include: {
      customer: true,
      container: true,
      items: {
        include: {
          receivingItem: { include: { purchaseItem: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });