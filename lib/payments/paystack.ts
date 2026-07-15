import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export class PurchaseError extends Error {}

const DEFAULT_COMMISSION_RATE = new Prisma.Decimal(0.4);
const PAYSTACK_BASE = "https://api.paystack.co";

function paystackHeaders() {
  return {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY ?? ""}`,
    "Content-Type": "application/json",
  };
}

/* ── Revenue split / purchase recording ─────────────────── */

export async function getCommissionRate() {
  const settings = await prisma.platformSettings.findUnique({ where: { id: 1 } });
  return settings?.commissionRate ?? DEFAULT_COMMISSION_RATE;
}

export async function purchaseBook(userId: string, bookId: string) {
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book || book.status !== "APPROVED") {
    throw new PurchaseError("This book is not available for purchase.");
  }

  const existing = await prisma.purchase.findUnique({
    where: { userId_bookId: { userId, bookId } },
  });
  if (existing) {
    throw new PurchaseError("You already own this book.");
  }

  const commissionRate = await getCommissionRate();
  const amount = book.price;
  const platformEarnings = amount.mul(commissionRate);
  const authorEarnings = amount.sub(platformEarnings);

  return prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.create({
      data: { userId, bookId, amount, authorEarnings, platformEarnings },
    });

    await tx.authorProfile.update({
      where: { id: book.authorId },
      data: { walletBalance: { increment: authorEarnings } },
    });

    return purchase;
  });
}

/* ── Paystack API helpers ────────────────────────────────── */

export async function initializePayment(opts: {
  email: string;
  amountNaira: number;
  bookId: string;
  userId: string;
  callbackUrl: string;
}) {
  const amountKobo = Math.round(opts.amountNaira * 100);
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: paystackHeaders(),
    body: JSON.stringify({
      email: opts.email,
      amount: amountKobo,
      currency: "NGN",
      callback_url: opts.callbackUrl,
      metadata: { bookId: opts.bookId, userId: opts.userId },
    }),
  });
  const data = await res.json();
  if (!data.status) throw new Error(data.message ?? "Paystack initialization failed");
  return data.data as {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function verifyPayment(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: paystackHeaders(),
  });
  const data = await res.json();
  if (!data.status) throw new Error(data.message ?? "Paystack verification failed");
  return data.data as {
    status: string; // "success" | "failed" | "abandoned"
    amount: number; // in kobo
    metadata: { bookId?: string; userId?: string };
    reference: string;
    customer: { email: string };
  };
}
