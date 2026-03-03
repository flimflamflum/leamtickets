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
    SMACK: "bg-purple-100 text-purple-700 border-purple-200",
    NEON: "bg-cyan-100 text-cyan-700 border-cyan-200",
  };
  return colors[venue] ?? "bg-gray-100 text-gray-700 border-gray-200";
}
