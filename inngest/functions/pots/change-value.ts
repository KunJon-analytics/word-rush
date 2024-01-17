import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export const changePotValue = inngest.createFunction(
  { id: "complete-round" },
  { event: "pots/value.change" },
  async ({ event }) => {
    // (event) change pot value
    const increment = event.data.increment;
    const decrement = event.data.decrement;
    const name = event.data.name;

    try {
      // update pot value to event..

      const pot = await prisma.pot.update({
        where: { name },
        data: { value: { increment, decrement } },
        select: { name: true, value: true },
      });

      return pot;
    } catch (error) {
      throw new Error("Database error", {
        cause: error,
      });
    }
  }
);
