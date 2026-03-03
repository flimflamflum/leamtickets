import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createConnectAccount, createConnectAccountLink } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeAccountId: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    let stripeAccountId = user.stripeAccountId;

    if (!stripeAccountId) {
      stripeAccountId = await createConnectAccount(user.email);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeAccountId },
      });
    }

    const returnUrl = `${appUrl}/dashboard?stripe=success`;
    const refreshUrl = `${appUrl}/dashboard?stripe=refresh`;

    const onboardingUrl = await createConnectAccountLink(
      stripeAccountId,
      returnUrl,
      refreshUrl
    );

    return NextResponse.json({ url: onboardingUrl });
  } catch (error) {
    console.error("Stripe Connect error:", error);
    return NextResponse.json({ error: "Failed to create Stripe account" }, { status: 500 });
  }
}
