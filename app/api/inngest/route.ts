import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { createRound } from "@/inngest/functions/rounds/create-round";
import { completeRound } from "@/inngest/functions/rounds/complete-round";
import { changePoints } from "@/inngest/functions/users/change-points";
import { changePotValue } from "@/inngest/functions/pots/change-value";
import { changeTokens } from "@/inngest/functions/users/change-tokens";
import { clearIncompleteRoutine } from "@/inngest/functions/payments/clear-incomplete-routine";
import { finishClaim } from "@/inngest/functions/payments/finish-claim";

export const runtime = "edge";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    createRound,
    completeRound,
    changePoints,
    changePotValue,
    changeTokens,
    clearIncompleteRoutine,
    finishClaim,
  ],
  streaming: "allow",
});
