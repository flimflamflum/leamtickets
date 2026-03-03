"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, Ticket, LogOut, LayoutDashboard, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const handleVenueFilter = (venue: string) => {
    router.push(`/?venue=${venue}`, { scroll: false });
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Logo + Venue buttons */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-foreground hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-muted-foreground rounded-xl flex items-center justify-center shadow-lg">
                <Ticket className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg hidden sm:block">LeamTickets</span>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-border mx-1" />

            {/* Venue quick filters */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => handleVenueFilter("SMACK")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                  "bg-purple-500/10 text-purple-600 hover:bg-purple-500 hover:text-white",
                  "dark:bg-purple-500/20 dark:text-purple-300 dark:hover:bg-purple-500 dark:hover:text-white",
                  "border border-purple-200 dark:border-purple-800",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                )}
              >
                Smack
              </button>
              <button
                onClick={() => handleVenueFilter("NEON")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                  "bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500 hover:text-white",
                  "dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500 dark:hover:text-white",
                  "border border-cyan-200 dark:border-cyan-800",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                )}
              >
                Neon
              </button>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                isActive("/")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              Browse
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/sell"
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive("/sell")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  Sell a Ticket
                </Link>
                <Link
                  href="/dashboard"
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive("/dashboard")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ redirectTo: "/" })}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="gap-1.5 shine-effect">
                    <Plus className="w-3.5 h-3.5" />
                    Sell Ticket
                  </Button>
                </Link>
              </>
            )}

            {/* Theme toggle */}
            <div className="ml-2 pl-2 border-l border-border">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl px-4 py-4 space-y-1">
          {/* Mobile venue filters */}
          <div className="flex gap-2 pb-3 mb-2 border-b border-border/50">
            <button
              onClick={() => handleVenueFilter("SMACK")}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              Smack
            </button>
            <button
              onClick={() => handleVenueFilter("NEON")}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
            >
              Neon
            </button>
          </div>

          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            Browse Tickets
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/sell"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
                Sell a Ticket
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                Dashboard
              </Link>
              <button
                onClick={() => { setMobileOpen(false); signOut({ redirectTo: "/" }); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity mt-2"
              >
                <Plus className="w-4 h-4" />
                Sell a Ticket
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
