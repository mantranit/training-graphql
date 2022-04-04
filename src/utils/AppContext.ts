import { Request, Response } from "express";
import { User } from "../entity/User";

export class AppContext {
  req: Request;
  res: Response;
  payload: { userId: number };
  user: User;
}
