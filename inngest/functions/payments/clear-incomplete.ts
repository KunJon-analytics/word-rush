import { inngest } from "@/inngest/client";
import { pi } from "@/app/api/payments/incomplete/route";
import { ClaimTx, PaymentDTO } from "@/types";
import prisma from "@/lib/prisma";
import { potsConfig } from "@/config/pot";
import { changePotValue } from "../pots/change-value";

export const clearIncomplete = inngest.createFunction(
  { id: "clear-incomplete" },
  { cron: "5 * * * *" },
  async ({ step }) => {
    try {
      // then loop through the payments
      const incompletePayments =
        (await pi.getIncompleteServerPayments()) as unknown as {
          incomplete_server_payments: PaymentDTO<ClaimTx>[];
        };
      const incompleteServerPayments: PaymentDTO<ClaimTx>[] =
        incompletePayments.incomplete_server_payments;

      const incompletePayment = incompleteServerPayments[0];
      if (incompletePayment) {
        const round = await prisma.huntRound.findUnique({
          where: { id: incompletePayment.metadata.roundId },
        });

        const dev_approved = incompletePayment.status.developer_approved;
        const dev_completed = incompletePayment.status.developer_completed;
        const paymentId = incompletePayment.identifier;
        const amount = incompletePayment.amount;
        const user = incompletePayment.user_uid;

        if (dev_approved && !dev_completed) {
          const piTransaction = await prisma.piTransaction.upsert({
            where: {
              paymentId,
              purposeId: incompletePayment.metadata.roundId,
            },
            create: {
              paymentId,
              purposeId: incompletePayment.metadata.roundId,
              amount,
              type: "CLAIM_REWARD",
              payerId: user,
            },
            update: {},
          });
          // save the payment information in the DB

          // it is strongly recommended that you store the txid along with the paymentId you stored earlier for your reference.
          const claimTxId = await pi.submitPayment(paymentId);

          // update the Refund PaymentID with the txid
          await prisma.piTransaction.update({
            where: { paymentId: piTransaction.paymentId },
            data: { txId: claimTxId, status: "COMPLETED" },
          });

          // complete the payment
          await pi.completePayment(paymentId, claimTxId);

          // send reduce pot event
          const pot = await step.invoke("reduce-reward-pot-value", {
            function: changePotValue,
            data: {
              decrement: amount,
              name: potsConfig.reward.name,
            },
            user: { uuid: user },
          });
          return { pot, round };
        }

        if (dev_completed && incompletePayment.transaction?.verified) {
          // complete the payment
          await pi.completePayment(
            paymentId,
            incompletePayment.transaction.txid
          );

          // send reduce pot event
          const pot = await step.invoke("reduce-reward-pot-value", {
            function: changePotValue,
            data: {
              decrement: amount,
              name: potsConfig.reward.name,
            },
            user: { uuid: user },
          });

          return { pot, round };
        }

        const cancelledPayment = await pi.cancelPayment(paymentId);
        return { cancelledPayment };
      }

      return incompletePayments;
    } catch (error) {
      console.error(error);
      throw new Error("Axios / Database error", {
        cause: error,
      });
    }
  }
);