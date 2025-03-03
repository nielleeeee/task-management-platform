import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { dbPool } from "@/lib/db";
import { user, session, account, verification, invitation, organization as organizationSchema, member } from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(dbPool, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
      invitation,
      organization: organizationSchema,
      member,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  rateLimit: {
    window: 60,
    max: 10,
  },

  plugins: [nextCookies(), organization()],
});
