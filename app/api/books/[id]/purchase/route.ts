import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PurchaseError, purchaseBook } from "@/lib/payments/paystack";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await purchaseBook(session.user.id, id);
  } catch (error) {
    if (error instanceof PurchaseError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  return NextResponse.json({ success: true });
}
