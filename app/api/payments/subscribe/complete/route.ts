import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getSession } from "@/actions/session";
import prisma from "@/lib/prisma";
import platformAPIClient from "@/lib/platformAPIClient";
import { SubscribeTx, PaymentDTO } from "@/types";
import { yearlySubscription } from "@/lib/wordle";
import { inngest } from "@/inngest/client";
import { potsConfig } from "@/config/pot";
import { safeParse } from "@/lib/pi";

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

    // check if tx is still at INITIALIZED stage then add payer tokens if not only complete

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

    const user = await prisma.user.update({
      where: { uuid: currentPayment.data.user_uid },
      data: { tokens: { increment: yearlySubscription.tokens } },
    });

    await prisma.piTransaction.update({
      where: { paymentId, payerId: session.uuid },
      data: { status: "COMPLETED", txId: txid },
    });

    session.tokens = user.tokens;
    await session.save();
    // send share pot payment event
    // send reward pot event
    // send team pot event

    await inngest.send([
      {
        name: "pots/value.change",
        data: {
          name: potsConfig.reward.name,
          increment: safeParse(
            potsConfig.reward.allocation * currentPayment.data.amount
          ),
        },
        user: { uuid: session.uuid },
      },
      {
        name: "pots/value.change",
        data: {
          name: potsConfig.team.name,
          increment: safeParse(
            potsConfig.team.allocation * currentPayment.data.amount
          ),
        },
        user: { uuid: session.uuid },
      },
    ]);
    revalidatePath("/(dashboard)", "layout");

    return new NextResponse(`Completed the payment ${paymentId}`, {
      status: 200,
    });
  } catch (error) {
    console.log("[DEPOSIT_PI_COMPLETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
