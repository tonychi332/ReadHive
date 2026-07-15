import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { initializePayment } from "@/lib/payments/paystack";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://read-hive-nu.vercel.app";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookId } = await req.json();
  if (!bookId) return NextResponse.json({ error: "bookId required" }, { status: 400 });

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book || book.status !== "APPROVED") {
    return NextResponse.json({ error: "Book not available" }, { status: 404 });
  }

  const existing = await prisma.purchase.findUnique({
    where: { userId_bookId: { userId: session.user.id, bookId } },
  });
  if (existing) {
    return NextResponse.json({ error: "You already own this book" }, { status: 400 });
  }

  try {
    const payment = await initializePayment({
      email: session.user.email!,
      amountNaira: book.price.toNumber(),
      bookId,
      userId: session.user.id,
      callbackUrl: `${SITE_URL}/books/${bookId}/payment-success`,
    });
    return NextResponse.json({ authorizationUrl: payment.authorization_url });
  } catch (err) {
    console.error("Paystack init error:", err);
    return NextResponse.json({ error: "Could not start payment. Try again." }, { status: 500 });
  }
}
