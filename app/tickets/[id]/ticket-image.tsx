"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const VENUE_IMAGES: Record<string, string> = {
  SMACK: "/smack1.jpeg",
  NEON: "/neon1.jpeg",
};

const VENUE_GRADIENTS: Record<string, string> = {
  SMACK: "from-purple-600/90 to-purple-900/90",
  NEON: "from-cyan-600/90 to-cyan-900/90",
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
        {/* Venue background image */}
        <Image
          src={venueImage}
          alt={`${venue} event`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />

        {/* Gradient overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t",
          VENUE_GRADIENTS[venue] ?? "from-gray-900/90 to-gray-800/90"
        )} />

        {/* Lock overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold">Ticket image hidden</p>
          <p className="text-xs text-white/70 mt-1">
            {isSold ? "Claimed by another user" : "Revealed when someone claims this ticket"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
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
