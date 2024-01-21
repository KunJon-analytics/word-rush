import { NonRetriableError } from "inngest";

import { inngest } from "@/inngest/client";
import { ClaimTx, PaymentDTO } from "@/types";
import prisma from "@/lib/prisma";
import { potsConfig } from "@/config/pot";
import { pi } from "@/lib/pi-client";
import { changePotValue } from "../pots/change-value";
import { completeTx } from "./complete-transaction";
import { submitTx } from "./submit-transaction";

export const clearIncomplete = inngest.createFunction(
  { id: "clear-incomplete" },
  { cron: "5 * * * *" },
  async ({ step }) => {
    // get incomplete payments
    const incompletePayments = await step.run(
      "get-incomplete-payments",
      () =>
        pi.getIncompleteServerPayments() as unknown as {
          incomplete_server_payments: PaymentDTO<ClaimTx>[];
        }
    );

    const incompleteServerPayments: PaymentDTO<ClaimTx>[] =
      incompletePayments.incomplete_server_payments;

    const incompletePayment = incompleteServerPayments[0];
    if (incompletePayment) {
      // get round
      const round = await step.run("get-incomplete-payment-round", () =>
        prisma.huntRound.findUnique({
          where: { id: incompletePayment.metadata.roundId },
        })
      );

      if (!round) {
        // cancel the payment
        const cancelledPayment = await step.run(
          "cancel-incomplete-payment-with-no-round",
          () => pi.cancelPayment(incompletePayment.identifier)
        );

        throw new NonRetriableError("No round for payment", {
          cause: `No round for payment: ${cancelledPayment.identifier}`,
        });
      }

      const dev_approved = incompletePayment.status.developer_approved;
      const dev_completed = incompletePayment.status.developer_completed;
      const paymentId = incompletePayment.identifier;
      const amount = incompletePayment.amount;
      const user = incompletePayment.user_uid;

      if (dev_approved && !dev_completed) {
        if (
          !!incompletePayment?.transaction?.txid &&
          incompletePayment.transaction?.verified
        ) {
          // complete the payment
          const txid = incompletePayment.transaction.txid;
          // update the pitx with the txid
          await step.run("update-pi-transaction", () =>
            prisma.piTransaction.update({
              where: { paymentId },
              data: { txId: txid, status: "COMPLETED" },
            })
          );

          // complete the payment
          const completedPayment = await step.invoke(
            "complete incomplete payment",
            {
              function: completeTx,
              id: `complete-tx-payment-${paymentId}`,
              data: { paymentId, txid },
            }
          );

          // send reduce pot event
          const pot = await step.invoke("reduce-reward-pot-value", {
            function: changePotValue,
            id: `reduce-reward-pot-${round.id}`,
            data: {
              decrement: amount,
              name: potsConfig.reward.name,
            },
            user: { uuid: user },
          });

          return { pot, round };
        }

        // get or create tx claim
        const piTransaction = await step.run("get-or-create-claim-tx", () =>
          prisma.piTransaction.upsert({
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
          })
        );

        // it is strongly recommended that you store the txid along with the paymentId you stored earlier for your reference.
        const claimTxId = await step.invoke("submit payment", {
          function: submitTx,
          id: `submit-tx-payment-${piTransaction.paymentId}`,
          data: { paymentId: piTransaction.paymentId },
        });

        // update the pitx with the txid
        await step.run("update-claim-tx", () =>
          prisma.piTransaction.update({
            where: { paymentId: piTransaction.paymentId },
            data: { txId: claimTxId, status: "COMPLETED" },
          })
        );

        // complete the payment
        const completedPayment = await step.invoke(
          "complete incomplete payment",
          {
            function: completeTx,
            id: `complete-tx-payment-${paymentId}`,
            data: { paymentId, txid: claimTxId },
          }
        );

        // send reduce pot event
        const pot = await step.invoke("reduce-reward-pot-value", {
          function: changePotValue,
          id: `reduce-reward-pot-${round.id}`,
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
  }
);
