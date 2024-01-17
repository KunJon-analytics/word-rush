import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardProps = React.ComponentProps<typeof Card> & {
  title: string;
  stats: number | string;
};

export async function PlayStatsCard({
  className,
  title,
  stats,
  ...props
}: CardProps) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle className="text-xs uppercase">{title}</CardTitle>
        <CardDescription className="mt-1 text-xl font-medium">
          {stats}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
