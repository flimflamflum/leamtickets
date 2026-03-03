"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-border">
        <Image
          src={imageUrl}
          alt={`${eventName} ticket`}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          unoptimized={imageUrl.startsWith("data:")}
        />
      </div>
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
