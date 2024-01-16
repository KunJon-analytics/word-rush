import { Gem } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardProps = React.ComponentProps<typeof Card> & { tokens: number };

export function TokensCard({ className, tokens, ...props }: CardProps) {
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
        <Button className="w-full">
          <Gem className="mr-2 h-4 w-4" /> Get More Tokens
        </Button>
      </CardFooter>
    </Card>
  );
}
