import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type CardStats = {
  title: string;
  data: number;
  statsIcon: LucideIcon;
  starColor: string;
};

type CardProps = React.ComponentProps<typeof Card> & CardStats;

export function StatsCard({
  className,
  starColor,
  data,
  statsIcon: Icon,
  title,
  ...props
}: CardProps) {
  return (
    <Card
      className={cn("justify-center items-center p-4.5", className)}
      {...props}
    >
      <CardContent className="flex items-center justify-between mt-4">
        <div>
          <p className="text-base font-semibold">{data}</p>
          <p className="text-xs+ line-clamp-1">{title}</p>
        </div>
        <div
          className={cn(
            "mask is-star flex h-10 w-10 shrink-0 items-center justify-center",
            starColor
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
