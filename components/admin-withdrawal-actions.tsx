"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminWithdrawalActions({ withdrawalId }: { withdrawalId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  const handle = (status: "PAID" | "REJECTED", adminNote?: string) => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/withdrawals/${withdrawalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Action failed");
        return;
      }
      toast.success(status === "PAID" ? "Marked as paid — author notified." : "Rejected — author notified.");
      router.refresh();
    });
  };

  if (showRejectInput) {
    return (
      <div className="flex items-center gap-2">
        <Input
          placeholder="Reason (optional)"
          value={rejectNote}
          onChange={(e) => setRejectNote(e.target.value)}
          className="h-8 w-48 text-xs"
        />
        <Button
          size="sm"
          variant="destructive"
          disabled={isPending}
          onClick={() => handle("REJECTED", rejectNote)}
        >
          Confirm reject
        </Button>
        <Button size="sm" variant="outline" onClick={() => setShowRejectInput(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        disabled={isPending}
        onClick={() => handle("PAID")}
      >
        Mark paid
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => setShowRejectInput(true)}
      >
        Reject
      </Button>
    </div>
  );
}
