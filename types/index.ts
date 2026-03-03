import type { Ticket, User, Venue, TicketStatus } from "@prisma/client";

export type { Venue, TicketStatus };

export type TicketWithSeller = Ticket & {
  seller: Pick<User, "id" | "email" | "name">;
};

export type SafeUser = Omit<User, "password">;

export interface CreateTicketInput {
  venue: Venue;
  eventName: string;
  eventDate: string;
  ticketType: string;
  originalPrice: number;
  resalePrice: number;
  imageUrl: string;
  description?: string;
}

export interface TicketFilters {
  venue?: Venue;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "price_asc" | "price_desc" | "date_asc" | "date_desc" | "newest";
}

export interface FeeBreakdown {
  resalePrice: number;
  platformFee: number;
  sellerPayout: number;
  platformFeePercent: number;
}

export const PLATFORM_FEE_PERCENT = 10;

export function calculateFees(resalePrice: number): FeeBreakdown {
  const platformFee = Math.round(resalePrice * (PLATFORM_FEE_PERCENT / 100) * 100) / 100;
  const sellerPayout = Math.round((resalePrice - platformFee) * 100) / 100;
  return {
    resalePrice,
    platformFee,
    sellerPayout,
    platformFeePercent: PLATFORM_FEE_PERCENT,
  };
}
