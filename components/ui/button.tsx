"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "gradient-smack" | "gradient-neon";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "active:scale-[0.98]",
          // Variants
          {
            // Primary - main CTA
            "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20": variant === "primary",

            // Secondary - subtle action
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",

            // Ghost - minimal
            "bg-transparent text-foreground hover:bg-muted": variant === "ghost",

            // Danger - destructive action
            "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "danger",

            // Outline - bordered
            "border border-input bg-background text-foreground hover:bg-muted hover:text-foreground": variant === "outline",

            // Gradient Smack - purple vibes
            "gradient-smack text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40": variant === "gradient-smack",

            // Gradient Neon - cyan vibes
            "gradient-neon text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40": variant === "gradient-neon",
          },
          // Sizes
          {
            "px-3 py-1.5 text-xs gap-1.5": size === "sm",
            "px-5 py-2.5 text-sm gap-2": size === "md",
            "px-6 py-3 text-base gap-2.5": size === "lg",
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
