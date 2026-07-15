import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { verifyPayment, purchaseBook, PurchaseError } from "@/lib/payments/paystack";
import { sendPurchaseReceiptEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);

  // Paystack sends both `reference` and `trxref` — either works
  const reference = sp.reference ?? sp.trxref;
  if (!reference) redirect(`/books/${id}?payment=cancelled`);

  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=/books/${id}`);

  try {
    const tx = await verifyPayment(reference);
    if (tx.status !== "success") redirect(`/books/${id}?payment=failed`);

    const purchase = await purchaseBook(session.user.id, id).catch((err) => {
      if (err instanceof PurchaseError && err.message.includes("already own")) return null;
      throw err;
    });

    // Send receipt for new purchases (not for idempotent replay)
    if (purchase) {
      const book = await prisma.book.findUnique({ where: { id } });
      if (book) {
        void sendPurchaseReceiptEmail({
          buyerEmail: session.user.email!,
          buyerName: session.user.name ?? "Reader",
          bookTitle: book.title,
          bookId: book.id,
          amount: book.price.toNumber(),
          fileUrl: book.fileUrl,
        });
      }
    }
  } catch (err) {
    console.error("Payment success handler error:", err);
    redirect(`/books/${id}?payment=failed`);
  }

  redirect(`/books/${id}?payment=success`);
}
