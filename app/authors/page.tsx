import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Authors — ReadHive",
};

export default async function AuthorsPage() {
  const authors = await prisma.authorProfile.findMany({
    where: { books: { some: { status: "APPROVED" } } },
    include: {
      user: { select: { name: true } },
      _count: { select: { books: { where: { status: "APPROVED" } } } },
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold">Authors</h1>
        <p className="text-muted-foreground">Meet the writers publishing on ReadHive</p>
      </div>
      {authors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {authors.map((author) => (
            <Link key={author.id} href={`/authors/${author.id}`}>
              <Card className="h-full transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle>{author.user.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {author.bio ?? "No bio yet."}
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    {author._count.books} book{author._count.books === 1 ? "" : "s"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No authors yet.</p>
      )}
    </div>
  );
}
