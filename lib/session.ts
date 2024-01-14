import { SessionOptions } from "iron-session";

export const authCookieName = "word-rush-session";

export interface SessionData {
  username: string;
  isLoggedIn: boolean;
  uuid: string;
  accessToken: string;
}

export const defaultSession: SessionData = {
  username: "",
  isLoggedIn: false,
  uuid: "",
  accessToken: "",
};

export const sessionOptions: SessionOptions = {
  password: process.env.COOKIE_PASSWORD as string,
  cookieName: authCookieName,
  ttl: 35000,
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite#lax
  },
};
