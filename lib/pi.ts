import { SubscribeTx, PaymentDTO } from "@/types";
import axiosClient, { config } from "./axios-client";

export const onIncompletePaymentFound = (payment: PaymentDTO<SubscribeTx>) => {
  console.log("onIncompletePaymentFound", payment);
  return axiosClient.post("/payments/incomplete", { payment });
};

export const onReadyForServerApproval = (paymentId: string) => {
  console.log("onReadyForServerApproval", paymentId);
  axiosClient.post("/payments/approve", { paymentId }, config);
};

export const onReadyForServerCompletion = (paymentId: string, txid: string) => {
  console.log("onReadyForServerCompletion", paymentId, txid);
  axiosClient.post("/payments/complete", { paymentId, txid }, config);
};

export const onCancel = (paymentId: string) => {
  console.log("onCancel", paymentId);
  return axiosClient.post("/payments/cancelled_payment", { paymentId });
};

export const onError = (error: Error, payment?: PaymentDTO<SubscribeTx>) => {
  console.error("onError", error);
  if (payment) {
    console.log(payment);
    // handle the error accordingly
  }
};
