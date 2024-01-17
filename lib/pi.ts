import { PaymentDTO } from "@/types";
import axiosClient from "./axios-client";

export const onIncompletePaymentFound = (payment: PaymentDTO<null>) => {
  console.log("onIncompletePaymentFound", payment);
  return axiosClient.post("/payments/incomplete", { payment });
};

export const safeParse = (input: number) => {
  return parseFloat(Number(input).toFixed(2));
};
