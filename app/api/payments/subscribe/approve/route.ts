import { NextResponse } from "next/server";

import { getSession } from "@/actions/session";
import prisma from "@/lib/prisma";
import platformAPIClient from "@/lib/platformAPIClient";
import { PaymentDTO, SubscribeTx } from "@/types";
import { yearlySubscription } from "@/lib/wordle";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      console.log("[APPROVE_SUBSCRIPTION]", "User not authenticated");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      paymentId,
    }: {
      paymentId: string;
    } = await req.json();

    const currentPayment = await platformAPIClient.get<PaymentDTO<SubscribeTx>>(
      `/v2/payments/${paymentId}`
    );

    const activeTx = await prisma.piTransaction.findFirst({
      where: {
        paymentId,
      },
    });

    if (!!activeTx) {
      console.log("APPROVE_SUBSCRIPTION", "active pi tx with payment Id");
      return new NextResponse("Active tx with payment ID", { status: 401 });
    }

    if (currentPayment.data.amount < yearlySubscription.pi) {
      console.log("APPROVE_SUBSCRIPTION", "wrong payment amount");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.piTransaction.upsert({
      create: {
        amount: currentPayment.data.amount,
        paymentId,
        payerId: session.uuid,
        purposeId: "",
        type: "BUY_COINS",
      },
      where: { paymentId, payerId: session.uuid },
      update: {},
    });

    // let Pi Servers know that you're ready
    await platformAPIClient.post(`/v2/payments/${paymentId}/approve`);
    return new NextResponse(`Approved the payment ${paymentId}`, {
      status: 200,
    });
  } catch (error) {
    console.log("APPROVE_SUBSCRIPTION", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
