import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export const changeTokens = inngest.createFunction(
  { id: "change-tokens" },
  { event: "users/tokens.change" },
  async ({ event }) => {
    // (event) change user points
    const increment = event.data.increment;
    const decrement = event.data.decrement;
    const uuid = event.user.uuid;

    try {
      // update point change to event..
      const user = await prisma.user.update({
        where: { uuid },
        data: { tokens: { increment, decrement } },
        select: { tokens: true, username: true },
      });
      return user;
    } catch (error) {
      throw new Error("Database error", {
        cause: error,
      });
    }
  }
);
