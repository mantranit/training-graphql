import { sign } from "jsonwebtoken";

export const getAccessToken = (userId: string) => {
  return sign({ userId }, process.env.ACCESS_SECRET!, { expiresIn: process.env.EXPIRES_IN || '7d' });
};

export const getRefreshToken = (userId: string) => {
  return sign({ userId }, process.env.REFRESH_SECRET!, { expiresIn: "30d" });
};
