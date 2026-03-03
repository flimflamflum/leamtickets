"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
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
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]",
          {
            "bg-gray-900 text-white hover:bg-gray-700 focus-visible:ring-gray-900": variant === "primary",
            "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400": variant === "secondary",
            "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400": variant === "ghost",
            "bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-500": variant === "danger",
            "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400": variant === "outline",
          },
          {
            "px-3 py-1.5 text-sm gap-1.5": size === "sm",
            "px-5 py-2.5 text-sm gap-2": size === "md",
            "px-6 py-3 text-base gap-2": size === "lg",
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
