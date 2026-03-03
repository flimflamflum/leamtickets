"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface TicketImageProps {
  imageUrl: string;
  eventName: string;
  isSold: boolean;
}

export function TicketImage({ imageUrl, eventName, isSold }: TicketImageProps) {
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

  if (!isSold) {
    return (
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-sm font-medium">Ticket image hidden</p>
          <p className="text-xs text-gray-400">Revealed when you claim this ticket</p>
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
