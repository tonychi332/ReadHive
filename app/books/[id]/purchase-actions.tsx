"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function PurchaseActions({
  bookId,
  isLoggedIn,
  isOwned,
  isFavourited,
  fileUrl,
  paymentResult,
}: {
  bookId: string;
  isLoggedIn: boolean;
  isOwned: boolean;
  isFavourited: boolean;
  fileUrl: string | null;
  paymentResult?: string | null;
}) {
  const router = useRouter();
  const [owned, setOwned] = useState(isOwned);
  const [favourited, setFavourited] = useState(isFavourited);
  const [isPending, startTransition] = useTransition();

  // Show toast from Paystack callback and clean the URL
  useEffect(() => {
    if (!paymentResult) return;
    if (paymentResult === "success") {
      toast.success("Payment complete! You now own this book.");
      setOwned(true);
    } else if (paymentResult === "failed") {
      toast.error("Payment was not completed. Please try again.");
    } else if (paymentResult === "cancelled") {
      toast.info("Payment was cancelled.");
    }
    // Remove the query param from URL without a page reload
    router.replace(`/books/${bookId}`, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoggedIn) {
    return <Button render={<Link href={`/login?callbackUrl=/books/${bookId}`}>Log in to purchase</Link>} />;
  }

  const handlePurchase = () => {
    startTransition(async () => {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not start payment");
        return;
      }
      // Redirect browser to Paystack checkout page
      window.location.href = data.authorizationUrl;
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
          <Button render={<a href={fileUrl} target="_blank" rel="noreferrer">Download book</a>} />
        ) : (
          <Button disabled>Owned — file unavailable</Button>
        )
      ) : (
        <Button onClick={handlePurchase} disabled={isPending}>
          {isPending ? "Redirecting to payment..." : "Buy now"}
        </Button>
      )}
      <Button variant="outline" onClick={handleFavourite} disabled={isPending}>
        {favourited ? "Remove favourite" : "Add to favourites"}
      </Button>
    </div>
  );
}
