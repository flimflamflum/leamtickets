import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms of Service – LeamTickets",
  description: "Terms of Service for LeamTickets ticket resale marketplace.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to LeamTickets
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: March 2025</p>

      <div className="prose prose-gray max-w-none space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Agreement</h2>
          <p className="text-gray-700">
            By using LeamTickets (&quot;the Platform&quot;), you agree to these Terms of Service.
            If you do not agree, do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. About LeamTickets</h2>
          <p className="text-gray-700">
            LeamTickets is an independent, student-run peer-to-peer ticket resale marketplace.
            We facilitate connections between buyers and sellers. <strong>We are not affiliated with,
            endorsed by, or connected to Smack, Neon, the University of Warwick, or any venue,
            promoter, or organisation.</strong> We do not sell tickets ourselves and are not a party
            to any transaction between users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. No Liability for Scams or Fraud</h2>
          <p className="text-gray-700 mb-2">
            <strong>LeamTickets is not liable for scams, fraud, counterfeit tickets, non-delivery,
            event cancellations, or any loss arising from transactions between users.</strong> All
            purchases and sales are at your own risk. We do not guarantee the authenticity,
            validity, or delivery of any ticket listed on the Platform.
          </p>
          <p className="text-gray-700">
            While we are not liable, we take user safety seriously. <strong>We will investigate all
            reported scams and fraudulent activity.</strong> If you believe you have been scammed,
            please contact us at leamtickets@gmail.com with details. We may take action against accounts involved in fraud,
            including suspension or removal, and we will cooperate with authorities where appropriate.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. User Responsibilities</h2>
          <p className="text-gray-700 mb-2">As a user, you agree to:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Provide accurate information when listing or claiming tickets</li>
            <li>Honour agreements made through the Platform</li>
            <li>Not list counterfeit, invalid, or fraudulent tickets</li>
            <li>Not use the Platform for any illegal purpose</li>
            <li>Keep your account credentials secure</li>
            <li>Use the Platform only for personal, non-commercial resale</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Prohibited Conduct</h2>
          <p className="text-gray-700 mb-2">You must not:</p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>List tickets you do not own or have the right to sell</li>
            <li>Engage in scalping, bot use, or automated listing</li>
            <li>Harass, threaten, or defraud other users</li>
            <li>Circumvent the Platform to avoid fees or verification</li>
            <li>Impersonate any person, venue, or organisation</li>
            <li>Violate any applicable law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Disclaimer of Warranties</h2>
          <p className="text-gray-700">
            The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
            express or implied. We do not warrant that the Platform will be uninterrupted, error-free,
            or free of viruses or harmful components.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Limitation of Liability</h2>
          <p className="text-gray-700">
            To the fullest extent permitted by law, LeamTickets, its operators, and affiliates
            shall not be liable for any indirect, incidental, special, consequential, or punitive
            damages, including but not limited to loss of profits, data, or goodwill, arising from
            your use of the Platform or any transaction conducted through it. Our total liability
            shall not exceed the amount you paid (if any) in the twelve months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Dispute Resolution</h2>
          <p className="text-gray-700">
            Disputes between buyers and sellers are solely between those users. We encourage you to
            resolve issues directly. We may, at our discretion, provide assistance or mediation,
            but we are not obliged to do so and are not responsible for the outcome.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Changes</h2>
          <p className="text-gray-700">
            We may update these Terms at any time. Continued use of the Platform after changes
            constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Contact</h2>
          <p className="text-gray-700">
            For questions, scam reports, complaints, or support, contact us at{" "}
            <a href="mailto:leamtickets@gmail.com" className="text-gray-900 font-medium underline hover:no-underline">
              leamtickets@gmail.com
            </a>
            . We aim to respond promptly and take appropriate action.
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Back to homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
