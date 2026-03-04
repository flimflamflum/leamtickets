"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PartyPopper, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "leamtickets-sold-popup-dismissed";

export function SoldTicketsPopup() {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    fetch("/api/user/sold-tickets")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasSold && data.count > 0) {
          setCount(data.count);
          setShow(true);
        }
      })
      .catch(() => {});
  }, [session?.user, status]);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={handleDismiss}
        aria-hidden
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
        role="dialog"
        aria-labelledby="sold-popup-title"
        aria-modal="true"
      >
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4">
            <PartyPopper className="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
          <h2 id="sold-popup-title" className="text-xl font-bold text-foreground mb-2">
            {count === 1 ? "You sold a ticket!" : `You sold ${count} tickets!`}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {count === 1
              ? "Someone bought your ticket. Head to your dashboard to see the details."
              : "Buyers have claimed your tickets. Head to your dashboard to see the details."}
          </p>
          <div className="flex gap-2">
            <Link href="/dashboard" onClick={handleDismiss}>
              <Button size="lg" className="rounded-xl">
                View dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl"
              onClick={handleDismiss}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
