"use server";

import prisma from "@/lib/prisma";
import { getSession } from "./session";
import { inngest } from "@/inngest/client";
import { potsConfig } from "@/config/pot";

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

export const claim = async (roundId: string) => {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthenticated");
  }
  try {
    const rewardPot = await prisma.pot.upsert({
      where: { name: potsConfig.reward.name },
      create: { name: potsConfig.reward.name },
      update: {},
    });

    if (rewardPot.value <= potsConfig.reward.lowerLimit) {
      throw new Error("Reward pot at lower limit");
    }
    const claimmableRound = await prisma.huntRound.findUnique({
      where: { winnerId: session.uuid, stage: "FINISHED", id: roundId },
    });
    if (!claimmableRound) {
      throw new Error("You have no round to claim");
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
    return { success: true, message: "Transaction successfully sent!!!" };
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
};
