import { prisma } from "../../config/prisma";

export const createContainer = (data: any) =>
  prisma.container.create({
    data: {
      containerNo: data.containerNo,
      date: new Date(data.date),
      notes: data.notes || null
    }
  });

export const getContainers = () =>
  prisma.container.findMany({ orderBy: { createdAt: "desc" } });

export const updateContainer = (id: string, data: any) =>
  prisma.container.update({
    where: { id },
    data: {
      containerNo: data.containerNo,
      date: new Date(data.date),
      notes: data.notes || null
    }
  });

export const deleteContainer = (id: string) =>
  prisma.container.delete({ where: { id } });
