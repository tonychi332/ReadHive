import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendWithdrawalRequestedEmail } from "@/lib/email";

const schema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(10, "Account number must be at least 10 digits"),
  accountName: z.string().min(2, "Account name is required"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.authorProfileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { amount, bankName, accountNumber, accountName } = parsed.data;
  const authorId = session.user.authorProfileId;

  const authorProfile = await prisma.authorProfile.findUnique({
    where: { id: authorId },
    include: { user: true },
  });

  if (!authorProfile) {
    return NextResponse.json({ error: "Author profile not found" }, { status: 404 });
  }

  if (authorProfile.walletBalance.toNumber() < amount) {
    return NextResponse.json(
      { error: "Withdrawal amount exceeds your wallet balance" },
      { status: 400 },
    );
  }

  // Block if there's already a pending request
  const existingPending = await prisma.withdrawalRequest.findFirst({
    where: { authorId, status: "PENDING" },
  });
  if (existingPending) {
    return NextResponse.json(
      { error: "You already have a pending withdrawal request" },
      { status: 400 },
    );
  }

  const withdrawal = await prisma.withdrawalRequest.create({
    data: { authorId, amount, bankName, accountNumber, accountName },
  });

  void sendWithdrawalRequestedEmail({
    authorName: authorProfile.user.name,
    authorEmail: authorProfile.user.email,
    amount,
    bankName,
    accountNumber,
    accountName,
    withdrawalId: withdrawal.id,
  });

  return NextResponse.json({ withdrawal }, { status: 201 });
}
