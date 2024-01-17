import React from "react";

import { cn } from "@/lib/utils";
import { $Enums } from "@prisma/client";

const Stage = ({ stage }: { stage: $Enums.RoundStage }) => {
  return (
    <div className="hidden cursor-pointer items-center space-x-2 sm:flex">
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
    </div>
  );
};

export default Stage;
