import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookSchema } from "@/lib/validation";
import { sendBookSubmittedEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN";

  // Admin: auto-create an author profile if they don't have one
  let authorProfileId = session.user.authorProfileId;
  if (!authorProfileId) {
    if (isAdmin) {
      const profile = await prisma.authorProfile.upsert({
        where: { userId: session.user.id },
        update: {},
        create: { userId: session.user.id, bio: "Platform administrator" },
      });
      authorProfileId = profile.id;
    } else {
      return NextResponse.json(
        { error: "You need an author profile to upload books." },
        { status: 403 },
      );
    }
  }

  const body = await req.json();
  const parsed = bookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { title, description, price, category, coverImageUrl, fileUrl } = parsed.data;

  const book = await prisma.book.create({
    data: {
      title,
      description,
      price,
      category: category || null,
      coverImageUrl: coverImageUrl || null,
      fileUrl: fileUrl || null,
      authorId: authorProfileId,
      // Admin uploads go live immediately — no approval queue
      status: isAdmin ? "APPROVED" : "PENDING",
    },
  });

  // Only notify admin for author submissions, not admin's own uploads
  if (!isAdmin) {
    void sendBookSubmittedEmail({
      bookTitle: book.title,
      authorName: session.user.name ?? "Unknown Author",
      bookId: book.id,
    });
  }

  return NextResponse.json({ book }, { status: 201 });
}
