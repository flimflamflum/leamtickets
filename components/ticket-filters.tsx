"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const VENUES = [
  { value: "", label: "All venues" },
  { value: "SMACK", label: "Smack" },
  { value: "NEON", label: "Neon" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "date_asc", label: "Event date: soonest" },
  { value: "date_desc", label: "Event date: latest" },
];

export function TicketFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const venue = searchParams.get("venue") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "price_asc";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/", { scroll: false });
  };

  const hasActiveFilters = venue || dateFrom || dateTo || (sortBy && sortBy !== "price_asc");

  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className="text-sm font-semibold text-foreground">Filter & Sort</span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Venue filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Venue</label>
          <select
            value={venue}
            onChange={(e) => updateParams({ venue: e.target.value })}
            className={cn(
              "rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-all duration-200",
              "hover:border-muted-foreground/30"
            )}
          >
            {VENUES.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Date from */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">From date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => updateParams({ dateFrom: e.target.value })}
            className={cn(
              "rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-all duration-200",
              "hover:border-muted-foreground/30"
            )}
          />
        </div>

        {/* Date to */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">To date</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => updateParams({ dateTo: e.target.value })}
            className={cn(
              "rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-all duration-200",
              "hover:border-muted-foreground/30"
            )}
          />
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => updateParams({ sortBy: e.target.value })}
            className={cn(
              "rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-all duration-200",
              "hover:border-muted-foreground/30"
            )}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
