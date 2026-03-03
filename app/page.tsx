import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { TicketCard, TicketCardSkeleton } from "@/components/ticket-card";
import { TicketFilters } from "@/components/ticket-filters";
import { Ticket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Venue } from "@prisma/client";
import type { TicketWithSeller } from "@/types";

interface HomePageProps {
  searchParams: Promise<{
    venue?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
  }>;
}

async function TicketGrid({
  venue,
  dateFrom,
  dateTo,
  sortBy,
}: {
  venue?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
}) {
  const where: Record<string, unknown> = { status: "AVAILABLE" };

  if (venue && ["SMACK", "NEON"].includes(venue)) {
    where.venue = venue as Venue;
  }

  if (dateFrom || dateTo) {
    where.eventDate = {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo) } : {}),
    };
  }

  const orderBy = (() => {
    switch (sortBy) {
      case "price_asc": return { resalePrice: "asc" as const };
      case "price_desc": return { resalePrice: "desc" as const };
      case "date_asc": return { eventDate: "asc" as const };
      case "date_desc": return { eventDate: "desc" as const };
      default: return { createdAt: "desc" as const };
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
  }) as TicketWithSeller[];

  if (tickets.length === 0) {
    return (
      <div className="col-span-full py-20 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Ticket className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-lg">No tickets available</p>
          <p className="text-gray-500 text-sm mt-1">
            {venue || dateFrom || dateTo
              ? "Try adjusting your filters to see more results."
              : "Be the first to list a ticket!"}
          </p>
        </div>
        <Link href="/sell">
          <Button variant="outline" size="sm">List a ticket</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const { venue, dateFrom, dateTo, sortBy } = params;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Tickets for Leam nights
        </h1>
        <p className="mt-2 text-gray-500 text-lg">
          Student-to-student resale for Smack &amp; Neon. No bots, no scalpers.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Suspense fallback={null}>
          <TicketFilters />
        </Suspense>
      </div>

      {/* Ticket Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={Array.from({ length: 6 }).map((_, i) => (
            <TicketCardSkeleton key={i} />
          ))}
        >
          <TicketGrid
            venue={venue}
            dateFrom={dateFrom}
            dateTo={dateTo}
            sortBy={sortBy}
          />
        </Suspense>
      </div>
    </div>
  );
}
