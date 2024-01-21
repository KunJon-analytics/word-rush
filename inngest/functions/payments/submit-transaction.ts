import { inngest } from "@/inngest/client";
import { pi } from "@/lib/pi-client";

// Some function we'll call
export const submitTx = inngest.createFunction(
  { id: "submit-transaction" },
  { event: "payments/tx.submit" },
  async ({ event }) => {
    const paymentId = event.data.paymentId;
    const apiTx = await pi.getPayment(paymentId);
    if (apiTx.transaction?.verified) {
      return apiTx.transaction.txid;
    }
    return pi.submitPayment(paymentId);
  }
);
