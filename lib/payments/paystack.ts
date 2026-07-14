import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export class PurchaseError extends Error {}

const DEFAULT_COMMISSION_RATE = new Prisma.Decimal(0.4);

export async function getCommissionRate() {
  const settings = await prisma.platformSettings.findUnique({ where: { id: 1 } });
  return settings?.commissionRate ?? DEFAULT_COMMISSION_RATE;
}

/**
 * Records a completed book purchase and applies the author/platform revenue
 * split. This currently simulates an always-successful Paystack payment.
 *
 * To go live with Paystack: initialize a transaction with PAYSTACK_SECRET_KEY,
 * redirect the buyer to the returned authorization_url, then call this
 * function from the webhook/callback handler once Paystack confirms the
 * `charge.success` event instead of calling it directly from the API route.
 */
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
      data: {
        userId,
        bookId,
        amount,
        authorEarnings,
        platformEarnings,
      },
    });

    await tx.authorProfile.update({
      where: { id: book.authorId },
      data: { walletBalance: { increment: authorEarnings } },
    });

    return purchase;
  });
}
