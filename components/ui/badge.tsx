import { cn, venueColor, venueLabel } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "venue" | "sold" | "available" | "default" | "warning";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-muted text-muted-foreground border-border",
        variant === "sold" && "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
        variant === "available" && "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
        variant === "warning" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
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
        "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
        venueColor(venue),
        className
      )}
    >
      {venueLabel(venue)}
    </span>
  );
}
