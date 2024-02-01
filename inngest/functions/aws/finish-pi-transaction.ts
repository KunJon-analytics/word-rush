import { z } from "zod";
import { referenceFunction } from "inngest";

// Create a reference to a function in another application
export const finishPiTransaction = referenceFunction({
  appId: "aws-word-rush",
  functionId: "finish-pi-transaction",
  // Schemas are optional, but provide types for your call if specified
  schemas: {
    data: z.object({
      paymentId: z.string(),
    }),
    return: z.object({
      identifier: z.string(),
    }),
  },
});
