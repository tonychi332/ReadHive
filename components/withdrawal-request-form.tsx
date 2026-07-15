"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WithdrawalRequestForm({
  walletBalance,
  hasPending,
}: {
  walletBalance: number;
  hasPending: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      amount: parseFloat(form.get("amount") as string),
      bankName: form.get("bankName") as string,
      accountNumber: form.get("accountNumber") as string,
      accountName: form.get("accountName") as string,
    };

    startTransition(async () => {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Request failed");
        return;
      }
      toast.success("Withdrawal request submitted. Admin will process it shortly.");
      setOpen(false);
      router.refresh();
    });
  };

  if (walletBalance <= 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No balance available to withdraw.
      </p>
    );
  }

  if (hasPending) {
    return (
      <p className="text-sm text-muted-foreground">
        You have a pending withdrawal request. Wait for it to be processed before submitting another.
      </p>
    );
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        Request withdrawal
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-6">
      <h3 className="font-semibold">Withdrawal Request</h3>
      <p className="text-sm text-muted-foreground">
        Available balance: <strong>₦{walletBalance.toFixed(2)}</strong>
      </p>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₦)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="1"
          max={walletBalance}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input id="bankName" name="bankName" placeholder="e.g. GTBank" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input id="accountNumber" name="accountNumber" placeholder="0123456789" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name</Label>
        <Input id="accountName" name="accountName" placeholder="As it appears on your bank account" required />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit request"}
        </Button>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
