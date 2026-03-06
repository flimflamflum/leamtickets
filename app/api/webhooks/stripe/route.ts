import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import {
  sendTicketSoldEmail,
  sendPurchaseConfirmationEmail,
} from "@/lib/email";
import { venueLabel } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const ticketId = session.metadata?.ticketId;
    const buyerId = session.metadata?.buyerId;

    if (!ticketId || !buyerId) {
      console.error("Webhook missing metadata:", session.metadata);
      return NextResponse.json({ received: true });
    }

    try {
      const result = await prisma.ticket.updateMany({
        where: { id: ticketId, status: "AVAILABLE" },
        data: { status: "SOLD", buyerId },
      });

      if (result.count === 0) {
        console.error(
          `Ticket ${ticketId} was no longer available — issuing refund`
        );
        if (session.payment_intent && typeof session.payment_intent === "string") {
          await stripe.refunds.create({
            payment_intent: session.payment_intent,
          });
        }
        return NextResponse.json({ received: true });
      }

      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: {
          seller: { select: { email: true, name: true } },
          buyer: { select: { email: true, name: true } },
        },
      });

      if (ticket) {
        const venue = venueLabel(ticket.venue);
        const buyerEmail = ticket.buyer?.email ?? "";
        const sellerEmail = ticket.seller?.email ?? "";

        const emailTasks: Promise<void>[] = [];

        if (buyerEmail) {
          emailTasks.push(
            sendPurchaseConfirmationEmail({
              buyerEmail,
              buyerName: ticket.buyer?.name,
              eventName: ticket.eventName,
              venue,
              ticketType: ticket.ticketType,
              resalePrice: ticket.resalePrice,
              imageUrl: ticket.imageUrl,
            }).catch((err) =>
              console.error("Buyer confirmation email failed:", err)
            )
          );
        }

        if (sellerEmail) {
          emailTasks.push(
            sendTicketSoldEmail({
              sellerEmail,
              sellerName: ticket.seller?.name,
              eventName: ticket.eventName,
              venue,
              ticketType: ticket.ticketType,
              resalePrice: ticket.resalePrice,
            }).catch((err) =>
              console.error("Seller notification email failed:", err)
            )
          );
        }

        await Promise.all(emailTasks);
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
