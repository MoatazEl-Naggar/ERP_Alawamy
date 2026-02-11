import { Request, Response } from "express";
import * as service from "./receiving.service";

export const createReceiving = async (req: Request, res: Response) => {
  res.json(await service.createReceivingInvoice(req.body));
};

export const getReceiving = async (_: Request, res: Response) => {
  res.json(await service.getReceivingInvoices());
};
