"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, AlertCircle, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { createTicketSchema, type CreateTicketInput } from "@/lib/validations";
import { formatPrice } from "@/lib/utils";
import { PLATFORM_FEE_PERCENT, calculateFees } from "@/types";

export default function SellPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      venue: undefined,
      resalePrice: 0,
    },
  });

  const resalePrice = watch("resalePrice");
  const fees = resalePrice !== undefined && resalePrice >= 0 ? calculateFees(resalePrice) : null;

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("Image must be under 4MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImageDataUrl(dataUrl);
      setValue("imageUrl", dataUrl, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  }, [setValue]);

  const removeImage = () => {
    setImageDataUrl(null);
    setValue("imageUrl", "", { shouldValidate: true });
  };

  const onSubmit = async (data: CreateTicketInput) => {
    setServerError(null);
    setUploadError(null);

    if (!data.imageUrl || data.imageUrl.length < 10) {
      setUploadError("Please upload a ticket image.");
      return;
    }

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = json.error ?? json.issues?.venue?.[0] ?? json.issues?.eventDate?.[0] ?? "Failed to create listing.";
        setServerError(msg);
        return;
      }

      router.push(`/tickets/${json.ticket.id}`);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">List a ticket</h1>
        <p className="mt-1.5 text-muted-foreground">
          List your ticket for free. Buyers can claim it at no cost.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40 rounded-xl px-4 py-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground">
          Do not sell anything that isn&apos;t an actual ticket that you don&apos;t intend to use. We know this seems tempting but if you try this you will not receive the money and will be banned.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Event details */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Event details</h2>

          <Select
            id="venue"
            label="Venue"
            required
            error={errors.venue?.message}
            placeholder="Select a venue"
            options={[
              { value: "SMACK", label: "Smack – Leamington Spa" },
              { value: "NEON", label: "Neon – Leamington Spa" },
            ]}
            {...register("venue")}
          />

          <Input
            id="eventDate"
            type="date"
            label="Event date"
            required
            error={errors.eventDate?.message}
            {...register("eventDate")}
          />

          <Input
            id="ticketType"
            label="Ticket type (optional)"
            placeholder="e.g. Standard, Fast Track"
            error={errors.ticketType?.message}
            {...register("ticketType")}
          />
        </div>

        {/* Pricing */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Price (optional)</h2>

          <Input
            id="resalePrice"
            type="number"
            label="Resale price (£)"
            placeholder="0.00"
            step="0.01"
            min="0"
            error={errors.resalePrice?.message}
            {...register("resalePrice", { valueAsNumber: true })}
          />

          {fees && resalePrice > 0 && (
            <div className="bg-muted rounded-xl border border-border p-4 space-y-2.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Fee breakdown
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-foreground">
                  <span>Price</span>
                  <span className="font-medium">{formatPrice(fees.resalePrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    Platform fee ({PLATFORM_FEE_PERCENT}%)
                    <span className="group/info relative inline-flex">
                      <span className="inline-flex h-4 w-4 shrink-0 cursor-help items-center justify-center rounded-full border border-current text-[10px] font-bold text-muted-foreground hover:text-foreground">
                        i
                      </span>
                      <span className="pointer-events-none absolute bottom-full left-1/2 z-[100] mb-1.5 w-64 -translate-x-1/2 rounded-lg border border-border bg-black px-3 py-2 text-xs font-medium leading-relaxed text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover/info:opacity-100 dark:bg-white dark:text-black dark:border-neutral-300">
                        This allows us to keep running this website. We aren&apos;t really aiming for profits and will decrease this fee over time as we get more volume.
                      </span>
                    </span>
                  </span>
                  <span className="text-destructive">−{formatPrice(fees.platformFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border">
                  <span>You receive</span>
                  <span className="text-green-600 dark:text-green-400">{formatPrice(fees.sellerPayout)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ticket image */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-foreground">Ticket image</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload a screenshot of your ticket (required).
            </p>
          </div>

          {imageDataUrl ? (
            <div className="relative">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
                <Image
                  src={imageDataUrl}
                  alt="Ticket preview"
                  fill
                  className="object-contain bg-muted"
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-3 border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-muted-foreground/20 transition-colors">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  <span className="text-foreground underline underline-offset-2">Upload image</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">JPG, PNG, WebP up to 4MB</p>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="sr-only"
              />
            </label>
          )}

          {uploadError && (
            <div className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {uploadError}
            </div>
          )}
          {errors.imageUrl && (
            <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <Textarea
            id="description"
            label="Description (optional)"
            placeholder="Any extra info — row number, entry time, restrictions..."
            rows={3}
            hint="Max 500 characters"
            error={errors.description?.message}
            {...register("description")}
          />
        </div>

        {serverError && (
          <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive">{serverError}</p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
        >
          <Upload className="w-4 h-4" />
          {isSubmitting ? "Creating listing…" : "List ticket"}
        </Button>

        <p className="text-xs text-muted-foreground text-center pb-4">
          By listing a ticket you confirm you own it and agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>.
        </p>
      </form>
    </div>
  );
}
