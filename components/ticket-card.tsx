import Link from "next/link";
import { Calendar, Tag, Lock } from "lucide-react";
import { VenueBadge } from "@/components/ui/badge";
import { formatPrice, formatDateShort } from "@/lib/utils";
import type { TicketWithSeller } from "@/types";

interface TicketCardProps {
  ticket: TicketWithSeller;
}

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* Placeholder – image hidden until purchase */}
      <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium">Image hidden until purchase</span>
        </div>
        <div className="absolute top-3 left-3">
          <VenueBadge venue={ticket.venue} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2 group-hover:text-gray-600 transition-colors">
          {ticket.eventName}
        </h3>

        <div className="flex flex-col gap-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{formatDateShort(ticket.eventDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Tag className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{ticket.ticketType}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {ticket.resalePrice > 0 ? formatPrice(ticket.resalePrice) : "Free"}
            </p>
          </div>
          <span className="text-xs text-gray-400">
            by {ticket.seller.name ?? ticket.seller.email.split("@")[0]}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function TicketCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
        <div className="h-3 bg-gray-100 rounded-lg w-1/3" />
        <div className="flex justify-between items-end mt-2">
          <div className="h-5 bg-gray-100 rounded-lg w-16" />
          <div className="h-3 bg-gray-100 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}
