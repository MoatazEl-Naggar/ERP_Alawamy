import { Request, Response } from "express";
import * as service from "./finance.service";

export const createTreasury = async (req: Request, res: Response) => {
  const treasury = await service.createTreasury(req.body.name);
  res.json(treasury);
};

export const getTreasuries = async (_: Request, res: Response) => {
  res.json(await service.getTreasuries());
};
