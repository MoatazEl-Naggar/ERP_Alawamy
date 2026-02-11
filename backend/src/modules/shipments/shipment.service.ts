import { prisma } from "../../config/prisma";

export const createShipment = async (data: any) => {
  const shipment = await prisma.shipment.create({
    data: {
      containerNo: data.containerNo,
      date: new Date(data.date),
      customerId: data.customerId,
      shippingCompany: data.shippingCompany,
      notes: data.notes,
      items: {
        create: data.items
      }
    },
    include: {
      items: {
        include: {
          receivingItem: {
            include: {
              purchaseItem: true
            }
          }
        }
      }
    }
  });

  // 🔥 Reduce Inventory
  for (const item of shipment.items) {
    const name = item.receivingItem.purchaseItem.itemName;

    await prisma.inventoryItem.updateMany({
      where: { itemName: name },
      data: {
        totalShipped: { increment: item.shippedUnits },
        balance: { decrement: item.shippedUnits }
      }
    });
  }

  return shipment;
};

export const getShipments = () =>
  prisma.shipment.findMany({
    include: {
      customer: true,
      items: {
        include: {
          receivingItem: { include: { purchaseItem: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
