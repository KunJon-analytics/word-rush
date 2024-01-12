import { IronSession } from "iron-session";

import { SessionData } from "./session";

const getSessionUser = (session: IronSession<SessionData>) => {
  const { accessToken, isLoggedIn, profileId, username, uuid } = session;
  return { accessToken, isLoggedIn, profileId, username, uuid };
};

export default getSessionUser;
