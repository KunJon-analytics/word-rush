import { env } from "@/env.mjs";
import { SessionOptions } from "iron-session";

export const authCookieName = "word-rush-session";

export interface SessionData {
  username: string;
  isLoggedIn: boolean;
  uuid: string;
  accessToken: string;
  tokens: number;
}

export const defaultSession: SessionData = {
  username: "",
  isLoggedIn: false,
  uuid: "",
  accessToken: "",
  tokens: 0,
};

export const sessionOptions: SessionOptions = {
  password: env.COOKIE_PASSWORD,
  cookieName: authCookieName,
  ttl: 35000,
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: process.env.NODE_ENV === "production",
    maxAge: undefined,

    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none", // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite#lax
  },
};
