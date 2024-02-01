import { NonRetriableError } from "inngest";

import { inngest } from "@/inngest/client";
import { finishPiTransaction } from "./finish-pi-transaction";

// Some function we'll call
export const finishClaim = inngest.createFunction(
  { id: "finish-claim-transaction", retries: 0 },
  { event: "payments/tx.finish" },
  async ({ event, step }) => {
    const { paymentId } = event.data;

    // result is typed as a PaymentDTO
    try {
      const result = await step.invoke("send-finish-pi-tx", {
        function: finishPiTransaction,
        data: { paymentId },
      });

      return result;
    } catch (err) {
      // Passing the original error via `cause` enables you to view the error in function logs
      throw new NonRetriableError("Possible timeout error", { cause: err });
    }
  }
);
