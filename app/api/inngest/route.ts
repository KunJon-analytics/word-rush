import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { createRound } from "@/inngest/functions/rounds/create-round";
import { completeRound } from "@/inngest/functions/rounds/complete-round";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    createRound,
    completeRound,
  ],
});
