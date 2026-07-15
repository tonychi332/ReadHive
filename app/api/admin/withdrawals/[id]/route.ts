import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendWithdrawalStatusEmail } from "@/lib/email";

const schema = z.object({
  status: z.enum(["PAID", "REJECTED"]),
  adminNote: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { status, adminNote } = parsed.data;

  const existing = await prisma.withdrawalRequest.findUnique({
    where: { id },
    include: { author: { include: { user: true } } },
  });

  if (!existing || existing.status !== "PENDING") {
    return NextResponse.json({ error: "Withdrawal not found or already processed" }, { status: 404 });
  }

  if (status === "PAID") {
    // Approve: deduct balance + mark paid in one transaction
    await prisma.$transaction([
      prisma.withdrawalRequest.update({
        where: { id },
        data: { status: "PAID", adminNote: adminNote ?? null },
      }),
      prisma.authorProfile.update({
        where: { id: existing.authorId },
        data: { walletBalance: { decrement: existing.amount } },
      }),
    ]);
  } else {
    // Reject: just update status, balance unchanged
    await prisma.withdrawalRequest.update({
      where: { id },
      data: { status: "REJECTED", adminNote: adminNote ?? null },
    });
  }

  void sendWithdrawalStatusEmail({
    authorEmail: existing.author.user.email,
    authorName: existing.author.user.name,
    amount: existing.amount.toNumber(),
    status,
    adminNote,
  });

  return NextResponse.json({ success: true });
}
