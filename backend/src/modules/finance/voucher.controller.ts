import { Request, Response } from "express";
import * as service from "./finance.service";

export const createReceipt = async (req: Request, res: Response) => {
  res.json(await service.createReceipt(req.body));
};

export const createPayment = async (req: Request, res: Response) => {
  res.json(await service.createPayment(req.body));
};
