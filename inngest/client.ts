import { EventSchemas, Inngest } from "inngest";

import { HuntRound } from "@prisma/client";

type RoundComplete = {
  data: {
    roundId: string;
  };
  user: {
    uuid: string;
  };
};

type ChangePoints = {
  data: {
    increment?: number;
    decrement?: number;
  };
  user: {
    uuid: string;
  };
};

type ClaimTokens = {
  data: {
    round: HuntRound;
  };
  user: {
    uuid: string;
  };
};

type ChangePotValue = {
  data: {
    name: string;
    increment?: number;
    decrement?: number;
  };
  user: {
    uuid: string;
  };
};

type Events = {
  "rounds/round.completed": RoundComplete;
  "users/point.change": ChangePoints;
  "users/tokens.claim": ClaimTokens;
  "pots/value.change": ChangePotValue;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "word-rush",
  schemas: new EventSchemas().fromRecord<Events>(),
});
