import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export const changePotValue = inngest.createFunction(
  { id: "change-pot-value" },
  { event: "pots/value.change" },
  async ({ event }) => {
    // (event) change pot value
    const increment = event.data.increment;
    const decrement = event.data.decrement;
    const name = event.data.name;

    try {
      // update pot value to event..

      const pot = await prisma.pot.upsert({
        where: { name },
        update: { value: { increment, decrement } },
        select: { name: true, value: true },
        create: { name, value: increment },
      });

      return pot;
    } catch (error) {
      throw new Error("Database error", {
        cause: error,
      });
    }
  }
);
