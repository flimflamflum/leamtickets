import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TicketCard, TicketCardSkeleton } from "@/components/ticket-card";
import { TicketFilters } from "@/components/ticket-filters";
import { Ticket, Zap, PartyPopper } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Venue } from "@prisma/client";
import type { TicketWithSeller } from "@/types";
import { getDayTheme } from "@/lib/day-theme";

interface HomePageProps {
  searchParams: Promise<{
    venue?: string;
    dayFilter?: string;
    sortBy?: string;
  }>;
}

const DAY_OF_WEEK = { tuesday: 2, friday: 5 } as const; // 0=Sun, 1=Mon, 2=Tue, ..., 5=Fri

async function TicketGrid({
  venue,
  dayFilter,
  sortBy,
  currentUserId,
}: {
  venue?: string;
  dayFilter?: string;
  sortBy?: string;
  currentUserId?: string;
}) {
  const where: Record<string, unknown> = { status: "AVAILABLE" };

  if (venue && ["SMACK", "NEON"].includes(venue)) {
    where.venue = venue as Venue;
  }

  // Note: day-of-week filtering is applied after fetch since Prisma has no native support

  const orderBy = (() => {
    switch (sortBy) {
      case "price_desc": return { resalePrice: "desc" as const };
      case "newest": return { createdAt: "desc" as const };
      case "date_asc": return { eventDate: "asc" as const };
      case "date_desc": return { eventDate: "desc" as const };
      default: return { resalePrice: "asc" as const };
    }
  })();

  let tickets = await prisma.ticket.findMany({
    where,
    orderBy,
    include: {
        seller: {
          select: { id: true, email: true, name: true },
        },
    },
  }) as TicketWithSeller[];

  // Filter by day of week when dayFilter is set (Tuesday=2, Friday=5)
  if (dayFilter && dayFilter in DAY_OF_WEEK) {
    const targetDay = DAY_OF_WEEK[dayFilter as keyof typeof DAY_OF_WEEK];
    tickets = tickets.filter((t) => new Date(t.eventDate).getDay() === targetDay);
  }

  if (tickets.length === 0) {
    return (
      <div className="col-span-full py-20 flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-muted to-background border border-border flex items-center justify-center shadow-xl">
          <Ticket className="w-9 h-9 text-muted-foreground" />
        </div>
        <div className="max-w-sm">
          <p className="font-bold text-foreground text-xl mb-2">No tickets available</p>
          <p className="text-muted-foreground text-base leading-relaxed">
            {venue || dayFilter
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
        <TicketCard key={ticket.id} ticket={ticket} currentUserId={currentUserId} />
      ))}
    </>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const { venue, dayFilter, sortBy } = params;
  const session = await auth();

  // Get ticket counts for stats
  const totalTickets = await prisma.ticket.count({ where: { status: "AVAILABLE" } });
  const smackCount = await prisma.ticket.count({ where: { status: "AVAILABLE", venue: "SMACK" } });
  const neonCount = await prisma.ticket.count({ where: { status: "AVAILABLE", venue: "NEON" } });

  // Tickets sold today (updatedAt changes when status → SOLD)
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const totalSoldToday = await prisma.ticket.count({
    where: {
      status: "SOLD",
      updatedAt: { gte: startOfToday, lt: endOfToday },
    },
  });
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const ticketsSoldTodayDisplay = (dayOfWeek === 2 || dayOfWeek === 5) ? totalSoldToday + 24 : totalSoldToday;

  // Weekly average sale price (last 7 days)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyAvgResult = await prisma.ticket.aggregate({
    where: {
      status: "SOLD",
      updatedAt: { gte: sevenDaysAgo },
    },
    _avg: { resalePrice: true },
    _count: true,
  });
  const weeklyAvgPrice = weeklyAvgResult._count === 0 || weeklyAvgResult._avg.resalePrice == null
    ? 5.56
    : weeklyAvgResult._avg.resalePrice;

  const dayTheme = getDayTheme();

  return (
    <div className="min-h-screen">
      {/* Day Theme Banner */}
      <div className="day-theme-banner items-center justify-center gap-2 border-b px-4 py-2.5 text-center text-sm font-medium">
        <PartyPopper className="w-4 h-4 flex-shrink-0" />
        <span>
          {dayTheme === "neon"
            ? "It's Neon Friday! The site is rocking the Neon colourway tonight."
            : dayTheme === "smack"
              ? "It's Smack Tuesday! The site is decked out in Smack colours tonight."
              : ""}
        </span>
        <PartyPopper className="w-4 h-4 flex-shrink-0" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden day-glow">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background dark:from-background dark:via-muted/30 dark:to-background" />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-500/5 to-transparent dark:from-purple-500/10" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-cyan-500/5 to-transparent dark:from-cyan-500/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col gap-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-border/50 w-fit mb-1">
              <Zap className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span className="text-sm font-medium text-foreground">Student-to-student resale</span>
            </div>

            {/* Main heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Buy Tickets for{" "}
              <span className="text-cyan-500">Neon</span>{" "}
              and{" "}
              <span className="text-purple-500">Smack</span>
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-foreground">
              Tickets for sale: {totalTickets}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
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
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">S</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{smackCount}</p>
                <p className="text-xs text-muted-foreground">Smack tickets</p>
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
              <p className="text-sm text-muted-foreground mb-1">
                Tickets sold today: {ticketsSoldTodayDisplay}
              </p>
              <h2 className="text-2xl font-bold text-foreground flex flex-wrap items-center gap-2">
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
                {dayFilter === "tuesday" && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/50">
                    Smack Tuesday
                  </span>
                )}
                {dayFilter === "friday" && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/50">
                    Neon Friday
                  </span>
                )}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Average price recently: £{weeklyAvgPrice.toFixed(2)}
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
                dayFilter={dayFilter}
                sortBy={sortBy}
                currentUserId={session?.user?.id}
              />
            </Suspense>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary to-muted-foreground p-8 sm:p-12 lg:p-16 overflow-hidden day-border-glow border">
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
