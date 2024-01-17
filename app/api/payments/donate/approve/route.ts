import { NextResponse } from "next/server";

import { getSession } from "@/actions/session";
import prisma from "@/lib/prisma";
import platformAPIClient from "@/lib/platformAPIClient";
import { PaymentDTO, DonateTx } from "@/types";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      console.log("[APPROVE_DONATION]", "User not authenticated");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      paymentId,
    }: {
      paymentId: string;
    } = await req.json();

    const currentPayment = await platformAPIClient.get<PaymentDTO<DonateTx>>(
      `/v2/payments/${paymentId}`
    );

    const activeTx = await prisma.piTransaction.findFirst({
      where: {
        paymentId,
      },
    });

    if (!!activeTx) {
      console.log("APPROVE_DONATION", "active pi tx with payment Id");
      return new NextResponse("Active tx with payment ID", { status: 401 });
    }

    if (currentPayment.data.amount < 0.1) {
      console.log("APPROVE_DONATION", "Thanks for the donation");
      return new NextResponse("Thanks for the donation", { status: 401 });
    }

    await prisma.piTransaction.upsert({
      create: {
        amount: currentPayment.data.amount,
        paymentId,
        payerId: session.uuid,
        purposeId: "",
        type: "DONATE",
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
    console.log("APPROVE_DONATION", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
