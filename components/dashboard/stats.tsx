import React from "react";
import { ArrowLeftRight, Gamepad2, Medal, Trophy } from "lucide-react";

import { MeReturnType } from "@/types";
import { TokensCard } from "./tokens-card";
import { StatsCard } from "./stats-card";

const Stats = ({ me }: { me: MeReturnType }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
      <TokensCard tokens={me.tokens} />
      <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-2 sm:gap-5 lg:gap-6">
        <StatsCard
          starColor="bg-green-600"
          data={me.points}
          statsIcon={Medal}
          title="Points"
        />
        <StatsCard
          starColor="bg-purple-600"
          data={me._count.activities}
          statsIcon={Gamepad2}
          title="Rounds Played"
        />
        <StatsCard
          starColor="bg-blue-600"
          data={me._count.roundsWon}
          statsIcon={Trophy}
          title="Rounds Won"
        />
        <StatsCard
          starColor="bg-yellow-600"
          data={me._count.transactions}
          statsIcon={ArrowLeftRight}
          title="Transactions"
        />
      </div>
    </div>
  );
};

export default Stats;
