import { prisma } from "../../config/prisma";

export const createPurchaseInvoice = async (data: any) => {
  return prisma.purchaseInvoice.create({
    data: {
      invoiceNumber:  data.invoiceNumber,
      referenceNo:    data.referenceNo    || null,
      date:           new Date(data.date),
      supplierId:     data.supplierId,
      notes:          data.notes          || null,
      containerNo:    data.containerNo    || null,
      clientCode:     data.clientCode     || null,
      creditDays:     data.creditDays     ? Number(data.creditDays)     : null,
      storeCode:      data.storeCode      || null,
      downPayment:    data.downPayment    ? Number(data.downPayment)    : null,
      headerDiscount: data.headerDiscount ? Number(data.headerDiscount) : null,
      items: {
        create: (data.items ?? []).map((item: any) => ({
          itemName:      item.itemCode  || item.itemName || "",
          barcode:       item.barcode   || null,
          qtyCartons:    item.qtyCartons ?? null,
          qtyUnits:      item.qtyUnits   ?? null,
          price:         item.price      ?? null,
          total:         item.valueAfterDiscount ?? item.value ?? item.total ?? null,
          cbm:           item.cbm        ?? null,
          discount:      item.itemDiscount ?? null,
          itemCode:      item.itemCode   || null,
          category:      item.category   || null,
          description:   item.description|| null,
          itemNotes:     item.itemNotes  || null,
          cartonNumber:  item.cartonNumber || null,
          receivingDate: item.receivingDate ? new Date(item.receivingDate) : null,
          images:        item.images     || [],
        }))
      }
    },
    include: { items: true, supplier: true }
  });
};

export const getPurchaseInvoices = () =>
  prisma.purchaseInvoice.findMany({
    include: { supplier: true, items: true },
    orderBy: { createdAt: "desc" }
  });

export const getPurchaseInvoiceById = (id: string) =>
  prisma.purchaseInvoice.findUnique({
    where: { id },
    include: { supplier: true, items: true }
  });

export const updatePurchaseInvoice = async (id: string, data: any) => {
  // Delete existing items then re-create (simplest approach)
  await prisma.purchaseItem.deleteMany({ where: { invoiceId: id } });

  return prisma.purchaseInvoice.update({
    where: { id },
    data: {
      invoiceNumber:  data.invoiceNumber,
      referenceNo:    data.referenceNo    || null,
      date:           new Date(data.date),
      supplierId:     data.supplierId,
      notes:          data.notes          || null,
      containerNo:    data.containerNo    || null,
      clientCode:     data.clientCode     || null,
      creditDays:     data.creditDays     ? Number(data.creditDays)     : null,
      storeCode:      data.storeCode      || null,
      downPayment:    data.downPayment    ? Number(data.downPayment)    : null,
      headerDiscount: data.headerDiscount ? Number(data.headerDiscount) : null,
      items: {
        create: (data.items ?? []).map((item: any) => ({
          itemName:      item.itemCode  || item.itemName || "",
          barcode:       item.barcode   || null,
          qtyCartons:    item.qtyCartons ?? null,
          qtyUnits:      item.qtyUnits   ?? null,
          price:         item.price      ?? null,
          total:         item.valueAfterDiscount ?? item.value ?? item.total ?? null,
          cbm:           item.cbm        ?? null,
          discount:      item.itemDiscount ?? null,
          itemCode:      item.itemCode   || null,
          category:      item.category   || null,
          description:   item.description|| null,
          itemNotes:     item.itemNotes  || null,
          cartonNumber:  item.cartonNumber || null,
          receivingDate: item.receivingDate ? new Date(item.receivingDate) : null,
          images:        item.images     || [],
        }))
      }
    },
    include: { items: true, supplier: true }
  });
};

export const deletePurchaseInvoice = (id: string) =>
  prisma.purchaseInvoice.delete({ where: { id } });