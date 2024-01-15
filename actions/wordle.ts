"use server";

import { promises as fs } from "fs";

import prisma from "@/lib/prisma";
import { getSession } from "./session";
import { notFound } from "next/navigation";
import { GameReturnType } from "@/types";

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

export const getRoundData = async (roundId: string) => {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      throw new Error("Unauthenticated");
    }

    const huntRound = await prisma.huntRound.findUnique({
      where: { id: roundId },
    });

    if (!huntRound) {
      throw new Error("No game round");
    }

    const activity: GameReturnType = await prisma.hunterActivity.upsert({
      create: { hunterId: session.uuid, roundId: huntRound.id },
      update: {},
      where: {
        activityId: { hunterId: session.uuid, roundId: huntRound.id },
      },
      include: {
        guesses: true,
        round: {
          select: {
            _count: true,
            createdAt: true,
            id: true,
            stage: true,
            updatedAt: true,
            winner: { select: { username: true } },
          },
        },
      },
    });

    return activity;
  } catch (error) {
    console.log("[GET_GAME]", error);
    throw new Error("Internal Error");
  }
};
