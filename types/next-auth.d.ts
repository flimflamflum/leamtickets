import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      stripeAccountId?: string;
      stripeOnboarded?: boolean;
    };
  }

  interface User {
    id?: string;
    stripeAccountId?: string;
    stripeOnboarded?: boolean;
  }
}
