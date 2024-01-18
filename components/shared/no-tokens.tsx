import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function NoTokensAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Uh-oh! It looks like you&apos;re out of tokens. You can acquire them by
        subscribing. Let the word hunt continue!
      </AlertDescription>
    </Alert>
  );
}
