import { env } from "@/env.mjs";

export const potsConfig = {
  team: {
    admin: env.NEXT_PUBLIC_SITE_ADMIN,
    name: "team-pot",
    allocation: 0.2,
    lowerLimit: 10,
  },
  reward: { name: "reward-pot", allocation: 0.8, lowerLimit: 10 },
};
