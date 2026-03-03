import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, User, Info, Mail } from "lucide-react";
import { VenueBadge, Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { PLATFORM_FEE_PERCENT, calculateFees } from "@/types";
import type { TicketWithSeller } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: { eventName: true, venue: true },
  });
  if (!ticket) return { title: "Ticket not found – LeamTickets" };
  return {
    title: `${ticket.eventName} – LeamTickets`,
    description: `Buy a resale ticket for ${ticket.eventName}.`,
  };
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      seller: {
        select: { id: true, email: true, name: true },
      },
    },
  }) as TicketWithSeller | null;

  if (!ticket) notFound();

  const fees = calculateFees(ticket.resalePrice);
  const isSold = ticket.status === "SOLD";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Image */}
        <div className="lg:col-span-3">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
            <Image
              src={ticket.imageUrl}
              alt={`${ticket.eventName} ticket`}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            {isSold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="sold" className="text-base px-4 py-2">Sold</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <VenueBadge venue={ticket.venue} />
              {isSold && <Badge variant="sold">Sold</Badge>}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket.eventName}</h1>
          </div>

          {/* Event info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{formatDate(ticket.eventDate)}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{ticket.ticketType}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-700">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Listed by {ticket.seller.name ?? ticket.seller.email.split("@")[0]}</span>
            </div>
          </div>

          {/* Description */}
          {ticket.description && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm text-gray-500 font-medium mb-1.5">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{ticket.description}</p>
            </div>
          )}

          {/* Price card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-3xl font-bold text-gray-900 mb-1">{formatPrice(ticket.resalePrice)}</p>
            {ticket.originalPrice !== ticket.resalePrice && (
              <p className="text-sm text-gray-400 line-through mb-3">
                Original: {formatPrice(ticket.originalPrice)}
              </p>
            )}

            <div className="space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3 mb-4">
              <div className="flex justify-between">
                <span>Ticket price</span>
                <span>{formatPrice(fees.resalePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform fee ({PLATFORM_FEE_PERCENT}%)</span>
                <span>{formatPrice(fees.platformFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-700 pt-1.5 border-t border-gray-100">
                <span>Seller receives</span>
                <span>{formatPrice(fees.sellerPayout)}</span>
              </div>
            </div>

            {isSold ? (
              <div className="text-center py-3 rounded-xl bg-gray-100 text-sm font-semibold text-gray-500">
                Ticket sold
              </div>
            ) : (
              <a
                href={`mailto:${ticket.seller.email}?subject=Interested in your ticket: ${ticket.eventName}&body=Hi, I'm interested in buying your ticket for ${ticket.eventName}. Is it still available?`}
                className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 active:scale-[0.98] transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                Contact seller
              </a>
            )}
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-xs text-gray-400">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <p>
              Online payments are coming soon. For now, contact the seller directly to arrange
              payment. LeamTickets is not affiliated with Smack, Neon, or the University of Warwick.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
