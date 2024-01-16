import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export const increasePoints = inngest.createFunction(
  { id: "increase-points" },
  { event: "users/point.increased" },
  async ({ event }) => {
    // (event) increase user points
    const increment = event.data.increment;
    const uuid = event.user.uuid;

    try {
      // update point change to event..
      const user = await prisma.user.update({
        where: { uuid },
        data: { points: { increment } },
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
