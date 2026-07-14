"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AdminBookActions({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const updateStatus = (status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Something went wrong");
        return;
      }

      toast.success(status === "APPROVED" ? "Book approved" : "Book rejected");
      router.refresh();
    });
  };

  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" onClick={() => updateStatus("APPROVED")} disabled={isPending}>
        Approve
      </Button>
      <Button size="sm" variant="outline" onClick={() => updateStatus("REJECTED")} disabled={isPending}>
        Reject
      </Button>
    </div>
  );
}
