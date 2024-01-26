import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    DATABASE_URL: z.string().min(1),
    DIRECT_URL: z.string().min(1),
    NEXT_PUBLIC_SITE_ADMIN: z.string().min(1),
    // RESEND_API_KEY: z.string().min(1),
    // TEST_EMAIL_ADDRESS: z.string().min(1),
    COOKIE_PASSWORD: z.string().min(1),
    // Pi
    PI_SECRET_KEY: z.string().min(1),
    PI_API_KEY: z.string().min(1),
    WORDNIK_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_SITE_ADMIN: z.string().min(1),
    // Pi
    NEXT_PUBLIC_PI_SANDBOX: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NEXT_PUBLIC_SITE_ADMIN: process.env.NEXT_PUBLIC_SITE_ADMIN,
    // RESEND_API_KEY: process.env.RESEND_API_KEY,
    // TEST_EMAIL_ADDRESS: process.env.TEST_EMAIL_ADDRESS,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    COOKIE_PASSWORD: process.env.COOKIE_PASSWORD,
    // Pi
    PI_SECRET_KEY: process.env.PI_SECRET_KEY,
    PI_API_KEY: process.env.PI_API_KEY,
    NEXT_PUBLIC_PI_SANDBOX: process.env.NEXT_PUBLIC_PI_SANDBOX,
    WORDNIK_API_KEY: process.env.WORDNIK_API_KEY,
  },
});
