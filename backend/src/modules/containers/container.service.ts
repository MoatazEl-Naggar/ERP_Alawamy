import { prisma } from "../../config/prisma";

export const createContainer = (data: any) =>
  prisma.container.create({
    data: {
      containerNumber: data.containerNo || data.containerNumber,  // fix: accept both field names
      containerType: data.containerType || "standard",
      date: data.date ? new Date(data.date) : null,
      notes: data.notes || null,
    },
  });

export const getContainers = () =>
  prisma.container.findMany({ orderBy: { createdAt: "desc" } });

export const updateContainer = (id: string, data: any) =>
  prisma.container.update({
    where: { id },
    data: {
      containerNumber: data.containerNo || data.containerNumber,  // fix: accept both field names
      containerType: data.containerType || "standard",
      date: data.date ? new Date(data.date) : null,
      notes: data.notes || null,
    },
  });

export const deleteContainer = (id: string) =>
  prisma.container.delete({ where: { id } });