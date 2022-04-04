import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { AppContext } from "./AppContext";
import { Session } from "../entity/Session";

export const isAuth: MiddlewareFn<AppContext> = async ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new Error("Invalid authorization");
  }
  const accessToken = authorization.split(" ")[1];

  const session = await Session.findOne({ accessToken });
  if (!session) {
    throw new Error("Invalid authorization");
  }

  let payload: any = null;
  try {
    payload = verify(accessToken, process.env.ACCESS_SECRET!);
  } catch (e) {
    throw e;
  }
  context.user = session.user;
  context.payload = payload;
  return next();
};
