import { cn, venueColor, venueLabel } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "venue" | "sold" | "available" | "default";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-gray-100 text-gray-700 border-gray-200",
        variant === "sold" && "bg-red-50 text-red-600 border-red-200",
        variant === "available" && "bg-green-50 text-green-700 border-green-200",
        className
      )}
    >
      {children}
    </span>
  );
}

interface VenueBadgeProps {
  venue: string;
  className?: string;
}

export function VenueBadge({ venue, className }: VenueBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        venueColor(venue),
        className
      )}
    >
      {venueLabel(venue)}
    </span>
  );
}
