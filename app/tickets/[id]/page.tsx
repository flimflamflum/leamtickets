import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, User, Info, MapPin } from "lucide-react";
import { VenueBadge, Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { TicketWithSeller } from "@/types";
import { GetTicketButton } from "./get-ticket-button";
import { TicketImage } from "./ticket-image";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: { eventName: true, venue: true },
  });
  if (!ticket) return { title: "Ticket not found – LeamTickets" };
  const title = ticket.venue === "SMACK" ? "Smack Ticket" : "Neon Ticket";
  return {
    title: `${title} – LeamTickets`,
    description: `Buy a resale ticket for ${title}.`,
  };
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      seller: {
        select: { id: true, email: true, name: true },
      },
    },
  }) as TicketWithSeller | null;

  if (!ticket) notFound();

  const isSold = ticket.status === "SOLD";
  const isSeller = session?.user?.id === ticket.seller.id;
  const isBuyer = session?.user?.id === ticket.buyerId;
  const canViewImage = isSeller || (isSold && isBuyer);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <TicketImage
            imageUrl={ticket.imageUrl}
            eventName={ticket.eventName}
            venue={ticket.venue}
            isSold={isSold}
            canViewImage={canViewImage}
          />
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <VenueBadge venue={ticket.venue} />
              {isSeller && <Badge variant="default">Your listing</Badge>}
              {isSold && <Badge variant="sold">Claimed</Badge>}
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {ticket.venue === "SMACK" ? "Smack Ticket" : "Neon Ticket"}
            </h1>
          </div>

          <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-4 space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm text-foreground">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <span>{formatDate(ticket.eventDate)}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-foreground">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Tag className="w-4 h-4 text-muted-foreground" />
              </div>
              <span>{ticket.ticketType}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-foreground">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <span>{isSeller ? "Your listing" : `Listed by ${ticket.seller.name ?? ticket.seller.email.split("@")[0]}`}</span>
            </div>
          </div>

          {ticket.description && (
            <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-4">
              <p className="text-sm text-muted-foreground font-medium mb-1.5">Description</p>
              <p className="text-sm text-foreground leading-relaxed">{ticket.description}</p>
            </div>
          )}

          <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-4">
            <div className="mb-4">
              <p className="text-3xl font-bold text-foreground">
                {ticket.resalePrice > 0 ? formatPrice(ticket.resalePrice) : "Free"}
              </p>
            </div>

            <GetTicketButton
              ticketId={ticket.id}
              isSold={isSold}
              isLoggedIn={!!session?.user}
              isSeller={isSeller}
            />
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <p>
              LeamTickets is not affiliated with Smack, Neon, or the University of Warwick.
              See our <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
