import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession } from "@/lib/stripe";
import { z } from "zod";

const checkoutSchema = z.object({
  ticketId: z.string().cuid(),
  buyerEmail: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { ticketId, buyerEmail } = parsed.data;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        seller: {
          select: { stripeAccountId: true, stripeOnboarded: true },
        },
        purchase: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.status !== "AVAILABLE") {
      return NextResponse.json({ error: "Ticket is no longer available" }, { status: 409 });
    }

    if (!ticket.seller.stripeAccountId || !ticket.seller.stripeOnboarded) {
      return NextResponse.json(
        { error: "Seller has not completed payment setup" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resalePriceInPence = Math.round(ticket.resalePrice * 100);

    const checkoutSession = await createCheckoutSession({
      ticketId: ticket.id,
      eventName: ticket.eventName,
      venue: ticket.venue,
      ticketType: ticket.ticketType,
      resalePriceInPence,
      imageUrl: ticket.imageUrl,
      sellerStripeAccountId: ticket.seller.stripeAccountId,
      successUrl: `${appUrl}/tickets/${ticket.id}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/tickets/${ticket.id}`,
      buyerEmail,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
