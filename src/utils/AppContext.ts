import { Request, Response } from "express";

export class AppContext {
  req: Request;
  res: Response;
  payload: { userId: number };
}
