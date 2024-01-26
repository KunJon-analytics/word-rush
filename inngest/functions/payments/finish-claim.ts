import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { pi } from "@/lib/pi-client";
import { submitTx } from "./submit-transaction";

// Some function we'll call
export const finishClaim = inngest.createFunction(
  { id: "finish-claim-transaction" },
  { event: "payments/tx.finish" },
  async ({ event, step }) => {
    const { paymentId } = event.data;

    //  submit payment

    const claimTxId = await step.invoke("submit-claim-payment", {
      function: submitTx,
      data: { paymentId }, // input data is typed, requiring input if it's needed
    });

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
