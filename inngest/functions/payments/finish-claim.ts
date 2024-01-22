import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { completeTx } from "./complete-transaction";
import { submitTx } from "./submit-transaction";

// Some function we'll call
export const finishClaim = inngest.createFunction(
  { id: "finish-claim-transaction" },
  { event: "payments/tx.finish" },
  async ({ event, step }) => {
    const { paymentId } = event.data;

    // Sleep for 1 minute
    await step.sleep("sleep-before-submit-payment", "1m");

    //  submit payment
    const claimTxId = await step.invoke("submit payment", {
      function: submitTx,
      id: `submit-tx-payment-${paymentId}`,
      data: { paymentId },
    });

    // update the pitx with the txid
    await step.run("update-pi-transaction-completed", () =>
      prisma.piTransaction.update({
        where: { paymentId },
        data: { txId: claimTxId, status: "COMPLETED" },
      })
    );

    // Sleep for 1 minute
    await step.sleep("sleep-before-complete-payment", "1m");

    // complete the payment
    const completedPayment = await step.invoke("complete-claim-tx", {
      function: completeTx,
      id: `complete-tx-payment-${paymentId}`,
      data: { paymentId, txid: claimTxId },
    });

    return completedPayment;
  }
);
