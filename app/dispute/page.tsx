import Link from "next/link";
import { ArrowLeft, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dispute a Sale – LeamTickets",
  description: "Dispute a ticket sale if you believe you have been scammed. Our team is here to help.",
};

export default function DisputePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/terms"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Terms of Service
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dispute a Ticket Sale</h1>
          <p className="text-sm text-muted-foreground">We&apos;re here to help</p>
        </div>
      </div>

      <div className="space-y-4 text-foreground leading-relaxed">
        <p>
          If you believe you have been scammed or had an issue with a ticket sale, please get in touch.
          You can email us at{" "}
          <a
            href="mailto:leamtickets@gmail.com?subject=Dispute%20-%20Ticket%20Sale"
            className="font-medium text-primary underline hover:no-underline inline-flex items-center gap-1"
          >
            leamtickets@gmail.com
            <Mail className="w-3.5 h-3.5" />
          </a>{" "}
          with the subject line &quot;Dispute - Ticket Sale&quot; and include as much detail as possible
          (ticket ID, seller info, date of purchase, and what went wrong).
        </p>

        <p>
          <strong>Please don&apos;t be concerned.</strong> Sellers cannot immediately cash out their
          earnings—they must wait 48 hours after the event date listed on the ticket before they
          can withdraw funds. This gives our team time to investigate and resolve any disputes
          before money leaves the platform.
        </p>

        <p>
          Our team reviews all dispute emails promptly. We will look into your case and take
          appropriate action. If you&apos;ve been scammed, we&apos;re on it.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <Link href="/terms">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Terms of Service
          </Button>
        </Link>
      </div>
    </div>
  );
}
