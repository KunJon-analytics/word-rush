import { SiteConfig } from "@/types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Word Rush",
  description:
    "Join Word Rush and earn Pi tokens by being the first person to find a word. A new word is revealed every hour, or until someone finds it. Hurry up and play now!",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  links: {
    twitter: "https://twitter.com/kunjongroup",
    github: "https://github.com/KunJon-analytics",
  },
  mailSupport: "kunjonng@gmail.com",
};
