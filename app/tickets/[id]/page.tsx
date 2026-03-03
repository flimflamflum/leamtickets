import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, User, Info } from "lucide-react";
import { VenueBadge, Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { TicketWithSeller } from "@/types";
import { GetTicketButton } from "./get-ticket-button";

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

  const isSold = ticket.status === "SOLD";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
            <Image
              src={ticket.imageUrl}
              alt={`${ticket.eventName} ticket`}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              unoptimized={ticket.imageUrl.startsWith("data:")}
            />
            {isSold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="sold" className="text-base px-4 py-2">Claimed</Badge>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <VenueBadge venue={ticket.venue} />
              {isSold && <Badge variant="sold">Claimed</Badge>}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket.eventName}</h1>
          </div>

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

          {ticket.description && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-sm text-gray-500 font-medium mb-1.5">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{ticket.description}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900">
                {ticket.resalePrice > 0 ? formatPrice(ticket.resalePrice) : "Free"}
              </p>
            </div>

            <GetTicketButton ticketId={ticket.id} isSold={isSold} />
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-400">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <p>
              LeamTickets is not affiliated with Smack, Neon, or the University of Warwick.
              Verify event details independently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
