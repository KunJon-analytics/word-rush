"use client";

import { Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DonateTx } from "@/types";
import { minPiSupport, supportCallbacks } from "@/lib/support";
import { logout } from "@/actions/session";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";

const FormSchema = z.object({
  amount: z
    .number({ required_error: "Amount is required" })
    .positive({ message: "Amount must be positive" })
    .or(z.string())
    .pipe(
      z.coerce
        .number({ required_error: "Amount is required" })
        .positive({ message: "Amount must be positive" })
        .gte(minPiSupport, {
          message: `Amount must not be less than ${minPiSupport}`,
        })
    ),
});

export function DonateForm({ donor }: { donor: string }) {
  const defaultValues = {
    amount: 1.0,
  };

  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const supportAmount = data.amount;
    try {
      const paymentData: {
        amount: number;
        memo: string;
        metadata: DonateTx;
      } = {
        amount: supportAmount,
        memo: `Support Word Rush with π${supportAmount}`,
        metadata: { donor },
      };

      const payment = await window.Pi.createPayment(
        paymentData,
        supportCallbacks
      );
      console.log({ payment });
    } catch (error) {
      console.log("subscribe ERROR", { error });
      if (error instanceof Error) {
        // Inside this block, err is known to be a Error
        if (
          error.message === 'Cannot create a payment without "payments" scope'
        ) {
          await logout();
          toast({
            title: "Uh oh! Something went wrong.",
            description: "Please login again",
            variant: "destructive",
          });
        }
      }
    } finally {
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step={0.1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" variant={"outline"}>
          <Coins className="mr-2 h-4 w-4" /> Support
        </Button>
      </form>
    </Form>
  );
}
