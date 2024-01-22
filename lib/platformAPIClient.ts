import { PaymentDTO, SubscribeTx } from "@/types";
import axios from "axios";

const platformAPIClient = axios.create({
  baseURL: "https://api.minepi.com",
  timeout: 20000,
  headers: { Authorization: `Key ${process.env.PI_API_KEY}` },
});

export const getPayment = async (paymentId: string) => {
  return await platformAPIClient.get<PaymentDTO<SubscribeTx>>(
    `/v2/payments/${paymentId}`
  );
};

export default platformAPIClient;
