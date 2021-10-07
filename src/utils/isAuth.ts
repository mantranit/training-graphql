import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { AppContext } from "./AppContext";

export const isAuth: MiddlewareFn<AppContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new Error("invalid authorization");
  }
  const token = authorization.split(" ")[1];
  let payload: any = null;
  try {
    payload = verify(token, process.env.ACCESS_SECRET!);
  } catch (e) {
    throw e;
  }
  context.payload = payload;
  return next();
};
