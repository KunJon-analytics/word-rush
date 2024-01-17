import { formatDistance } from "date-fns";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GameReturnType } from "@/types";
import { getSession } from "@/actions/session";
import Stage from "./Stage";
import Subscribe from "../shared/subscribe";
import { PlayStatsCard } from "./PlayStatsCard";

type CardProps = React.ComponentProps<typeof Card> & {
  wordleData: GameReturnType;
};

export async function Wrapper({
  className,
  children,
  wordleData,
  ...props
}: CardProps) {
  const { username: subscriber } = await getSession();
  return (
    <Card className={(cn(className), "col-span-12 pb-4")} {...props}>
      <CardHeader className="mt-3 flex items-center justify-between px-4 sm:px-5">
        <h2 className="font-medium tracking-wide">Word Rush</h2>

        <div className="flex items-center space-x-4">
          <Stage stage={wordleData.round.stage} />
        </div>
      </CardHeader>
      <CardContent className="mt-3 grid grid-cols-12">
        <div className="col-span-12 px-4 sm:col-span-6 sm:px-5 lg:col-span-4">
          <Subscribe subscriber={subscriber} />
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8">
            <PlayStatsCard
              title="Hunters"
              stats={wordleData.round._count.activities}
            />
            <PlayStatsCard title="Attempts" stats={wordleData.guesses.length} />
            <PlayStatsCard
              title="Winner"
              stats={`${wordleData.round.winner?.username || "No winner"}`}
            />
            <PlayStatsCard
              stats={formatDistance(wordleData.createdAt, new Date(), {
                addSuffix: true,
              })}
              title="Hunt Start"
            />
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-8">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
