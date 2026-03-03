"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, AlertCircle, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { createTicketSchema, type CreateTicketInput } from "@/lib/validations";
import { formatPrice, venueLabel } from "@/lib/utils";
import { PLATFORM_FEE_PERCENT, calculateFees } from "@/types";

export default function SellPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      originalPrice: undefined,
      resalePrice: undefined,
    },
  });

  const resalePrice = watch("resalePrice");
  const fees = resalePrice && resalePrice > 0 ? calculateFees(resalePrice) : null;

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

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue("imageUrl", "");
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const { url } = await res.json();
    return url;
  };

  const onSubmit = async (data: CreateTicketInput) => {
    setServerError(null);

    if (!imageFile && !data.imageUrl) {
      setUploadError("Please upload a ticket image.");
      return;
    }

    try {
      let imageUrl = data.imageUrl;

      if (imageFile) {
        setIsUploading(true);
        imageUrl = await uploadImage(imageFile);
        setIsUploading(false);
      }

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, imageUrl }),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Failed to create listing.");
        return;
      }

      router.push(`/tickets/${json.ticket.id}`);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">List a ticket</h1>
        <p className="mt-1.5 text-gray-500">
          Sell your ticket securely. The buyer pays upfront — you receive 70% via Stripe.
        </p>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Event details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Event details</h2>

          <Select
            id="venue"
            label="Venue"
            required
            error={errors.venue?.message}
            options={[
              { value: "SMACK", label: "Smack – Leamington Spa" },
              { value: "NEON", label: "Neon – Leamington Spa" },
            ]}
            placeholder="Select a venue"
            {...register("venue")}
          />

          <Input
            id="eventName"
            label="Event name"
            placeholder="e.g. Smack Saturday, Freshers Week, NYE Party"
            required
            error={errors.eventName?.message}
            {...register("eventName")}
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
            label="Ticket type"
            placeholder="e.g. Standard, VIP, Student"
            required
            error={errors.ticketType?.message}
            {...register("ticketType")}
          />
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Pricing</h2>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="originalPrice"
              type="number"
              label="Original price (£)"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
              error={errors.originalPrice?.message}
              {...register("originalPrice", { valueAsNumber: true })}
            />

            <Input
              id="resalePrice"
              type="number"
              label="Your resale price (£)"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
              error={errors.resalePrice?.message}
              {...register("resalePrice", { valueAsNumber: true })}
            />
          </div>

          {/* Fee breakdown */}
          {fees && (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-2.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Fee breakdown
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Buyer pays</span>
                  <span className="font-medium">{formatPrice(fees.resalePrice)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Platform fee ({PLATFORM_FEE_PERCENT}%)</span>
                  <span className="text-red-500">−{formatPrice(fees.platformFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>You receive</span>
                  <span className="text-green-600">{formatPrice(fees.sellerPayout)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ticket image */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900">Ticket image</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Upload a screenshot of your ticket. Make sure any personal details are visible for verification.
            </p>
          </div>

          {imagePreview ? (
            <div className="relative">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={imagePreview}
                  alt="Ticket preview"
                  fill
                  className="object-contain bg-gray-50"
                />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-900/80 text-white flex items-center justify-center hover:bg-gray-900 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <ImageIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-gray-900 underline underline-offset-2">Upload image</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP up to 4MB</p>
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
            <div className="flex items-center gap-1.5 text-sm text-red-500">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {uploadError}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
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
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isSubmitting || isUploading}
        >
          <Upload className="w-4 h-4" />
          {isUploading ? "Uploading image…" : isSubmitting ? "Creating listing…" : "List ticket"}
        </Button>

        <p className="text-xs text-gray-400 text-center pb-4">
          By listing a ticket you confirm you own it and accept our terms. LeamTickets is not
          affiliated with any venue.
        </p>
      </form>
    </div>
  );
}
