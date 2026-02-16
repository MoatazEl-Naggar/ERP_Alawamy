import { Request, Response } from "express";
import * as service from "./inventory.service";

export const inventoryReport = async (req: Request, res: Response) => {
  const data = await service.getInventoryReport(req.query);
  res.json(data);
};

export const getInventoryItems = async (_: Request, res: Response) => {
  res.json(await service.getInventoryItems());
};

export const createInventoryItem = async (req: Request, res: Response) => {
  const payload = {
    itemName: req.body.itemName,
    barcode: req.body.barcode || null,
    totalReceived: Number(req.body.totalReceived || 0),
    totalShipped: Number(req.body.totalShipped || 0),
    balance: Number(req.body.balance || 0)
  };

  res.json(await service.createInventoryItem(payload));
};

export const updateInventoryItem = async (req: Request, res: Response) => {
  const payload = {
    itemName: req.body.itemName,
    barcode: req.body.barcode || null
  };

  res.json(await service.updateInventoryItem(String(req.params.id), payload));
};

export const deleteInventoryItem = async (req: Request, res: Response) => {
  await service.deleteInventoryItem(String(req.params.id));
  res.json({ message: "Deleted" });
};
