import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Authors — ReadHive",
};

function AuthorAvatar({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const letters =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : name.slice(0, 2);
  return (
    <div
      className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold uppercase text-primary-foreground"
      style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
    >
      {letters.toUpperCase()}
    </div>
  );
}

export default async function AuthorsPage() {
  const authors = await prisma.authorProfile.findMany({
    where: { books: { some: { status: "APPROVED" } } },
    include: {
      user: { select: { name: true } },
      _count: { select: { books: { where: { status: "APPROVED" } } } },
    },
    orderBy: { books: { _count: "desc" } },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      {/* Header */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
          Community
        </p>
        <h1
          className="text-4xl font-bold"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Authors
        </h1>
        <p className="mt-1 text-muted-foreground">
          Meet the {authors.length} writer{authors.length !== 1 ? "s" : ""} publishing on ReadHive
        </p>
      </div>

      {authors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {authors.map((author, i) => (
            <Link
              key={author.id}
              href={`/authors/${author.id}`}
              className="animate-scale-in group"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex h-full items-start gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-md">
                <AuthorAvatar name={author.user.name} />
                <div className="flex-1 min-w-0">
                  <h2 className="truncate font-semibold transition-colors group-hover:text-primary">
                    {author.user.name}
                  </h2>
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                    {author.bio ?? "ReadHive author"}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-primary">
                    {author._count.books} book{author._count.books === 1 ? "" : "s"} published
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <span className="text-5xl">✍️</span>
          <p className="text-lg font-medium">No authors yet</p>
          <p className="text-sm text-muted-foreground">Be the first to publish on ReadHive.</p>
        </div>
      )}
    </div>
  );
}
