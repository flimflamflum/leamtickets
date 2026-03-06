import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto day-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
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
              <Link href="/dispute" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dispute
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-3">Contact</h3>
            <nav className="flex flex-col gap-2">
              <a href="mailto:leamtickets@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                leamtickets@gmail.com
              </a>
              <div className="flex items-center gap-3">
                <a href="https://www.tiktok.com/@leamtickets" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="TikTok">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88 2.02V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/leamtickets/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              </div>
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
