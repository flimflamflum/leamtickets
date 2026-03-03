"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, ExternalLink, Clock, Ticket, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VenueBadge, Badge } from "@/components/ui/badge";
import { formatPrice, formatDateShort } from "@/lib/utils";
import { DashboardActions } from "./dashboard-actions";
import type { Ticket as TicketType } from "@prisma/client";

interface DashboardTabsProps {
  listings: TicketType[];
  boughtTickets: TicketType[];
}

export function DashboardTabs({ listings, boughtTickets }: DashboardTabsProps) {
  const [tab, setTab] = useState<"listings" | "tickets">("listings");

  const available = listings.filter((t) => t.status === "AVAILABLE");
  const sold = listings.filter((t) => t.status === "SOLD");

  const handleSaveImage = async (imageUrl: string, eventName: string) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${eventName.replace(/\s+/g, "-").toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `ticket-${eventName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit mb-6">
        <button
          onClick={() => setTab("listings")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "listings"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Your listings
        </button>
        <button
          onClick={() => setTab("tickets")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "tickets"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Your tickets
        </button>
      </div>

      {/* Your listings */}
      {tab === "listings" && (
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground text-lg">Your listings</h2>

          {listings.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border shadow-sm p-12 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <Ticket className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">No listings yet</p>
                <p className="text-muted-foreground text-sm mt-1">Create your first listing to start selling.</p>
              </div>
              <Link href="/sell">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                  Create listing
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-card rounded-2xl border border-border shadow-sm p-4 flex gap-4"
                >
                  <div className="relative w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden bg-muted">
                    <Image
                      src={ticket.imageUrl}
                      alt={ticket.eventName}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized={ticket.imageUrl.startsWith("data:")}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <VenueBadge venue={ticket.venue} />
                          {ticket.status === "AVAILABLE" && <Badge variant="available">Active</Badge>}
                          {ticket.status === "SOLD" && <Badge variant="sold">Sold</Badge>}
                        </div>
                        <h3 className="font-semibold text-foreground text-sm mt-1.5 truncate">
                          {ticket.eventName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDateShort(ticket.eventDate)} · {ticket.ticketType}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-foreground text-sm">
                          {ticket.resalePrice > 0 ? formatPrice(ticket.resalePrice) : "Free"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View listing
                      </Link>
                      {ticket.status === "AVAILABLE" && (
                        <DashboardActions ticketId={ticket.id} />
                      )}
                      {ticket.status === "SOLD" && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Sold {formatDateShort(ticket.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Your tickets (bought) */}
      {tab === "tickets" && (
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground text-lg">Your tickets</h2>

          {boughtTickets.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border shadow-sm p-12 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <Ticket className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">No tickets yet</p>
                <p className="text-muted-foreground text-sm mt-1">Tickets you claim will appear here.</p>
              </div>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Browse tickets
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {boughtTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-card rounded-2xl border border-border shadow-sm p-4 flex gap-4"
                >
                  {/* Show actual ticket image for bought tickets */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    <Image
                      src={ticket.imageUrl}
                      alt={ticket.eventName}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized={ticket.imageUrl.startsWith("data:")}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <VenueBadge venue={ticket.venue} />
                          <Badge variant="available">Yours</Badge>
                        </div>
                        <h3 className="font-semibold text-foreground text-sm mt-1.5 truncate">
                          {ticket.eventName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDateShort(ticket.eventDate)} · {ticket.ticketType}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSaveImage(ticket.imageUrl, ticket.eventName)}
                        >
                          <Download className="w-3 h-3" />
                          Save image
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View ticket
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
