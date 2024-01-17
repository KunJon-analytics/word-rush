import { DonateTx, PaymentDTO, PiCallbacks } from "@/types";
import axiosClient, { config } from "./axios-client";

const onReadyForServerApproval = (paymentId: string) => {
  console.log("onReadyForServerApproval", paymentId);
  axiosClient.post(`/payments/donate/approve`, { paymentId }, config);
};

const onReadyForServerCompletion = (paymentId: string, txid: string) => {
  console.log("onReadyForServerCompletion", paymentId, txid);
  axiosClient.post(`/payments/donate/complete`, { paymentId, txid }, config);
};

const onCancel = (paymentId: string) => {
  console.log("onCancel", paymentId);
  return axiosClient.post("/payments/cancel", { paymentId });
};

const onError = (error: Error, payment?: PaymentDTO<DonateTx>) => {
  console.error("onError", error);

  if (payment) {
    console.log(payment);
    // handle the error accordingly
  }
};

export const supportCallbacks: PiCallbacks<DonateTx> = {
  onCancel,
  onError,
  onReadyForServerApproval,
  onReadyForServerCompletion,
};
