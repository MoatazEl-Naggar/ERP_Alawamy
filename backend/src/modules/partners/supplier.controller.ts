import { Request, Response } from "express";
import * as service from "./partner.service";

export const createSupplier = async (req: Request, res: Response) => {
  const supplier = await service.createSupplier(req.body);
  res.json(supplier);
};

export const getSuppliers = async (_: Request, res: Response) => {
  const suppliers = await service.getSuppliers();
  res.json(suppliers);
};

export const updateSupplier = async (req: Request, res: Response) => {
  const supplier = await service.updateSupplier(String(req.params.id), req.body);
  res.json(supplier);
};

export const deleteSupplier = async (req: Request, res: Response) => {
  await service.deleteSupplier(String(req.params.id));
  res.json({ message: "Supplier deleted" });
};
