"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function PurchaseActions({
  bookId,
  isLoggedIn,
  isOwned,
  isFavourited,
  fileUrl,
}: {
  bookId: string;
  isLoggedIn: boolean;
  isOwned: boolean;
  isFavourited: boolean;
  fileUrl: string | null;
}) {
  const router = useRouter();
  const [owned, setOwned] = useState(isOwned);
  const [favourited, setFavourited] = useState(isFavourited);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Button render={<Link href="/login">Log in to purchase</Link>} />
    );
  }

  const handlePurchase = () => {
    startTransition(async () => {
      const res = await fetch(`/api/books/${bookId}/purchase`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Purchase failed");
        return;
      }
      toast.success("Purchase complete! You can now download this book.");
      setOwned(true);
      router.refresh();
    });
  };

  const handleFavourite = () => {
    startTransition(async () => {
      const res = await fetch(`/api/books/${bookId}/favourite`, {
        method: favourited ? "DELETE" : "POST",
      });
      if (!res.ok) {
        toast.error("Something went wrong");
        return;
      }
      setFavourited(!favourited);
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {owned ? (
        fileUrl ? (
          <Button
            render={
              <a href={fileUrl} target="_blank" rel="noreferrer">
                Download
              </a>
            }
          />
        ) : (
          <Button disabled>Owned — file unavailable</Button>
        )
      ) : (
        <Button onClick={handlePurchase} disabled={isPending}>
          {isPending ? "Processing..." : "Buy now"}
        </Button>
      )}
      <Button variant="outline" onClick={handleFavourite} disabled={isPending}>
        {favourited ? "Remove favourite" : "Add to favourites"}
      </Button>
    </div>
  );
}
