import { EventSchemas, Inngest } from "inngest";

type RoundComplete = {
  data: {
    roundId: string;
  };
  user: {
    uuid: string;
  };
};

type IncreasePoints = {
  data: {
    increment: number;
  };
  user: {
    uuid: string;
  };
};

type Events = {
  "rounds/round.completed": RoundComplete;
  "users/point.increased": IncreasePoints;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "word-rush",
  schemas: new EventSchemas().fromRecord<Events>(),
});
