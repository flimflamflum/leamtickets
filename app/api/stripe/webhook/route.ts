import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendTicketSoldEmail, sendPurchaseConfirmationEmail } from "@/lib/email";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const ticketId = session.metadata?.ticketId;

    if (!ticketId) {
      return NextResponse.json({ error: "Missing ticketId metadata" }, { status: 400 });
    }

    try {
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: {
          seller: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

      if (!ticket || ticket.status !== "AVAILABLE") {
        return NextResponse.json({ received: true });
      }

      const amountPaid = (session.amount_total ?? 0) / 100;
      const platformFee = Math.round(amountPaid * 0.3 * 100) / 100;
      const sellerPayout = Math.round((amountPaid - platformFee) * 100) / 100;
      const buyerEmail = session.customer_details?.email ?? session.customer_email ?? "";
      const buyerName = session.customer_details?.name ?? null;

      await prisma.$transaction([
        prisma.ticket.update({
          where: { id: ticketId },
          data: { status: "SOLD" },
        }),
        prisma.purchase.create({
          data: {
            ticketId,
            buyerEmail,
            buyerName,
            stripePaymentIntentId: session.payment_intent as string,
            stripeSessionId: session.id,
            amountPaid,
            platformFee,
            sellerPayout,
          },
        }),
      ]);

      await Promise.allSettled([
        sendTicketSoldEmail({
          sellerEmail: ticket.seller.email,
          sellerName: ticket.seller.name,
          eventName: ticket.eventName,
          venue: ticket.venue,
          ticketType: ticket.ticketType,
          resalePrice: ticket.resalePrice,
          platformFee,
          sellerPayout,
          buyerEmail,
        }),
        sendPurchaseConfirmationEmail({
          buyerEmail,
          buyerName,
          eventName: ticket.eventName,
          venue: ticket.venue,
          ticketType: ticket.ticketType,
          amountPaid,
        }),
      ]);
    } catch (error) {
      console.error("Webhook processing error:", error);
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    if (account.details_submitted) {
      await prisma.user.updateMany({
        where: { stripeAccountId: account.id },
        data: { stripeOnboarded: true },
      });
    }
  }

  return NextResponse.json({ received: true });
}
