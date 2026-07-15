import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyPayment, purchaseBook } from "@/lib/payments/paystack";
import { sendPurchaseReceiptEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";

  // Verify the request is genuinely from Paystack
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY ?? "")
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body) as {
    event: string;
    data: {
      reference: string;
      metadata?: { bookId?: string; userId?: string };
      status: string;
    };
  };

  if (event.event === "charge.success") {
    const { reference, metadata } = event.data;
    const bookId = metadata?.bookId;
    const userId = metadata?.userId;

    if (bookId && userId) {
      try {
        const tx = await verifyPayment(reference);
        if (tx.status === "success") {
          const purchase = await purchaseBook(userId, bookId).catch(() => null);

          // Send receipt email if purchase was newly created
          if (purchase) {
            const [user, book] = await Promise.all([
              prisma.user.findUnique({ where: { id: userId } }),
              prisma.book.findUnique({ where: { id: bookId } }),
            ]);
            if (user && book) {
              void sendPurchaseReceiptEmail({
                buyerEmail: user.email,
                buyerName: user.name,
                bookTitle: book.title,
                bookId: book.id,
                amount: book.price.toNumber(),
                fileUrl: book.fileUrl,
              });
            }
          }
        }
      } catch (err) {
        console.error("Webhook handler error:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
