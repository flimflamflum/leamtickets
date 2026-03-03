"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";

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
  const sortBy = searchParams.get("sortBy") ?? "newest";

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

  const hasActiveFilters = venue || dateFrom || dateTo || (sortBy && sortBy !== "newest");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-semibold text-gray-700">Filter & Sort</span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Venue filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Venue</label>
          <select
            value={venue}
            onChange={(e) => updateParams({ venue: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            {VENUES.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Date from */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">From date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => updateParams({ dateFrom: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {/* Date to */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">To date</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => updateParams({ dateTo: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => updateParams({ sortBy: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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
