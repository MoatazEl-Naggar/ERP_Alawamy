import { Request, Response } from "express";
import * as service from "./purchase.service";

export const createInvoice = async (req: Request, res: Response) => {
  res.json(await service.createPurchaseInvoice(req.body));
};

export const getInvoices = async (_: Request, res: Response) => {
  res.json(await service.getPurchaseInvoices());
};
