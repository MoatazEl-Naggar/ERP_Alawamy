import { prisma } from "../../config/prisma";

export const getCurrencies = () =>
  prisma.currency.findMany({ orderBy: { name: "asc" } });

export const getCurrencyById = (id: string) =>
  prisma.currency.findUnique({ where: { id } });

export const createCurrency = (data: { name: string; exchangeRate: number }) =>
  prisma.currency.create({
    data: {
      name: data.name,
      exchangeRate: Number(data.exchangeRate),
    },
  });

export const updateCurrency = (id: string, data: { name?: string; exchangeRate?: number }) =>
  prisma.currency.update({
    where: { id },
    data: {
      name: data.name,
      exchangeRate: data.exchangeRate !== undefined ? Number(data.exchangeRate) : undefined,
    },
  });

export const deleteCurrency = (id: string) =>
  prisma.currency.delete({ where: { id } });