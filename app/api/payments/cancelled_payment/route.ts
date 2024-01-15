import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import platformAPIClient from "@/lib/platformAPIClient";

export async function POST(req: Request) {
  try {
    const {
      paymentId,
    }: {
      paymentId: string;
    } = await req.json();

    /* 
      DEVELOPER NOTE:
      implement logic here 
      e.g. delete pitransaction if already created

    */

    const tx = await prisma.piTransaction.findUnique({
      where: { paymentId },
    });
    if (tx) {
      await prisma.piTransaction.delete({
        where: { paymentId },
      });
    }

    // let Pi Servers know that you're ready
    await platformAPIClient.post(`/v2/payments/${paymentId}/cancel`);
    return new NextResponse(`Cancelled the payment ${paymentId}`, {
      status: 200,
    });
  } catch (error) {
    console.log("[DEPOSIT_PI_APPROVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
