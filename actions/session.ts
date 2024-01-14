"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { SessionData, sessionOptions } from "@/lib/session";
import { AuthResult } from "@/types";
import platformAPIClient from "@/lib/platformAPIClient";
import prisma from "@/lib/prisma";

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  return session;
}

export async function logout() {
  // false => no db call for logout
  const session = await getSession();
  session.destroy();
  revalidatePath("/", "layout");
  redirect(`/`);
}

export async function login(auth: AuthResult) {
  const session = await getSession();
  try {
    // Verify the user's access token with the /me endpoint:
    const me = await platformAPIClient.get(`/me`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    // console.log(me);
  } catch (err) {
    console.log("[LOGIN_SERVER]", err);
    console.log(err);
    throw new Error("Invalid access token");
  }

  session.username = auth.user.username;
  session.isLoggedIn = true;
  session.accessToken = auth.accessToken;
  session.uuid = auth.user.uid;
  await prisma.user.upsert({
    where: { uuid: auth.user.uid },
    // select: { uid: true, username: true },
    update: {
      accessToken: auth.accessToken,
    },
    create: {
      uuid: auth.user.uid,
      username: auth.user.username,
      accessToken: auth.accessToken,
    },
  });
  await session.save();
  revalidatePath("/", "layout");
}
