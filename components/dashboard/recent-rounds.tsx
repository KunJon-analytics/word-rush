import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MeReturnType } from "@/types";
import { getSession } from "@/actions/session";
import { getRewardPot } from "@/actions/pots";
import Round from "./round";

export async function RecentRounds({ me }: { me: MeReturnType }) {
  const rewardPot = await getRewardPot();
  const session = await getSession();
  const sortedActivites = me.activities
    .filter((activity) => {
      return (
        activity.round.winnerId === session.uuid &&
        activity.round.stage === "FINISHED"
      );
    })
    .sort((a, b) => {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  return (
    <Card className="px-4 pb-4 sm:px-5">
      <CardHeader className="my-3 flex h-8 items-center justify-between">
        <CardTitle className="font-medium tracking-wide">
          Claim your wins
        </CardTitle>
        {!sortedActivites.length && (
          <CardDescription>You have no unclaimmed wins</CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-10 space-y-3.5">
        {sortedActivites.slice(0, 4).map((activity) => (
          <Round
            guesses={activity.guesses.length}
            key={activity.id}
            id={activity.roundId}
            stage={activity.round.stage}
            lastPlayed={activity.updatedAt}
            rewardPot={rewardPot}
          />
        ))}
      </CardContent>
    </Card>
  );
}
