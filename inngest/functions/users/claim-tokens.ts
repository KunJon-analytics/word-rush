import { NonRetriableError } from "inngest";

import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { potsConfig } from "@/config/pot";
import { pi } from "@/app/api/payments/incomplete/route";
import { changePotValue } from "../pots/change-value";

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

      const rewardPot = await prisma.pot.upsert({
        where: { name: potsConfig.reward.name },
        create: { name: potsConfig.reward.name },
        update: {},
      });

      if (rewardPot.value <= potsConfig.reward.lowerLimit) {
        throw new NonRetriableError("Reward pot at lower limit", {
          cause: `Reward pot at lower limit`,
        });
      }

      const claimAmount = parseFloat(Number(rewardPot.value / 24).toFixed(2)); // the reward pot divided by 24

      const oldPayment = await prisma.piTransaction.findFirst({
        where: { purposeId: round.id, type: "CLAIM_REWARD" },
      });

      if (oldPayment) {
        throw new NonRetriableError("Payment already created", {
          cause: `paymentId: ${oldPayment.paymentId}`,
        });
      }

      // build Claim Transaction
      const paymentData = {
        amount: claimAmount,
        memo: `reward for Word Rush round: ${round.id}`, //
        metadata: { roundId: round.id },
        uid: uuid,
      };

      //Send Claim Transaction
      const paymentId = await pi.createPayment(paymentData);

      // create pitx that will be checked for to prevent double entry
      const piTx = await prisma.piTransaction.create({
        data: {
          amount: paymentData.amount,
          paymentId,
          purposeId: round.id,
          type: "CLAIM_REWARD",
          payerId: potsConfig.team.admin,
        },
      });

      // save the payment information in the DB

      // it is strongly recommended that you store the txid along with the paymentId you stored earlier for your reference.
      const claimTxId = await pi.submitPayment(paymentId);

      // update the Refund PaymentID with the txid
      await prisma.piTransaction.update({
        where: { paymentId: piTx.paymentId },
        data: { txId: claimTxId, status: "COMPLETED" },
      });

      // complete the payment
      await pi.completePayment(paymentId, claimTxId);

      // send reduce pot event
      const pot = await step.invoke("reduce-reward-pot-value", {
        function: changePotValue,
        data: { decrement: paymentData.amount, name: potsConfig.reward.name },
        user: { uuid },
      });
      return { pot, round };
    } catch (error) {
      throw new Error("Database error", {
        cause: error,
      });
    }
  }
);
