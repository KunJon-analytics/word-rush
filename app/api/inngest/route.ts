import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { createRound } from "@/inngest/functions/rounds/create-round";
import { completeRound } from "@/inngest/functions/rounds/complete-round";
import { changePoints } from "@/inngest/functions/users/change-points";
import { changePotValue } from "@/inngest/functions/pots/change-value";
import { clearIncomplete } from "@/inngest/functions/payments/clear-incomplete";
import { changeTokens } from "@/inngest/functions/users/change-tokens";
import { submitTx } from "@/inngest/functions/payments/submit-transaction";
import { completeTx } from "@/inngest/functions/payments/complete-transaction";
import { clearIncompleteRoutine } from "@/inngest/functions/payments/clear-incomplete-routine";
import { finishClaim } from "@/inngest/functions/payments/finish-claim";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    createRound,
    completeRound,
    changePoints,
    changePotValue,
    clearIncomplete,
    changeTokens,
    submitTx,
    completeTx,
    clearIncompleteRoutine,
    finishClaim,
  ],
});
