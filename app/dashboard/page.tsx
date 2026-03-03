import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardTabs } from "./dashboard-tabs";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      tickets: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/auth/login");

  let ticketsBought: Awaited<ReturnType<typeof prisma.ticket.findMany>> = [];
  try {
    ticketsBought = await prisma.ticket.findMany({
      where: { buyerId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // buyerId column may not exist if migration wasn't run on production
    ticketsBought = [];
  }

  const available = user.tickets.filter((t) => t.status === "AVAILABLE");
  const sold = user.tickets.filter((t) => t.status === "SOLD");

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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Active listings", value: available.length, sub: "available" },
          { label: "Tickets sold", value: sold.length, sub: "all time" },
          { label: "Your tickets", value: ticketsBought.length, sub: "claimed" },
          { label: "Total listings", value: user.tickets.length, sub: "created" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs: Your listings | Your tickets */}
      <DashboardTabs listings={user.tickets} boughtTickets={ticketsBought} />
    </div>
  );
}
