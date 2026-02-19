import { Request, Response } from "express";
import * as service from "./currency.service";

export const getCurrencies = async (_req: Request, res: Response) => {
  try {
    const currencies = await service.getCurrencies();
    res.json(currencies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrencyById = async (req: Request, res: Response) => {
  try {
    const currency = await service.getCurrencyById(req.params.id);
    if (!currency) return res.status(404).json({ message: "Currency not found" });
    res.json(currency);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCurrency = async (req: Request, res: Response) => {
  try {
    const currency = await service.createCurrency(req.body);
    res.status(201).json(currency);
  } catch (error: any) {
    // Unique constraint violation
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Currency name already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};

export const updateCurrency = async (req: Request, res: Response) => {
  try {
    const currency = await service.updateCurrency(req.params.id, req.body);
    res.json(currency);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Currency name already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};

export const deleteCurrency = async (req: Request, res: Response) => {
  try {
    await service.deleteCurrency(req.params.id);
    res.json({ message: "Currency deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};