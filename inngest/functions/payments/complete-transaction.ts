import { inngest } from "@/inngest/client";
import { pi } from "@/lib/pi-client";
import { getPayment } from "@/lib/platformAPIClient";

// Some function we'll call
export const completeTx = inngest.createFunction(
  { id: "complete-transaction" },
  { event: "payments/tx.complete" },
  async ({ event }) => {
    const { paymentId, txid } = event.data;
    const { data: apiTx } = await getPayment(paymentId);
    if (apiTx.status.developer_completed) {
      return apiTx;
    }
    return pi.completePayment(paymentId, txid);
  }
);
