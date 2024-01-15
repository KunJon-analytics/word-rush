"use server";

import { promises as fs } from "fs";

import prisma from "@/lib/prisma";
import { getSession } from "./session";

export const getRandomWord = async () => {
  try {
    const file = await fs.readFile(process.cwd() + "/lib/words.txt", "utf8");
    const wordsList = file.split("\r\n");
    const word = wordsList[Math.floor(Math.random() * wordsList.length)];
    if (word.length !== 5) {
      return "jerry";
    }
    return word;
  } catch (error) {
    console.log(error);
  }
};

export const getActiveRound = async () => {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return "unauthenticated";
  }
  try {
    const activeRoundId = await prisma.huntRound.findFirst({
      where: { stage: "STARTED" },
      select: { id: true },
    });
    return activeRoundId
      ? `/dashboard/rounds/${activeRoundId.id}/play`
      : "/dashboard";
  } catch (error) {
    console.log(error);
    return "/dashboard";
  }
};
