import { prisma } from "../../config/prisma";

export const createCustomer = (data: any) =>
  prisma.customer.create({ data });

export const getCustomers = () =>
  prisma.customer.findMany({ orderBy: { createdAt: "desc" } });

export const updateCustomer = (id: string, data: any) =>
  prisma.customer.update({ where: { id }, data });

export const deleteCustomer = (id: string) =>
  prisma.customer.delete({ where: { id } });

export const createSupplier = (data: any) =>
  prisma.supplier.create({ data });

export const getSuppliers = () =>
  prisma.supplier.findMany({ orderBy: { createdAt: "desc" } });

export const updateSupplier = (id: string, data: any) =>
  prisma.supplier.update({ where: { id }, data });

export const deleteSupplier = (id: string) =>
  prisma.supplier.delete({ where: { id } });
