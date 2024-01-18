"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { potsConfig } from "@/config/pot";
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

export const claim = async (formData: FormData) => {
  const roundId = formData.get("roundId");
  if (!roundId) {
    return { success: false, message: "Bad Input" };
  }
  const session = await getSession();
  if (!session.isLoggedIn) {
    return { success: false, message: "Unauthenticated" };
  }
  try {
    const rewardPot = await prisma.pot.upsert({
      where: { name: potsConfig.reward.name },
      create: { name: potsConfig.reward.name },
      update: {},
    });

    if (rewardPot.value <= potsConfig.reward.lowerLimit) {
      return { success: false, message: "Reward pot at lower limit" };
    }
    const claimmableRound = await prisma.huntRound.findUnique({
      where: {
        winnerId: session.uuid,
        stage: "FINISHED",
        id: roundId as string,
      },
    });
    if (!claimmableRound) {
      return { success: false, message: "You have no round to claim" };
    }

    // make claimed
    const claimedRound = await prisma.huntRound.update({
      where: { id: claimmableRound.id },
      data: { stage: "CLAIMED" },
    });

    // send claim event
    await inngest.send({
      name: "users/tokens.claim",
      data: {
        round: claimedRound,
      },
      user: { uuid: session.uuid },
    });
    revalidatePath("/", "layout");
    return { success: true, message: "Transaction successfully sent!!!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error" };
  }
};
