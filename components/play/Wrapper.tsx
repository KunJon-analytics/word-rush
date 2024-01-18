import { formatDistance } from "date-fns";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GameReturnType } from "@/types";
import Stage from "./Stage";

type CardProps = React.ComponentProps<typeof Card> & {
  wordleData: GameReturnType;
};

export async function Wrapper({
  className,
  children,
  wordleData,
  ...props
}: CardProps) {
  return (
    <Card className={(cn(className), "col-span-12 pb-4")} {...props}>
      <CardHeader className="mt-3 flex items-center justify-between px-4 sm:px-5">
        <h2 className="font-medium tracking-wide">Word Rush</h2>

        <div className="flex items-center space-x-4">
          <Stage
            stage={wordleData.round.stage}
            hunters={wordleData.round._count.activities}
            attempts={wordleData.guesses.length}
            start={formatDistance(wordleData.createdAt, new Date(), {
              addSuffix: true,
            })}
            winner={wordleData.round.winner?.username || "No winner"}
          />
        </div>
      </CardHeader>
      <CardContent className="mt-3 grid grid-cols-12">
        <div className="col-span-12 sm:col-span-6 lg:col-span-8">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
