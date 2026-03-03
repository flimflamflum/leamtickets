"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function StripeConnectButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to connect Stripe");
        return;
      }

      window.location.href = json.url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleConnect}
        isLoading={isLoading}
        size="sm"
        className="whitespace-nowrap"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Connect Stripe
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
