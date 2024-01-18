import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { potsConfig } from "@/config/pot";
import { pi } from "@/app/api/payments/incomplete/route";
import { changePotValue } from "../pots/change-value";

export const payClaim = inngest.createFunction(
  { id: "pay-claim" },
  { event: "payments/pay.claim" },
  async ({ event, step }) => {
    // (event) increase user points
    const round = event.data.round;
    const uuid = event.user.uuid;
    const claimAmount = event.data.claimAmount;

    try {
      // build Claim Transaction
      const paymentData = {
        amount: claimAmount,
        memo: `reward for Word Rush round`, //
        metadata: { roundId: round.id },
        uid: uuid,
      };

      //Send Claim Transaction
      const paymentId = await step.run("create-payment", () =>
        pi.createPayment(paymentData)
      );

      // create pitx that will be checked for to prevent double entry
      const piTx = await step.run("create-pi-transaction", () =>
        prisma.piTransaction.create({
          data: {
            amount: paymentData.amount,
            paymentId,
            purposeId: round.id,
            type: "CLAIM_REWARD",
            payerId: uuid,
          },
        })
      );

      // it is strongly recommended that you store the txid along with the paymentId you stored earlier for your reference.
      const claimTxId = await step.run("submit-payment", () =>
        pi.submitPayment(paymentId)
      );

      // update the pitx with the txid
      await step.run("update-pi-transaction", () =>
        prisma.piTransaction.update({
          where: { paymentId: piTx.paymentId },
          data: { txId: claimTxId, status: "COMPLETED" },
        })
      );

      // complete the payment
      await step.run("create-payment", () =>
        pi.completePayment(paymentId, claimTxId)
      );

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
