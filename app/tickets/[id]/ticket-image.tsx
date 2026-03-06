"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

const VENUE_IMAGES: Record<string, string> = {
  SMACK: "/smack1.jpeg",
  NEON: "/neon1.jpeg",
};

interface TicketImageProps {
  imageUrl: string;
  eventName: string;
  venue: string;
  isSold: boolean;
  canViewImage: boolean;
}

export function TicketImage({ imageUrl, eventName, venue, isSold, canViewImage }: TicketImageProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageOverlayUrl, setImageOverlayUrl] = useState<string | null>(null);

  const handleSaveImage = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${eventName.replace(/\s+/g, "-").toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `ticket-${eventName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  const venueImage = VENUE_IMAGES[venue] ?? "/smack1.jpeg";

  if (!canViewImage) {
    return (
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border">
        <Image
          src={venueImage}
          alt={`${venue} event`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setImageOverlayUrl(imageUrl)}
        className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-border w-full cursor-pointer hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <Image
          src={imageUrl}
          alt={`${eventName} ticket`}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          unoptimized={imageUrl.startsWith("data:")}
        />
      </button>
      {imageOverlayUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={() => setImageOverlayUrl(null)}
        >
          <button
            type="button"
            onClick={() => setImageOverlayUrl(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={imageOverlayUrl}
            alt="Ticket"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <Button
        onClick={handleSaveImage}
        variant="outline"
        size="lg"
        className="w-full"
        isLoading={isDownloading}
      >
        <Download className="w-4 h-4" />
        Save image
      </Button>
    </div>
  );
}
