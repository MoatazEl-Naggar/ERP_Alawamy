import { Request, Response } from "express";
import * as service from "./inventory.service";

export const inventoryReport = async (req: Request, res: Response) => {
  const data = await service.getInventoryReport(req.query);
  res.json(data);
};
