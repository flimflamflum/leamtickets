import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, ExternalLink, AlertTriangle, CheckCircle, Clock, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VenueBadge, Badge } from "@/components/ui/badge";
import { formatPrice, formatDateShort } from "@/lib/utils";
import { DashboardActions } from "./dashboard-actions";
import { StripeConnectButton } from "./stripe-connect-button";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ stripe?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/dashboard");

  const params = await searchParams;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      stripeAccountId: true,
      stripeOnboarded: true,
      createdAt: true,
      tickets: {
        orderBy: { createdAt: "desc" },
        include: { purchase: true },
      },
    },
  });

  if (!user) redirect("/auth/login");

  const available = user.tickets.filter((t) => t.status === "AVAILABLE");
  const sold = user.tickets.filter((t) => t.status === "SOLD");
  const cancelled = user.tickets.filter((t) => t.status === "CANCELLED");

  const totalEarned = sold.reduce((sum, t) => sum + (t.purchase?.sellerPayout ?? 0), 0);
  const pendingValue = available.reduce((sum, t) => {
    const payout = Math.round(t.resalePrice * 0.7 * 100) / 100;
    return sum + payout;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user.name ?? user.email.split("@")[0]}
          </p>
        </div>
        <Link href="/sell">
          <Button size="md">
            <Plus className="w-4 h-4" />
            New listing
          </Button>
        </Link>
      </div>

      {/* Stripe status banner */}
      {!user.stripeOnboarded && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-start gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900 text-sm">Connect Stripe to receive payouts</p>
              <p className="text-amber-700 text-xs mt-0.5">
                Your tickets can&apos;t be purchased until you connect a Stripe account.
                Takes about 2 minutes.
              </p>
            </div>
          </div>
          <StripeConnectButton />
        </div>
      )}

      {params.stripe === "success" && user.stripeOnboarded && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 text-sm font-medium">
            Stripe connected! Your tickets are now available for purchase.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Active listings", value: available.length, sub: "available" },
          { label: "Tickets sold", value: sold.length, sub: "sold" },
          { label: "Total earned", value: formatPrice(totalEarned), sub: "after fees" },
          { label: "Pending payout", value: formatPrice(pendingValue), sub: "if all sell" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Listings */}
      <div className="space-y-4">
        <h2 className="font-semibold text-gray-900 text-lg">Your listings</h2>

        {user.tickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Ticket className="w-7 h-7 text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">No listings yet</p>
              <p className="text-gray-500 text-sm mt-1">Create your first listing to start selling.</p>
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
            {user.tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4"
              >
                {/* Image thumbnail */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src={ticket.imageUrl}
                    alt={ticket.eventName}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <VenueBadge venue={ticket.venue} />
                        {ticket.status === "AVAILABLE" && (
                          <Badge variant="available">Active</Badge>
                        )}
                        {ticket.status === "SOLD" && (
                          <Badge variant="sold">Sold</Badge>
                        )}
                        {ticket.status === "CANCELLED" && (
                          <Badge>Removed</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mt-1.5 truncate">
                        {ticket.eventName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDateShort(ticket.eventDate)} · {ticket.ticketType}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 text-sm">{formatPrice(ticket.resalePrice)}</p>
                      <p className="text-xs text-green-600 font-medium">
                        You get {formatPrice(Math.round(ticket.resalePrice * 0.7 * 100) / 100)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View listing
                    </Link>
                    {ticket.status === "AVAILABLE" && (
                      <DashboardActions ticketId={ticket.id} />
                    )}
                    {ticket.status === "SOLD" && ticket.purchase && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Sold {formatDateShort(ticket.purchase.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
