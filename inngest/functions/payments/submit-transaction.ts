import { inngest } from "@/inngest/client";
import { pi } from "@/lib/pi-client";
import { getPayment } from "@/lib/platformAPIClient";

// Some function we'll call
export const submitTx = inngest.createFunction(
  { id: "submit-transaction" },
  { event: "payments/tx.submit" },
  async ({ event, step }) => {
    const { paymentId } = event.data;

    await step.sleep("wait-for-20-secs", "20s");

    const { data: apiTx } = await getPayment(paymentId);

    if (apiTx.transaction?.txid) {
      return apiTx.transaction.txid;
    }

    return pi.submitPayment(paymentId);
  }
);
