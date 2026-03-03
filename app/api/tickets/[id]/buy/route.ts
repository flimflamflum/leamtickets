import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendTicketSoldEmail, sendPurchaseConfirmationEmail } from "@/lib/email";
import { venueLabel } from "@/lib/utils";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please log in to claim a ticket" }, { status: 401 });
    }

    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        seller: { select: { email: true, name: true } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.status !== "AVAILABLE") {
      return NextResponse.json({ error: "Ticket is no longer available" }, { status: 409 });
    }

    await prisma.ticket.update({
      where: { id },
      data: { status: "SOLD", buyerId: session.user.id },
    });

    const venue = venueLabel(ticket.venue);
    const buyerEmail = session.user.email ?? "";

    if (buyerEmail) {
      await sendPurchaseConfirmationEmail({
        buyerEmail,
        buyerName: session.user.name,
        eventName: ticket.eventName,
        venue,
        ticketType: ticket.ticketType,
        resalePrice: ticket.resalePrice,
        imageUrl: ticket.imageUrl,
      });
    }

    await sendTicketSoldEmail({
      sellerEmail: ticket.seller.email,
      sellerName: ticket.seller.name,
      eventName: ticket.eventName,
      venue,
      ticketType: ticket.ticketType,
      resalePrice: ticket.resalePrice,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Buy ticket error:", error);
    return NextResponse.json({ error: "Failed to claim ticket" }, { status: 500 });
  }
}
