import { Request, Response } from "express";
import * as service from "./purchase.service";

export const createInvoice = async (req: Request, res: Response) => {
  try {
    res.json(await service.createPurchaseInvoice(req.body));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getInvoices = async (_: Request, res: Response) => {
  try {
    res.json(await service.getPurchaseInvoices());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const inv = await service.getPurchaseInvoiceById(req.params.id);
    if (!inv) return res.status(404).json({ error: "Not found" });
    res.json(inv);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    res.json(await service.updatePurchaseInvoice(req.params.id, req.body));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    await service.deletePurchaseInvoice(req.params.id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};