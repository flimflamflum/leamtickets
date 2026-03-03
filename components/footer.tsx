import Link from "next/link";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-foreground mb-3">
              <span className="text-lg">LeamTickets</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Student-to-student ticket resale for Smack and Neon in Leamington Spa. 
              Built by Warwick students, for Warwick students.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Browse Tickets
              </Link>
              <Link href="/sell" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sell a Ticket
              </Link>
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link href="/auth/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign up
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <a
                href="mailto:leamtickets@gmail.com"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Mail className="w-3 h-3" />
                Contact Us
              </a>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              <strong className="text-foreground">Disclaimer:</strong> LeamTickets is an independent, student-run resale
              marketplace. It is not affiliated with, endorsed by, or connected to Smack, Neon, the University of
              Warwick, or any venue or organisation.
            </p>

            {/* Copyright */}
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              &copy; {new Date().getFullYear()} LeamTickets
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
