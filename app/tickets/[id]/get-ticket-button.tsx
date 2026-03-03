"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface GetTicketButtonProps {
  ticketId: string;
  isSold: boolean;
  isLoggedIn?: boolean;
}

export function GetTicketButton({ ticketId, isSold, isLoggedIn = false }: GetTicketButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetTicket = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/buy`, { method: "POST" });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to claim ticket. Please try again.");
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSold) {
    return (
      <div className="text-center py-3 rounded-xl bg-gray-100 text-sm font-semibold text-gray-500">
        Ticket claimed
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Link href={`/auth/login?callbackUrl=/tickets/${ticketId}`} className="block">
        <Button size="lg" className="w-full">
          Log in to claim
        </Button>
      </Link>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleGetTicket}
        isLoading={isLoading}
        disabled={isLoading}
        size="lg"
        className="w-full"
      >
        <Gift className="w-4 h-4" />
        Get ticket (free)
      </Button>
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </div>
  );
}
