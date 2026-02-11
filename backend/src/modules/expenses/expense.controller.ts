import { Request, Response } from "express";
import * as service from "./expense.service";

export const createExpense = async (req: Request, res: Response) => {
  res.json(await service.createExpenseCategory(req.body));
};

export const getExpenses = async (_: Request, res: Response) => {
  res.json(await service.getExpenseCategories());
};

export const updateExpense = async (req: Request, res: Response) => {
  res.json(await service.updateExpenseCategory(req.params.id, req.body));
};

export const deleteExpense = async (req: Request, res: Response) => {
  await service.deleteExpenseCategory(req.params.id);
  res.json({ message: "Deleted" });
};
