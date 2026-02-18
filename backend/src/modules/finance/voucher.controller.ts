import { Request, Response } from "express";
import * as service from "./finance.service";

// ================= RECEIPT VOUCHERS =================
export const createReceipt = async (req: Request, res: Response) => {
  try {
    const receipt = await service.createReceipt(req.body);
    res.status(201).json(receipt);
  } catch (error: any) {
    console.error("Error creating receipt:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getReceipts = async (req: Request, res: Response) => {
  try {
    const receipts = await service.getReceipts();
    res.json(receipts);
  } catch (error: any) {
    console.error("Error fetching receipts:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getReceiptById = async (req: Request, res: Response) => {
  try {
    const receipt = await service.getReceiptById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }
    res.json(receipt);
  } catch (error: any) {
    console.error("Error fetching receipt:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updateReceipt = async (req: Request, res: Response) => {
  try {
    const receipt = await service.updateReceipt(req.params.id, req.body);
    res.json(receipt);
  } catch (error: any) {
    console.error("Error updating receipt:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteReceipt = async (req: Request, res: Response) => {
  try {
    await service.deleteReceipt(req.params.id);
    res.json({ message: "Receipt deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting receipt:", error);
    res.status(400).json({ message: error.message });
  }
};

// ================= PAYMENT VOUCHERS =================
export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await service.createPayment(req.body);
    res.status(201).json(payment);
  } catch (error: any) {
    console.error("Error creating payment:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await service.getPayments();
    res.json(payments);
  } catch (error: any) {
    console.error("Error fetching payments:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await service.getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error: any) {
    console.error("Error fetching payment:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const payment = await service.updatePayment(req.params.id, req.body);
    res.json(payment);
  } catch (error: any) {
    console.error("Error updating payment:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    await service.deletePayment(req.params.id);
    res.json({ message: "Payment deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting payment:", error);
    res.status(400).json({ message: error.message });
  }
};