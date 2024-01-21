import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { potsConfig } from "@/config/pot";
import { pi } from "@/lib/pi-client";
import { changePotValue } from "../pots/change-value";
import { submitTx } from "./submit-transaction";
import { completeTx } from "./complete-transaction";

export const payClaim = inngest.createFunction(
  { id: "pay-claim" },
  { event: "payments/pay.claim" },
  async ({ event, step }) => {
    // (event) increase user points
    const round = event.data.round;
    const uuid = event.user.uuid;
    const claimAmount = event.data.claimAmount;

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
    // send pay claim event
    const claimTxId = await step.invoke("submit payment", {
      function: submitTx,
      id: `submit-tx-payment-${paymentId}`,
      data: { paymentId: piTx.paymentId },
      user: { uuid },
    });

    // update the pitx with the txid
    const updatedTx = await step.run("update-pi-transaction", () =>
      prisma.piTransaction.update({
        where: { paymentId: piTx.paymentId },
        data: { txId: claimTxId, status: "COMPLETED" },
      })
    );

    // complete the payment
    const completedPayment = await step.invoke("complete payment", {
      function: completeTx,
      id: `complete-tx-payment-${paymentId}`,
      data: { paymentId, txid: updatedTx.txId as string },
      user: { uuid },
    });

    // send reduce pot event
    const pot = await step.invoke("reduce-reward-pot-value", {
      function: changePotValue,
      id: `reduce-reward-pot-${round.id}`,
      data: {
        decrement: completedPayment.amount,
        name: potsConfig.reward.name,
      },
      user: { uuid },
    });
    return { pot, round };
  }
);
