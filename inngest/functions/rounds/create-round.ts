import { inngest } from "@/inngest/client";
import { HuntRound } from "@prisma/client";
import { env } from "@/env.mjs";
import prismaEdge from "@/lib/prisma-edge";

export const createRound = inngest.createFunction(
  { id: "round-create" },
  { cron: "0 * * * *" },
  async () => {
    try {
      const wordnikApiUrl = `https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=5&api_key=${env.WORDNIK_API_KEY}`;

      const res = await fetch(wordnikApiUrl);
      // The return value is *not* serialized
      // You can return Date, Map, Set, etc.

      if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
      }

      const { word } = await res.json();

      let round: HuntRound;
      const activeRound = await prismaEdge.huntRound.findFirst({
        where: { stage: "STARTED" },
      });
      if (activeRound) {
        round = await prismaEdge.huntRound.create({
          data: { word, stage: "QUEUED" },
        });
      } else {
        round = await prismaEdge.huntRound.create({
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
