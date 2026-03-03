import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { TicketCard, TicketCardSkeleton } from "@/components/ticket-card";
import { TicketFilters } from "@/components/ticket-filters";
import { Ticket, Zap, Shield, Users } from "lucide-react";
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
      <div className="col-span-full py-20 flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-muted to-background border border-border flex items-center justify-center shadow-xl">
          <Ticket className="w-9 h-9 text-muted-foreground" />
        </div>
        <div className="max-w-sm">
          <p className="font-bold text-foreground text-xl mb-2">No tickets available</p>
          <p className="text-muted-foreground text-base leading-relaxed">
            {venue || dateFrom || dateTo
              ? "Try adjusting your filters to see more results, or check back later."
              : "Be the first to list a ticket! Students are always looking for last-minute deals."}
          </p>
        </div>
        <Link href="/sell" className="mt-2">
          <Button variant="outline" size="lg" className="rounded-xl">
            List a ticket
          </Button>
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

  // Get ticket counts for stats
  const totalTickets = await prisma.ticket.count({ where: { status: "AVAILABLE" } });
  const smackCount = await prisma.ticket.count({ where: { status: "AVAILABLE", venue: "SMACK" } });
  const neonCount = await prisma.ticket.count({ where: { status: "AVAILABLE", venue: "NEON" } });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background dark:from-background dark:via-muted/30 dark:to-background" />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-500/5 to-transparent dark:from-purple-500/10" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-cyan-500/5 to-transparent dark:from-cyan-500/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-border/50 mb-6">
              <Zap className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span className="text-sm font-medium text-foreground">Student-to-student resale</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6">
              Your tickets to{" "}
              <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Leam nights
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Buy and sell tickets for Smack and Neon in Leamington Spa. 
              No bots. No scalpers. Just Warwick students helping each other out.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/sell">
                <Button size="lg" className="rounded-xl gap-2 px-8 shine-effect text-base">
                  <Zap className="w-4 h-4" />
                  Sell a Ticket
                </Button>
              </Link>
              <Link href="#tickets">
                <Button size="lg" variant="outline" className="rounded-xl px-8 text-base">
                  Browse Tickets
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span>Secure platform</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span>Student verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span>Instant transfer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">S</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{smackCount}</p>
                <p className="text-xs text-muted-foreground">Smack tickets</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">N</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{neonCount}</p>
                <p className="text-xs text-muted-foreground">Neon tickets</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-muted-foreground flex items-center justify-center">
                <Ticket className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalTickets}</p>
                <p className="text-xs text-muted-foreground">Total available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tickets Section */}
      <section id="tickets" className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                Available Tickets
                {venue && (
                  <span className={`
                    px-2.5 py-0.5 rounded-full text-xs font-semibold
                    ${venue === "SMACK"
                      ? "bg-purple-500 text-white"
                      : "bg-cyan-500 text-white"
                    }
                  `}>
                    {venue === "SMACK" ? "Smack" : "Neon"}
                  </span>
                )}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Find your perfect night out
              </p>
            </div>

            {/* Filters */}
            <Suspense fallback={null}>
              <TicketFilters />
            </Suspense>
          </div>

          {/* Ticket Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <Suspense
              fallback={Array.from({ length: 8 }).map((_, i) => (
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
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary to-muted-foreground p-8 sm:p-12 lg:p-16 overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 ticket-pattern" />
            </div>

            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
                Have a ticket to sell?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                List your Smack or Neon ticket in under a minute. 
                Reach hundreds of Warwick students instantly.
              </p>
              <Link href="/sell">
                <Button size="lg" variant="secondary" className="rounded-xl text-base px-8">
                  List Your Ticket
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
