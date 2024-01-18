"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { claim } from "@/actions/me";
import { ClaimButton } from "./claim-button";
import { useToast } from "../ui/use-toast";

const ClaimForm = ({
  roundId,
  reward,
}: {
  roundId: string;
  reward: number;
}) => {
  const { toast } = useToast();
  const router = useRouter();

  return (
    <form
      action={async (formData) => {
        const result = await claim(formData);
        if (result.success) {
          toast({ title: "Success", description: result.message });
          router.refresh();
        } else {
          toast({
            title: "Uh oh! Something went wrong.",
            description: `${result.message}`,
            variant: "destructive",
          });
        }
      }}
    >
      <input type="hidden" name="roundId" value={roundId} />
      <ClaimButton reward={reward} />
    </form>
  );
};

export default ClaimForm;
