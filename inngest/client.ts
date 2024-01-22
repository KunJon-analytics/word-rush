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

type ChangeTokens = {
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

type SubmitTx = {
  data: {
    paymentId: string;
  };
};

type FinishClaim = {
  data: {
    paymentId: string;
  };
};

type CompleteTx = {
  data: {
    paymentId: string;
    txid: string;
  };
};

type PayClaim = {
  data: {
    round: HuntRound;
    claimAmount: number;
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
  "users/tokens.change": ChangeTokens;
  "users/tokens.claim": ClaimTokens;
  "pots/value.change": ChangePotValue;
  "payments/pay.claim": PayClaim;
  "payments/tx.submit": SubmitTx;
  "payments/tx.complete": CompleteTx;
  "payments/incomplete.clear": {};
  "payments/tx.finish": FinishClaim;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "word-rush",
  schemas: new EventSchemas().fromRecord<Events>(),
});
