"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { potsConfig } from "@/config/pot";
import { getSession } from "./session";
import { safeParse } from "@/lib/pi";
import { pi } from "@/lib/pi-client";

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

    const claimAmount = safeParse(rewardPot.value / 24); // the reward pot divided by 24

    // get old payment
    const oldPayment = await prisma.piTransaction.findFirst({
      where: { purposeId: claimedRound.id, type: "CLAIM_REWARD" },
    });

    if (oldPayment?.paymentId) {
      return { success: false, message: "Payment already started" };
    }

    if (!claimedRound?.winnerId) {
      return { success: false, message: "No winner yet for round" };
    }

    // build Claim Transaction
    const paymentData = {
      amount: claimAmount,
      memo: `reward for Word Rush round`, //
      metadata: { roundId: claimedRound.id },
      uid: claimedRound.winnerId,
    };

    //Send Claim Transaction
    const paymentId = await pi.createPayment(paymentData);

    // create pitx that will be checked for to prevent double entry
    const piTx = await prisma.piTransaction.create({
      data: {
        amount: paymentData.amount,
        paymentId,
        purposeId: claimedRound.id,
        type: "CLAIM_REWARD",
        payerId: claimedRound.winnerId,
      },
    });

    // it is strongly recommended that you store the txid along with the paymentId you stored earlier for your reference.
    // send finish tx event
    await inngest.send({
      name: "payments/tx.finish",
      id: `finish-claim-tx-${roundId}`,
      data: {
        paymentId,
      },
      user: { uuid: session.uuid },
    });

    // send reduce pot event
    await inngest.send({
      name: "pots/value.change",
      id: `reduce-reward-pot-${roundId}`,
      data: {
        decrement: piTx.amount,
        name: potsConfig.reward.name,
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
