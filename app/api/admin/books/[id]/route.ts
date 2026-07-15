import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendBookStatusEmail } from "@/lib/email";

const schema = z.object({ status: z.enum(["APPROVED", "REJECTED"]) });

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

  // Fetch full book + author before updating so we have the email
  const fullBook = await prisma.book.findUnique({
    where: { id },
    include: { author: { include: { user: true } } },
  });

  const book = await prisma.book.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  // Notify the author — fire-and-forget
  if (fullBook) {
    void sendBookStatusEmail({
      bookTitle: fullBook.title,
      authorEmail: fullBook.author.user.email,
      authorName: fullBook.author.user.name,
      status: parsed.data.status,
    });
  }

  return NextResponse.json({ book });
}
