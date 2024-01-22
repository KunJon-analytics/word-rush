import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { pi } from "@/lib/pi-client";

// Some function we'll call
export const finishClaim = inngest.createFunction(
  { id: "finish-claim-transaction" },
  { event: "payments/tx.finish" },
  async ({ event, step }) => {
    const { paymentId } = event.data;

    //  submit payment

    const claimTxId = await step.run("submit-claim-payment", () =>
      pi.submitPayment(paymentId)
    );

    // update the pitx with the txid
    await step.run("update-pi-transaction-completed", () =>
      prisma.piTransaction.update({
        where: { paymentId },
        data: { txId: claimTxId, status: "COMPLETED" },
      })
    );

    // complete the payment

    const completedPayment = await step.run("complete-claim-tx", () =>
      pi.completePayment(paymentId, claimTxId)
    );

    return completedPayment;
  }
);
