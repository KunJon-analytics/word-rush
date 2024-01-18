"use server";

import { potsConfig } from "@/config/pot";
import prisma from "@/lib/prisma";

export async function getRewardPot() {
  const rewardPot = await prisma.pot.findUnique({
    where: { name: potsConfig.reward.name },
  });

  return rewardPot;
}
