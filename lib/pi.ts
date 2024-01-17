import { PaymentDTO } from "@/types";
import axiosClient, { config } from "./axios-client";
import PiNetwork from "pi-backend";

export const onIncompletePaymentFound = (payment: PaymentDTO<null>) => {
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

export const onError = (error: Error, payment?: PaymentDTO<null>) => {
  console.error("onError", error);
  if (payment) {
    console.log(payment);
    // handle the error accordingly
  }
};

export const pi = new PiNetwork(
  process.env.PI_API_KEY as string,
  process.env.PI_SECRET_KEY as string
);
