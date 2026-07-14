import { notFound } from "next/navigation";
import { BookCard } from "@/components/book-card";
import { toBookCardData } from "@/lib/books";
import { prisma } from "@/lib/prisma";

export default async function AuthorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const author = await prisma.authorProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      books: {
        where: { status: "APPROVED" },
        include: { author: { include: { user: { select: { name: true } } } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!author) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold">{author.user.name}</h1>
        {author.bio && <p className="mt-2 max-w-2xl text-muted-foreground">{author.bio}</p>}
      </div>
      {author.books.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {author.books.map((book) => (
            <BookCard key={book.id} book={toBookCardData(book)} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">This author hasn&apos;t published any books yet.</p>
      )}
    </div>
  );
}
