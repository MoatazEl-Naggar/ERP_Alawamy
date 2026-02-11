import { Request, Response } from "express";
import * as service from "./shipment.service";

export const createShipment = async (req: Request, res: Response) => {
  res.json(await service.createShipment(req.body));
};

export const getShipments = async (_: Request, res: Response) => {
  res.json(await service.getShipments());
};
