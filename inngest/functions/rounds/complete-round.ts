import { NonRetriableError } from "inngest";

import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { pointsConfig } from "@/lib/wordle";

export const completeRound = inngest.createFunction(
  { id: "complete-round" },
  { event: "rounds/round.completed" },
  async ({ event, step }) => {
    // (event) send mail to winner and check for queued, change to started, add winner/referrer point
    const roundId = event.data.roundId;
    const uuid = event.user.uuid;

    try {
      const round = await prisma.huntRound.findUnique({
        where: { id: roundId, winnerId: uuid },
        include: { winner: true },
      });
      if (round?.stage !== "FINISHED") {
        throw new NonRetriableError("Invalid Round status", {
          cause: `roundId: ${roundId}`,
        });
      }
      if (!!round.winner?.email) {
        // send email
      }
      // check for queued tx
      const queuedRound = await prisma.huntRound.findFirst({
        where: { stage: "QUEUED" },
      });
      if (queuedRound) {
        await prisma.huntRound.update({
          where: { id: queuedRound.id },
          data: { stage: "STARTED" },
        });
        // maybe reload layout??
      }
      // update point change to event..
      await prisma.user.update({
        where: { uuid },
        data: { points: { increment: pointsConfig.winner } },
      });
    } catch (error) {
      throw new Error("Database error", {
        cause: error,
      });
    }
  }
);
