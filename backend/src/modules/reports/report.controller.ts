import { Request, Response } from "express";
import * as service from "./report.service";

export const treasuryReport = async (req: Request, res: Response) => {
  res.json(await service.treasuryMovement(req.query.start as string, req.query.end as string));
};

export const expenseReport = async (req: Request, res: Response) => {
  res.json(await service.expenseSummary(req.query.start as string, req.query.end as string));
};

export const cashFlowReport = async (req: Request, res: Response) => {
  res.json(await service.cashFlow(req.query.start as string, req.query.end as string));
};
