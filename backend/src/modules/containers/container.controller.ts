import { Request, Response } from "express";
import * as service from "./container.service";

export const createContainer = async (req: Request, res: Response) => {
  res.json(await service.createContainer(req.body));
};

export const getContainers = async (_: Request, res: Response) => {
  res.json(await service.getContainers());
};

export const updateContainer = async (req: Request, res: Response) => {
  res.json(await service.updateContainer(String(req.params.id), req.body));
};

export const deleteContainer = async (req: Request, res: Response) => {
  await service.deleteContainer(String(req.params.id));
  res.json({ message: "Deleted" });
};
