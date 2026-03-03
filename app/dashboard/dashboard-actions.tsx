"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DashboardActions({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-foreground">Remove listing?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs text-red-600 font-medium hover:text-red-800 disabled:opacity-50"
        >
          {isDeleting ? "Removing…" : "Yes, remove"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
    >
      <Trash2 className="w-3 h-3" />
      Remove
    </button>
  );
}
