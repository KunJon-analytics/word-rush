import PiNetwork from "pi-backend";

import { NextResponse } from "next/server";
import axios from "axios";

import prisma from "@/lib/prisma";
import platformAPIClient from "@/lib/platformAPIClient";
import { PaymentDTO } from "@/types";
import { yearlySubscription } from "@/lib/wordle";

export const pi = new PiNetwork(
  process.env.PI_API_KEY as string,
  process.env.PI_SECRET_KEY as string
);

export async function POST(req: Request) {
  try {
    const { payment }: { payment: PaymentDTO<null> } = await req.json();
    const paymentId = payment.identifier;
    const txid = payment?.transaction?.txid as string;
    const txURL = payment?.transaction?._link as string;
    const uid = payment.user_uid;
    const amount = payment.amount;

    const piPayment = await prisma.piTransaction.findUnique({
      where: { paymentId, payerId: uid },
    });

    // payment doesn't exist
    if (!piPayment) {
      console.log("[INCOMPLETE_PAYMENT]", "Payment not found");
      return new NextResponse("Payment not found", { status: 400 });
    }

    // payment already refunded
    if (piPayment.isRefunded) {
      console.log("[INCOMPLETE_PAYMENT]", "Payment already refunded");
      return new NextResponse("Already refunded", { status: 400 });
    }

    // check the transaction on the Pi blockchain
    const horizonResponse = await axios.create({ timeout: 20000 }).get(txURL);
    const paymentIdOnBlock = horizonResponse.data.memo;
    // console.log(horizonResponse.data);

    // and check other data as well e.g. amount
    if (paymentIdOnBlock !== piPayment.paymentId) {
      console.log(
        "[INCOMPLETE_PAYMENT]",
        "Payment id not same with blockchain"
      );
      return new NextResponse("Payment id doesn't match.", { status: 400 });
    }

    // check if tx is still at INITIALIZED stage then add payer points if not only complete
    if (piPayment.status === "INITIALIZED" && piPayment.amount === amount) {
      await prisma.user.update({
        where: { uuid: payment.user_uid },
        data: { points: { increment: yearlySubscription.tokens } },
      });
    }

    await prisma.piTransaction.update({
      where: { paymentId, payerId: uid },
      data: { status: "COMPLETED" },
    });

    // let Pi Servers know that the payment is completed
    await platformAPIClient.post(`/v2/payments/${paymentId}/complete`, {
      txid,
    });

    return new NextResponse(`Handled the incomplete payment ${paymentId}`, {
      status: 200,
    });
  } catch (error) {
    console.log("[INCOMPLETE_PAYMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
