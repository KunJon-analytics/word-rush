import { NonRetriableError } from "inngest";

import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { HuntRound } from "@prisma/client";
import { getRandomWord } from "@/actions/wordle";

export const createRound = inngest.createFunction(
  { id: "round-create" },
  { cron: "0 * * * *" },
  async ({ event, step }) => {
    try {
      const word = await getRandomWord();
      if (!word) {
        throw new NonRetriableError("Error while fetching word", {
          cause: `getRandomWord()`,
        });
      }
      let round: HuntRound;
      const activeRound = await prisma.huntRound.findFirst({
        where: { stage: "STARTED" },
      });
      if (activeRound) {
        round = await prisma.huntRound.create({
          data: { word, stage: "QUEUED" },
        });
      } else {
        round = await prisma.huntRound.create({
          data: { word, stage: "STARTED" },
        });
      }

      return round;
    } catch (error) {
      console.error(error);
      throw new Error("Axios / Database error", {
        cause: error,
      });
    }
  }
);
