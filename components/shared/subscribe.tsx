"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Gem } from "lucide-react";

import axiosClient, { config } from "@/lib/axios-client";
import { yearlySubscription } from "@/lib/wordle";
import { SubscribeTx, PaymentDTO, PiCallbacks } from "@/types";
import { logout } from "@/actions/session";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

const Subscribe = ({ subscriber }: { subscriber: string }) => {
  const { toast } = useToast();
  const router = useRouter();

  const onReadyForServerApproval = (paymentId: string) => {
    console.log("onReadyForServerApproval", paymentId);
    axiosClient.post(`/payments/subscribe/approve`, { paymentId }, config);
  };

  const onReadyForServerCompletion = (paymentId: string, txid: string) => {
    console.log("onReadyForServerCompletion", paymentId, txid);
    axiosClient.post(
      `/payments/subscribe/complete`,
      { paymentId, txid },
      config
    );
    toast({
      title: "Transaction Successful",
      description: `Payment with id: ${paymentId} completed`,
    });
  };

  const onCancel = (paymentId: string) => {
    console.log("onCancel", paymentId);
    toast({
      title: "Transaction Cancelled",
      description: `Payment with id: ${paymentId} cancelled`,
    });
    return axiosClient.post("/payments/cancel", { paymentId });
  };

  const onError = (error: Error, payment?: PaymentDTO<SubscribeTx>) => {
    console.error("onError", error);
    toast({
      title: "Uh oh! Something went wrong.",
      description:
        "There is an errow with this payment, check console for details",
      variant: "destructive",
    });
    if (payment) {
      console.log(payment);
      // handle the error accordingly
    }
  };

  const callbacks: PiCallbacks<SubscribeTx> = {
    onCancel,
    onError,
    onReadyForServerApproval,
    onReadyForServerCompletion,
  };

  const subscribe = async () => {
    try {
      const paymentData: {
        amount: number;
        memo: string;
        metadata: SubscribeTx;
      } = {
        amount: yearlySubscription.pi,
        memo: `Pay π${yearlySubscription.pi} for ${yearlySubscription.tokens} Word Rush tokens`,
        metadata: { subscriber },
      };

      const payment = await window.Pi.createPayment(paymentData, callbacks);
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
  };
  return (
    <Button onClick={subscribe}>
      <Gem className="mr-2 h-4 w-4" /> Get More Tokens
    </Button>
  );
};

export default Subscribe;
