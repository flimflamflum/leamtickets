import Link from "next/link";
import Image from "next/image";
import { Calendar, Tag, MapPin } from "lucide-react";
import { VenueBadge } from "@/components/ui/badge";
import { formatPrice, formatDateShort } from "@/lib/utils";
import type { TicketWithSeller } from "@/types";
import { cn } from "@/lib/utils";

const VENUE_IMAGES: Record<string, string> = {
  SMACK: "/smack1.jpeg",
  NEON: "/neon1.jpeg",
};

const VENUE_GRADIENTS: Record<string, string> = {
  SMACK: "from-purple-600/80 to-purple-900/80",
  NEON: "from-cyan-600/80 to-cyan-900/80",
};

interface TicketCardProps {
  ticket: TicketWithSeller;
  currentUserId?: string | null;
}

export function TicketCard({ ticket, currentUserId }: TicketCardProps) {
  const isOwnListing = currentUserId != null && ticket.seller.id === currentUserId;
  const imageSrc = VENUE_IMAGES[ticket.venue] ?? "/smack1.jpeg";
  const isFree = ticket.resalePrice === 0;

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="group block bg-card rounded-2xl border border-border/60 overflow-hidden card-lift"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${ticket.venue} event`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Gradient overlay on hover */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          VENUE_GRADIENTS[ticket.venue]
        )} />

        {/* Venue badge - positioned top-left */}
        <div className="absolute top-3 left-3">
          <VenueBadge venue={ticket.venue} />
        </div>

        {/* Price badge - positioned top-right */}
        <div className="absolute top-3 right-3">
          <div className={cn(
            "px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm",
            isFree
              ? "bg-green-500 text-white"
              : "bg-white/95 text-foreground dark:bg-black/80 dark:text-white"
          )}>
            {isFree ? "FREE" : formatPrice(ticket.resalePrice)}
          </div>
        </div>

        {/* Quick action hint on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-xl border border-white/30">
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Meta info */}
        <h3 className="font-bold text-foreground text-sm mb-2">
          {ticket.venue === "SMACK" ? "Smack Ticket" : "Neon Ticket"}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center">
              <Calendar className="w-3 h-3" />
            </div>
            <span className="font-medium">{formatDateShort(ticket.eventDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center">
              <Tag className="w-3 h-3" />
            </div>
            <span className="truncate">{ticket.ticketType ?? "—"}</span>
          </div>
        </div>

        {/* Footer - Seller info */}
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-muted-foreground to-muted flex items-center justify-center text-[10px] font-bold text-white">
              {(ticket.seller.name ?? ticket.seller.email).charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {isOwnListing ? "Your listing" : (ticket.seller.name ?? ticket.seller.email.split("@")[0])}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{ticket.venue === "SMACK" ? "Smack" : "Neon"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TicketCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-muted animate-pulse relative">
        <div className="absolute top-3 left-3 w-14 h-5 bg-background/50 rounded-md" />
        <div className="absolute top-3 right-3 w-12 h-5 bg-background/50 rounded-md" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded-lg w-3/4" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-muted" />
            <div className="h-3 bg-muted rounded-lg w-24" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-muted" />
            <div className="h-3 bg-muted rounded-lg w-20" />
          </div>
        </div>

        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted" />
            <div className="h-3 bg-muted rounded-lg w-16" />
          </div>
          <div className="h-3 bg-muted rounded-lg w-12" />
        </div>
      </div>
    </div>
  );
}
