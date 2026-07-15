import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/book-card";
import { toBookCardData } from "@/lib/books";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const author = await prisma.authorProfile.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });
  return { title: author ? `${author.user.name} — ReadHive` : "Author — ReadHive" };
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const letters =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.slice(0, 2);
  return (
    <div
      className="flex items-center justify-center rounded-full bg-primary text-4xl font-bold uppercase text-primary-foreground shadow-lg"
      style={{ width: 96, height: 96, fontFamily: "var(--font-cormorant), Georgia, serif" }}
    >
      {letters.toUpperCase()}
    </div>
  );
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const author = await prisma.authorProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, createdAt: true } },
      books: {
        where: { status: "APPROVED" },
        include: { author: { include: { user: { select: { name: true } } } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { books: { where: { status: "APPROVED" } } } },
    },
  });

  if (!author) notFound();

  const totalSales = await prisma.purchase.count({
    where: { book: { authorId: id, status: "APPROVED" } },
  });

  const joinedYear = new Date(author.user.createdAt).getFullYear();

  return (
    <div>
      {/* ── Hero banner ──────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/60 to-background py-16 dark:from-amber-950/25 dark:via-background dark:to-background">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-8 left-1/4 h-32 w-64 rounded-full bg-amber-300/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <Initials name={author.user.name} />

            <div className="flex-1">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Author
              </p>
              <h1
                className="text-5xl font-light"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {author.user.name}
              </h1>
              {author.bio && (
                <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                  {author.bio}
                </p>
              )}

              {/* Stats row */}
              <div className="mt-6 flex flex-wrap justify-center gap-8 sm:justify-start">
                {[
                  { label: "Books", value: author._count.books },
                  { label: "Sales", value: totalSales },
                  { label: "Member since", value: joinedYear },
                ].map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <p
                      className="text-3xl font-semibold text-primary"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Books grid ───────────────────────────────────── */}
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12">
        <h2
          className="text-3xl font-semibold"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Books by {author.user.name}
        </h2>

        {author.books.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {author.books.map((book, i) => (
              <div
                key={book.id}
                className="animate-scale-in"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <BookCard book={toBookCardData(book)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <span className="text-4xl">📝</span>
            <p className="text-muted-foreground">This author hasn&apos;t published any books yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
