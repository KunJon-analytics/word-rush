"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";
import { AuthResult } from "@/types";
import { onIncompletePaymentFound } from "@/lib/pi";
import { login } from "@/actions/session";

import { useToast } from "../ui/use-toast";

import FormButton from "../shared/form-button";

const scopes = ["username", "payments", "wallet_address"];

type SignInFormProps = {
  action: () => Promise<string>;
} & React.ComponentProps<"form">;

export default function SignInForm({ className, action }: SignInFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  return (
    <form
      className={cn("grid items-start gap-4", className)}
      action={async () => {
        try {
          const authResult: AuthResult = await window.Pi.authenticate(
            scopes,
            onIncompletePaymentFound
          );
          await login(authResult);
          const link = await action();
          if (link === "unauthenticated") {
            return toast({
              variant: "destructive",
              title: "Error",
              description: "There was an error!.",
            });
          }
          router.push(`${link}`);
          // toast message
          toast({
            title: "Success",
            description: "Start playing Word Rush.",
          });
        } catch (error) {
          console.log(error);
          // toast error
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            variant: "destructive",
          });
        }
      }}
    >
      <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
        <FormButton />
      </div>
    </form>
  );
}
