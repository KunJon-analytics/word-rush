import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeReturnType } from "@/types";
import Round from "./round";

export function RecentRounds({ me }: { me: MeReturnType }) {
  const sortedActivites = me.activities.sort((a, b) => {
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });
  return (
    <Card className="px-4 pb-4 sm:px-5">
      <CardHeader className="my-3 flex h-8 items-center justify-between">
        <CardTitle className="font-medium tracking-wide">
          Recent Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-10 space-y-3.5">
        {sortedActivites.slice(0, 4).map((activity) => (
          <Round
            guesses={activity.guesses.length}
            key={activity.id}
            id={activity.roundId}
            stage={activity.round.stage}
            lastPlayed={activity.updatedAt}
          />
        ))}
      </CardContent>
    </Card>
  );
}
