import React from "react";

import { cn } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import StatsPopover from "./StatsPopover";

interface StageProps {
  hunters: number;
  attempts: number;
  winner: string;
  start: string;
  stage: $Enums.RoundStage;
}

const Stage = ({ stage, attempts, hunters, start, winner }: StageProps) => {
  return (
    <div className="cursor-pointer items-center space-x-2 flex">
      <div
        className={cn(
          "h-3 w-3 rounded-full",
          stage === "STARTED" && "bg-blue-500",
          stage === "CLAIMED" && "bg-green-500",
          stage === "FINISHED" && "bg-yellow-500",
          stage === "QUEUED" && "bg-red-500"
        )}
      ></div>
      <p>{stage}</p>
      <StatsPopover
        attempts={attempts}
        hunters={hunters}
        start={start}
        winner={winner}
      />
    </div>
  );
};

export default Stage;
