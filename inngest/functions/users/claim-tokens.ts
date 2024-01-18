import { NonRetriableError } from "inngest";

import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { potsConfig } from "@/config/pot";
import { safeParse } from "@/lib/pi";
import { payClaim } from "../payments/pay-claim";

export const claimTokens = inngest.createFunction(
  { id: "claim-tokens" },
  { event: "users/tokens.claim" },
  async ({ event, step }) => {
    // (event) increase user points
    const round = event.data.round;
    const uuid = event.user.uuid;

    try {
      // increase user tokens, create pi tx with type of claim
      // add purposeid to be round id
      if (round.stage !== "CLAIMED") {
        throw new NonRetriableError("Invalid Round status", {
          cause: `roundId: ${round.id}`,
        });
      }

      // get the reward pot
      const rewardPot = await step.run("get-reward-pot", () =>
        prisma.pot.upsert({
          where: { name: potsConfig.reward.name },
          create: { name: potsConfig.reward.name },
          update: {},
        })
      );

      if (rewardPot.value <= potsConfig.reward.lowerLimit) {
        throw new NonRetriableError("Reward pot at lower limit", {
          cause: `Reward pot at lower limit`,
        });
      }

      const claimAmount = safeParse(rewardPot.value / 24); // the reward pot divided by 24

      // get old payment
      const oldPayment = await step.run("get-old-payment", () =>
        prisma.piTransaction.findFirst({
          where: { purposeId: round.id, type: "CLAIM_REWARD" },
        })
      );

      if (oldPayment?.paymentId) {
        return { error: "Payment already started", pot: rewardPot };
      }

      // send pay claim event
      const claimEvent = await step.invoke("pay-claim-for-round", {
        function: payClaim,
        data: { claimAmount, round },
        user: { uuid },
      });

      return claimEvent;
    } catch (error) {
      throw new Error("Database error", {
        cause: error,
      });
    }
  }
);
