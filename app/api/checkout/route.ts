import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { PLATFORM_FEE_PERCENT } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please log in to buy a ticket" },
        { status: 401 }
      );
    }

    const { ticketId } = await req.json();
    if (!ticketId || typeof ticketId !== "string") {
      return NextResponse.json({ error: "Missing ticket ID" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { seller: { select: { email: true, name: true } } },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: "Ticket is no longer available" },
        { status: 409 }
      );
    }

    if (ticket.sellerId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot buy your own ticket" },
        { status: 400 }
      );
    }

    if (ticket.resalePrice <= 0) {
      return NextResponse.json(
        { error: "This ticket is free — claim it directly" },
        { status: 400 }
      );
    }

    const unitAmount = Math.round(ticket.resalePrice * 100);
    const venueName =
      ticket.venue === "SMACK" ? "Smack Q-Jump" : "Neon Priority Entry";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: unitAmount,
            product_data: {
              name: venueName,
              description: ticket.ticketType
                ? `${ticket.ticketType} — ${new Date(ticket.eventDate).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}`
                : new Date(ticket.eventDate).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        ticketId: ticket.id,
        buyerId: session.user.id,
        platformFeePercent: String(PLATFORM_FEE_PERCENT),
      },
      success_url: `${appUrl}/tickets/${ticket.id}?purchased=true`,
      cancel_url: `${appUrl}/tickets/${ticket.id}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
