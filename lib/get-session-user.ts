import { IronSession } from "iron-session";

import { SessionData } from "./session";

const getSessionUser = (session: IronSession<SessionData>) => {
  const { accessToken, isLoggedIn, username, uuid, tokens } = session;
  return { accessToken, isLoggedIn, username, uuid, tokens };
};

export default getSessionUser;
