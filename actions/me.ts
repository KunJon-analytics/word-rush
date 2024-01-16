"use server";

import prisma from "@/lib/prisma";
import { getSession } from "./session";

export const getMe = async () => {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthenticated");
  }
  try {
    const me = await prisma.user.findUnique({
      where: { uuid: session.uuid },
      include: {
        activities: { include: { guesses: true, round: true } },
        _count: true,
      },
    });
    return me;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
};
