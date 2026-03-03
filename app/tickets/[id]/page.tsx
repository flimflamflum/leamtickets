import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, User, Info } from "lucide-react";
import { VenueBadge, Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { BuyButton } from "./buy-button";
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
        select: {
          id: true,
          email: true,
          name: true,
          stripeAccountId: true,
          stripeOnboarded: true,
        },
      },
      purchase: true,
    },
  }) as TicketWithSeller | null;

  if (!ticket) notFound();

  const fees = calculateFees(ticket.resalePrice);
  const isSold = ticket.status === "SOLD";
  const canBuy = ticket.status === "AVAILABLE" && ticket.seller.stripeOnboarded;

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

        {/* Details + buy */}
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
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-3xl font-bold text-gray-900">{formatPrice(ticket.resalePrice)}</p>
                {ticket.originalPrice !== ticket.resalePrice && (
                  <p className="text-sm text-gray-400 line-through mt-0.5">
                    Original: {formatPrice(ticket.originalPrice)}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3 mb-4">
              <div className="flex justify-between">
                <span>Ticket price</span>
                <span>{formatPrice(fees.resalePrice)}</span>
              </div>
              <div className="flex justify-between items-center gap-1">
                <span className="flex items-center gap-1">
                  Platform fee ({PLATFORM_FEE_PERCENT}%)
                  <Info className="w-3 h-3" />
                </span>
                <span>{formatPrice(fees.platformFee)}</span>
              </div>
            </div>

            {!canBuy && !isSold && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-3">
                <Info className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  The seller hasn&apos;t finished setting up payments yet. Check back soon.
                </p>
              </div>
            )}

            <BuyButton
              ticketId={ticket.id}
              disabled={!canBuy || isSold}
              isSold={isSold}
            />
          </div>

          {/* Safety notice */}
          <div className="flex items-start gap-2 text-xs text-gray-400">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <p>
              Payment is handled securely by Stripe. LeamTickets is not affiliated with
              Smack, Neon, or the University of Warwick. Verify event details independently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
