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
  const dayFilter = searchParams.get("dayFilter") ?? "";
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

  const hasActiveFilters = venue || dayFilter || (sortBy && sortBy !== "price_asc");

  return (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm p-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        {/* Header - inline with filters on desktop */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">Filter & Sort</span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>

        {/* Filters - single row, aligned */}
        <div className="flex flex-wrap items-end gap-4 sm:gap-6 min-w-0">
          {/* Venue filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Venue</label>
            <select
              value={venue}
              onChange={(e) => updateParams({ venue: e.target.value })}
              className={cn(
                "rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm text-foreground min-w-[120px]",
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

          {/* Day filter buttons */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Event day</label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => updateParams({ dayFilter: dayFilter === "tuesday" ? "" : "tuesday" })}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-all duration-200",
                  dayFilter === "tuesday"
                    ? "border-purple-500 bg-purple-500/20 text-purple-600 dark:text-purple-400"
                    : "border-input bg-background text-foreground hover:border-muted-foreground/30"
                )}
              >
                Smack Tuesday
              </button>
              <button
                type="button"
                onClick={() => updateParams({ dayFilter: dayFilter === "friday" ? "" : "friday" })}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-all duration-200",
                  dayFilter === "friday"
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400"
                    : "border-input bg-background text-foreground hover:border-muted-foreground/30"
                )}
              >
                Neon Friday
              </button>
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => updateParams({ sortBy: e.target.value })}
              className={cn(
                "rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm text-foreground min-w-[140px]",
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
    </div>
  );
}
