import Link from "next/link";
import { Ticket } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">LeamTickets</span>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">Browse</Link>
            <Link href="/sell" className="hover:text-gray-900 transition-colors">Sell a Ticket</Link>
            <Link href="/auth/login" className="hover:text-gray-900 transition-colors">Log in</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            <strong className="text-gray-500">Disclaimer:</strong> LeamTickets is an independent, student-run resale
            marketplace. It is not affiliated with, endorsed by, or connected to Smack, Neon, the University of
            Warwick, or any venue or organisation. By using this site you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-600 transition-colors">Terms of Service</Link>.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            &copy; {new Date().getFullYear()} LeamTickets. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
