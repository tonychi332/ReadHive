"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function BecomeAuthorButton() {
  const { update } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const res = await fetch("/api/author", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
        return;
      }

      await update({ authorProfileId: data.authorProfileId });
      toast.success("You're now an author!");
      router.push("/dashboard/author");
      router.refresh();
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? "Setting up..." : "Become an Author"}
    </Button>
  );
}
