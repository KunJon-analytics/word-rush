import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/actions/session";
import Subscribe from "../shared/subscribe";
import { DonateDialog } from "../shared/donate";

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
      <CardFooter className="flex lg:flex-col justify-between lg:space-y-4">
        <Subscribe subscriber={subscriber} />
        <DonateDialog />
      </CardFooter>
    </Card>
  );
}
