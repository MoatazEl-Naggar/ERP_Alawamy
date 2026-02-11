import { Request, Response } from "express";
import * as service from "./partner.service";

export const createCustomer = async (req: Request, res: Response) => {
  const customer = await service.createCustomer(req.body);
  res.json(customer);
};

export const getCustomers = async (_: Request, res: Response) => {
  const customers = await service.getCustomers();
  res.json(customers);
};

export const updateCustomer = async (req: Request, res: Response) => {
  const customer = await service.updateCustomer(req.params.id, req.body);
  res.json(customer);
};

export const deleteCustomer = async (req: Request, res: Response) => {
  await service.deleteCustomer(req.params.id);
  res.json({ message: "Customer deleted" });
};
