import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getSession } from "@/actions/session";
import prisma from "@/lib/prisma";
import platformAPIClient from "@/lib/platformAPIClient";
import { SubscribeTx, PaymentDTO } from "@/types";
import { yearlySubscription } from "@/lib/wordle";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      console.log("[COMPLETE_SUBSCRIPTION]", "User not authenticated");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      paymentId,
      txid,
    }: {
      paymentId: string;
      txid: string;
    } = await req.json();

    const currentPayment = await platformAPIClient.get<PaymentDTO<SubscribeTx>>(
      `/v2/payments/${paymentId}`
    );

    const piTransaction = await prisma.piTransaction.findUnique({
      where: { paymentId },
    });

    if (!piTransaction) {
      console.log("[COMPLETE_SUBSCRIPTION]", "Invalid transaction");
      return new NextResponse("Invalid transaction", { status: 401 });
    }

    if (currentPayment.data.amount < piTransaction.amount) {
      console.log("[COMPLETE_SUBSCRIPTION]", "Invalid transaction");
      return new NextResponse("Invalid transaction", { status: 401 });
    }

    if (piTransaction.status !== "INITIALIZED") {
      console.log("[COMPLETE_SUBSCRIPTION]", "Invalid transaction");
      return new NextResponse("Invalid transaction", { status: 401 });
    }

    // let Pi server know that the payment is completed
    await platformAPIClient.post(`/v2/payments/${paymentId}/complete`, {
      txid,
    });

    // check if tx is still at INITIALIZED stage then add payer points if not only complete
    if (
      piTransaction.status === "INITIALIZED" &&
      piTransaction.amount <= currentPayment.data.amount
    ) {
      await prisma.user.update({
        where: { uuid: currentPayment.data.user_uid },
        data: { tokens: { increment: yearlySubscription.tokens } },
      });
    }

    await prisma.piTransaction.update({
      where: { paymentId, payerId: session.uuid },
      data: { status: "COMPLETED", txId: txid },
    });

    session.tokens = session.tokens + yearlySubscription.tokens;
    await session.save();
    revalidatePath("/(dashboard)/", "layout");

    return new NextResponse(`Completed the payment ${paymentId}`, {
      status: 200,
    });
  } catch (error) {
    console.log("[DEPOSIT_PI_COMPLETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
