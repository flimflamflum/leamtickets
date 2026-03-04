"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard, Plus, Sparkles, ChevronDown, Sun, Moon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href;
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVenueFilter = (venue: string) => {
    router.push(`/?venue=${venue}`, { scroll: false });
    setMobileOpen(false);
    setTimeout(() => {
      document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={36}
                height={36}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-ticket shrink-0 text-muted-foreground"
                aria-hidden
              >
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2" />
                <path d="M13 17v2" />
                <path d="M13 11v2" />
              </svg>
              <span className="text-lg hidden sm:block">LeamTickets</span>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-border mx-1" />

            {/* Venue quick filters */}
            <div className="hidden md:flex items-center gap-2">
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
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">
                Want another venue listed? Message us!
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/#tickets"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                isActive("/")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              Buy
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
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      "text-foreground hover:bg-secondary",
                      "border border-transparent",
                      userMenuOpen && "bg-secondary"
                    )}
                  >
                    <span className="truncate max-w-[180px]">{session.user.email}</span>
                    <ChevronDown className={cn("w-4 h-4 flex-shrink-0 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 py-1 min-w-[200px] bg-card border border-border rounded-xl shadow-lg z-50">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
                          "text-foreground hover:bg-secondary",
                          isActive("/dashboard") && "bg-primary/10 text-primary"
                        )}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => { setTheme(isDark ? "light" : "dark"); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors text-left"
                      >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {isDark ? "Light mode" : "Dark mode"}
                      </button>
                      <button
                        onClick={() => { setUserMenuOpen(false); signOut({ redirectTo: "/" }); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
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

            {/* Theme toggle - only when not logged in */}
            {!session?.user && (
              <div className="ml-2 pl-2 border-l border-border">
                <ThemeToggle />
              </div>
            )}
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {!session?.user && <ThemeToggle />}
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
            href="/#tickets"
            onClick={(e) => {
              setMobileOpen(false);
              if (pathname === "/") {
                e.preventDefault();
                document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            Buy Tickets
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
              <div className="border-t border-border/50 pt-2 mt-2">
                <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{session.user.email}</p>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                  Dashboard
                </Link>
                <button
                  onClick={() => { setTheme(isDark ? "light" : "dark"); setMobileOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors text-left"
                >
                  {isDark ? <Sun className="w-4 h-4 text-muted-foreground" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
                  {isDark ? "Light mode" : "Dark mode"}
                </button>
                <button
                  onClick={() => { setMobileOpen(false); signOut({ redirectTo: "/" }); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  Sign out
                </button>
              </div>
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
