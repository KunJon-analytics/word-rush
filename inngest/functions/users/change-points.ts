import { inngest } from "@/inngest/client";
import prismaEdge from "@/lib/prisma-edge";

export const changePoints = inngest.createFunction(
  { id: "increase-points" },
  { event: "users/point.change" },
  async ({ event }) => {
    // (event) change user points
    const increment = event.data.increment;
    const decrement = event.data.decrement;
    const uuid = event.user.uuid;

    try {
      // update point change to event..
      const user = await prismaEdge.user.update({
        where: { uuid },
        data: { points: { increment, decrement } },
        select: { points: true, username: true },
      });
      return user;
    } catch (error) {
      throw new Error("Database error", {
        cause: error,
      });
    }
  }
);
