import React from "react";
import { formatDistance } from "date-fns";
import Link from "next/link";

import { Pot } from "@prisma/client";
import { safeParse } from "@/lib/pi";
import { potsConfig } from "@/config/pot";
import ClaimForm from "./claim-form";

interface Props {
  stage: string;
  id: string;
  guesses: number;
  lastPlayed: Date;
  rewardPot: Pot | null;
}

const Round = ({ stage, guesses, lastPlayed, id, rewardPot }: Props) => {
  if (!rewardPot) {
    return null;
  }
  const reward = safeParse(rewardPot.value / 24);
  return (
    <div className="flex cursor-pointer items-center justify-between">
      <div className="flex items-center space-x-3.5">
        <div>
          <p className="font-medium">
            <Link
              href={`/dashboard/rounds/${id}/play`}
            >{`Tries: ${guesses}`}</Link>
          </p>
          <p className="text-xs line-clamp-1">
            {formatDistance(lastPlayed, new Date(), { addSuffix: true })}
          </p>
        </div>
      </div>
      {rewardPot.value > potsConfig.reward.lowerLimit ? (
        <ClaimForm roundId={id} reward={reward} />
      ) : (
        <p className="font-medium">{stage}</p>
      )}
    </div>
  );
};

export default Round;
