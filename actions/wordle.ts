"use server";

import { promises as fs } from "fs";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getWordColor, pointsConfig } from "@/lib/wordle";
import { inngest } from "@/inngest/client";
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
    if (!activeRoundId) {
      return "/dashboard";
    }
    const hunter = await prisma.user.findUnique({
      where: { uuid: session.uuid },
    });
    const activeRoundActivity = await prisma.hunterActivity.findUnique({
      where: {
        activityId: { hunterId: session.uuid, roundId: activeRoundId.id },
      },
    });
    if (!activeRoundActivity && !hunter?.tokens) {
      return "/dashboard";
    }
    return `/dashboard/rounds/${activeRoundId.id}/play`;
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

    const oldActivity = await prisma.hunterActivity.findUnique({
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

    if (oldActivity) {
      return oldActivity;
    }

    if (session.tokens < 1) {
      throw new Error("You have no tokens");
    }

    // send decrease tokens event and update session
    // send claim event
    await inngest.send({
      name: "users/tokens.change",
      data: {
        decrement: 1,
      },
      user: { uuid: session.uuid },
    });

    const activity = await prisma.hunterActivity.create({
      data: { hunterId: session.uuid, roundId: huntRound.id },
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

export async function play(roundId: string, guess: string) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      throw new Error("Unauthorized");
    }

    const currentGuess = guess.toLowerCase();

    if (currentGuess.length !== 5) {
      throw new Error("Word must be 5 chars!");
    }

    const hunterActivity = await prisma.hunterActivity.findUnique({
      where: { activityId: { hunterId: session.uuid, roundId } },
      include: { guesses: true, round: true, hunter: true },
    });

    if (!hunterActivity) {
      throw new Error("No Game Round");
    }

    const history = hunterActivity.guesses.map((guess) => guess.guess);

    if (history.length > 6) {
      throw new Error("You used all your guesses!");
    }

    const correctGuess = hunterActivity.guesses.find(
      (guess) => guess.isCorrect
    );
    if (correctGuess) {
      throw new Error("You already won this round");
    }

    const solution = hunterActivity.round.word.toLowerCase();

    if (history.includes(solution)) {
      throw new Error("You already completed this round");
    }

    if (history.includes(currentGuess)) {
      throw new Error("You already tried that word!");
    }

    const isCorrect = currentGuess === solution;

    const color = getWordColor(currentGuess, solution);

    // add guess and connect to activity
    await prisma.activityGuess.create({
      data: {
        guess: currentGuess,
        index: hunterActivity.guesses.length,
        activityId: hunterActivity.id,
        isCorrect,
        color,
      },
    });

    // if is correct and game is started add player as winner
    if (isCorrect && hunterActivity.round.stage === "STARTED") {
      const updatedRound = await prisma.huntRound.update({
        where: { id: roundId },
        data: { stage: "FINISHED", winnerId: session.uuid },
      });
      // (event) send mail to winner and check for queued, change to started, add winner point
      // Send your event payload to Inngest
      await inngest.send({
        name: "rounds/round.completed",
        data: {
          roundId: updatedRound.id,
        },
        user: { uuid: session.uuid },
      });
    }

    // (event) add point for activity, add logic for iscorrect and only finished games eligible
    if (isCorrect) {
      // send add point event
      await inngest.send({
        name: "users/point.change",
        data: {
          increment: pointsConfig.success,
        },
        user: { uuid: session.uuid },
      });
    }

    if (!isCorrect && history.length === 5) {
      // send add point event
      await inngest.send({
        name: "users/point.change",
        data: {
          increment: pointsConfig.failed,
        },
        user: { uuid: session.uuid },
      });
    }
    session.tokens = hunterActivity.hunter.tokens;
    await session.save();
    revalidatePath("/", "layout");
  } catch (error) {
    console.log("[PLAY_GAME]", error);
    throw new Error("Internal Error");
  }
}
