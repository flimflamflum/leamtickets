"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gift, Trash2, Check } from "lucide-react";

interface GetTicketButtonProps {
  ticketId: string;
  isSold: boolean;
  isLoggedIn?: boolean;
  isSeller?: boolean;
  isBuyer?: boolean;
}

export function GetTicketButton({
  ticketId,
  isSold,
  isLoggedIn = false,
  isSeller = false,
  isBuyer = false,
}: GetTicketButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDelistConfirm, setShowDelistConfirm] = useState(false);
  const [isDelisting, setIsDelisting] = useState(false);

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

  const handleDelist = async () => {
    setIsDelisting(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setIsDelisting(false);
      setShowDelistConfirm(false);
    }
  };

  if (isSold) {
    return (
      <div className="text-center py-3 rounded-xl bg-green-500/10 border border-green-200 dark:border-green-800 text-sm font-semibold text-green-600 dark:text-green-400">
        <div className="flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          {isBuyer ? "Bought by you" : "Ticket sold"}
        </div>
      </div>
    );
  }

  if (isSeller) {
    if (showDelistConfirm) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">Remove this listing from sale?</p>
          <div className="flex gap-2">
            <Button
              variant="danger"
              size="lg"
              className="flex-1"
              onClick={handleDelist}
              isLoading={isDelisting}
            >
              Yes, delist
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setShowDelistConfirm(false)}
              disabled={isDelisting}
            >
              Cancel
            </Button>
          </div>
        </div>
      );
    }
    return (
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => setShowDelistConfirm(true)}
      >
        <Trash2 className="w-4 h-4" />
        Delist
      </Button>
    );
  }

  if (!isLoggedIn) {
    return (
      <Link href={`/auth/login?callbackUrl=/tickets/${ticketId}`} className="block">
        <Button size="lg" className="w-full shine-effect">
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
        className="w-full shine-effect"
      >
        <Gift className="w-4 h-4" />
        Get ticket (free)
      </Button>
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
    </div>
  );
}
