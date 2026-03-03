import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PurchaseSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Purchase confirmed!</h1>
        <p className="text-gray-500 mb-2">
          Your ticket has been purchased successfully. Check your email for confirmation
          details — the seller will be in touch.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          You should receive a confirmation email shortly.
        </p>
        <Link href="/">
          <Button variant="outline" size="lg" className="w-full">
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </Button>
        </Link>
      </div>
    </div>
  );
}
