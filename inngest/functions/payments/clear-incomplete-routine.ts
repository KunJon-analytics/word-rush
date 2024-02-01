import { inngest } from "@/inngest/client";

import { clearIncomplete } from "../aws/clear-incomplete";

// Some function we'll call
export const clearIncompleteRoutine = inngest.createFunction(
  { id: "clear-incomplete-routine" },
  { cron: "5 * * * *" },
  async ({ step }) => {
    return await step.invoke("clear all incomplete payments", {
      function: clearIncomplete,
    });
  }
);
