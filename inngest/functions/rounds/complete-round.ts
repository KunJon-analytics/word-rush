import { NonRetriableError } from "inngest";

import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { pointsConfig } from "@/lib/wordle";
import { changePoints } from "../users/change-points";

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
      // check for queued tx
      const queuedRound = await prisma.huntRound.findFirst({
        where: { stage: "QUEUED" },
      });
      if (queuedRound) {
        await prisma.huntRound.update({
          where: { id: queuedRound.id },
          data: { stage: "STARTED" },
        });
      }
      if (!!round.winner?.email) {
        // send email
      }
      // update point change to event..
      const winner = await step.invoke("increase-user-points", {
        function: changePoints,
        data: { increment: pointsConfig.winner },
        user: { uuid },
      });
      return { roundId: round.id, winner: winner.username };
    } catch (error) {
      throw new Error("Database error", {
        cause: error,
      });
    }
  }
);
