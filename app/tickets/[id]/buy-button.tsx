"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Lock } from "lucide-react";

interface BuyButtonProps {
  ticketId: string;
  disabled?: boolean;
  isSold?: boolean;
}

export function BuyButton({ ticketId, disabled, isSold }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to start checkout. Please try again.");
        return;
      }

      if (json.url) {
        window.location.href = json.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSold) {
    return (
      <Button className="w-full" disabled variant="secondary" size="lg">
        Ticket sold
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleBuy}
        isLoading={isLoading}
        disabled={disabled || isLoading}
        size="lg"
        className="w-full"
      >
        <ShoppingCart className="w-4 h-4" />
        Buy Now
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <Lock className="w-3 h-3" />
        Secured by Stripe
      </p>

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </div>
  );
}
