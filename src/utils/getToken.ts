import { sign } from "jsonwebtoken";

export const getAccessToken = (userId: number) => {
  return sign({ userId }, process.env.ACCESS_SECRET!, { expiresIn: "5s" });
};

export const getRefreshToken = (userId: number) => {
  return sign({ userId }, process.env.REFRESH_SECRET!, { expiresIn: "7d" });
};
