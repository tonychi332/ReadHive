import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookSchema } from "@/lib/validation";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.authorProfileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book || book.authorId !== session.user.authorProfileId) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = bookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { title, description, price, category, coverImageUrl, fileUrl } = parsed.data;

  const updated = await prisma.book.update({
    where: { id },
    data: {
      title,
      description,
      price,
      category: category || null,
      coverImageUrl: coverImageUrl || null,
      fileUrl: fileUrl || null,
      // Edits require re-approval before the book is listed again.
      status: "PENDING",
    },
  });

  return NextResponse.json({ book: updated });
}
