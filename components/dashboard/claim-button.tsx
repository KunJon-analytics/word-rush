"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Icons } from "../shared/icons";

export function ClaimButton({ reward }: { reward: number }) {
  const { pending } = useFormStatus();

  return (
    <Button variant="default" disabled={pending} type="submit">
      {pending ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.pi className="mr-2 h-4 w-4" />
      )}
      {`Claim ${reward}`}
    </Button>
  );
}
