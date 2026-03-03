import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-muted-foreground mb-4">404</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4" />
            Back to homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
