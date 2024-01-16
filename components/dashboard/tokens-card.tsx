import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Subscribe from "../shared/subscribe";
import { getSession } from "@/actions/session";

type CardProps = React.ComponentProps<typeof Card>;

export async function TokensCard({ className, ...props }: CardProps) {
  const { username: subscriber, tokens } = await getSession();
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Tokens</CardTitle>
        <CardDescription>Tokens: Your Key to Challenges!</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-sm font-medium leading-none">{tokens}</p>
      </CardContent>
      <CardFooter>
        <Subscribe subscriber={subscriber} />
      </CardFooter>
    </Card>
  );
}
