"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CommissionRateForm({ initialRate }: { initialRate: number }) {
  const [percent, setPercent] = useState(String(Math.round(initialRate * 100)));
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = Number(percent);
    if (Number.isNaN(value) || value < 0 || value > 100) {
      toast.error("Enter a percentage between 0 and 100");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commissionRate: value / 100 }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
        return;
      }

      toast.success("Commission rate updated");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="space-y-2">
        <Label htmlFor="commissionRate">Platform commission (%)</Label>
        <Input
          id="commissionRate"
          name="commissionRate"
          type="number"
          min="0"
          max="100"
          step="1"
          value={percent}
          onChange={(event) => setPercent(event.target.value)}
          className="w-32"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
