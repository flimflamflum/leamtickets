import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function venueLabel(venue: string): string {
  const labels: Record<string, string> = {
    SMACK: "Smack",
    NEON: "Neon",
  };
  return labels[venue] ?? venue;
}

export function venueColor(venue: string): string {
  const colors: Record<string, string> = {
    SMACK: "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/30",
    NEON: "bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/30",
  };
  return colors[venue] ?? "bg-muted text-muted-foreground border-border";
}
