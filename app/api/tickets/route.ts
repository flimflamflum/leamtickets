import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTicketSchema } from "@/lib/validations";
import type { Venue } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const venue = searchParams.get("venue") as Venue | null;
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const sortBy = searchParams.get("sortBy") ?? "newest";

    const where: Record<string, unknown> = {
      status: "AVAILABLE",
    };

    if (venue && ["SMACK", "NEON"].includes(venue)) {
      where.venue = venue;
    }

    if (dateFrom || dateTo) {
      where.eventDate = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {}),
      };
    }

    const orderBy = (() => {
      switch (sortBy) {
        case "price_asc":   return { resalePrice: "asc" as const };
        case "price_desc":  return { resalePrice: "desc" as const };
        case "date_asc":    return { eventDate: "asc" as const };
        case "date_desc":   return { eventDate: "desc" as const };
        default:            return { createdAt: "desc" as const };
      }
    })();

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy,
      include: {
        seller: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    return NextResponse.json({ tickets });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createTicketSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { venue, eventName, eventDate, ticketType, originalPrice, resalePrice, imageUrl, description } =
      parsed.data;

    const ticket = await prisma.ticket.create({
      data: {
        venue,
        eventName,
        eventDate: new Date(eventDate),
        ticketType,
        originalPrice,
        resalePrice,
        imageUrl,
        description: description ?? null,
        sellerId: session.user.id,
      },
      include: {
        seller: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
