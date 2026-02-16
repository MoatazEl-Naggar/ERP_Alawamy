import { prisma } from "../../config/prisma";

export const createShipment = async (data: any) => {
  const selectedContainer = data.containerId
    ? await prisma.container.findUnique({ where: { id: data.containerId } })
    : null;

  const shipment = await prisma.shipment.create({
    data: {
      containerNo: selectedContainer?.containerNo || data.containerNo,
      containerId: data.containerId || null,
      date: new Date(data.date),
      customerId: data.customerId,
      shippingCompany: data.shippingCompany,
      notes: data.notes,
      items: {
        create: data.items
      }
    },
    include: {
      container: true,
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
      container: true,
      customer: true,
      items: {
        include: {
          receivingItem: { include: { purchaseItem: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
