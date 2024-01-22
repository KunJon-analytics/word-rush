import { inngest } from "@/inngest/client";
import { pi } from "@/lib/pi-client";
import { getPayment } from "@/lib/platformAPIClient";

// Some function we'll call
export const submitTx = inngest.createFunction(
  { id: "submit-transaction" },
  { event: "payments/tx.submit" },
  async ({ event }) => {
    const paymentId = event.data.paymentId;
    const { data: apiTx } = await getPayment(paymentId);
    if (apiTx.transaction?.verified) {
      return apiTx.transaction.txid;
    }
    return pi.submitPayment(paymentId);
  }
);
