import { prisma } from "../../config/prisma";

const toValidDate = (value: unknown) => {
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid container date");
  }
  return date;
};

const normalizeContainerNo = (value: unknown) => {
  const containerNo = String(value ?? "").trim();
  if (!containerNo) {
    throw new Error("Container number is required");
  }
  return containerNo;
};

export const createContainer = (data: any) =>
  prisma.container.create({
    data: {
      containerNo: normalizeContainerNo(data.containerNo),
      date: toValidDate(data.date),
      notes: data.notes?.trim() || null
    }
  });

export const getContainers = () =>
  prisma.container.findMany({ orderBy: { createdAt: "desc" } });

export const updateContainer = (id: string, data: any) =>
  prisma.container.update({
    where: { id },
    data: {
      ...(data.containerNo !== undefined
        ? { containerNo: normalizeContainerNo(data.containerNo) }
        : {}),
      ...(data.date !== undefined ? { date: toValidDate(data.date) } : {}),
      ...(data.notes !== undefined ? { notes: data.notes?.trim() || null } : {})
    }
  });

export const deleteContainer = (id: string) =>
  prisma.container.delete({ where: { id } });
