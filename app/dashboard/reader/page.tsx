import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BecomeAuthorButton } from "@/components/become-author-button";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { toBookCardData } from "@/lib/books";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "My Library — ReadHive",
};

export default async function ReaderDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const [purchases, favourites] = await Promise.all([
    prisma.purchase.findMany({
      where: { userId: session.user.id },
      include: {
        book: { include: { author: { include: { user: { select: { name: true } } } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.favourite.findMany({
      where: { userId: session.user.id },
      include: {
        book: { include: { author: { include: { user: { select: { name: true } } } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Library</h1>
          <p className="text-muted-foreground">Your purchases and favourites</p>
        </div>
        {!session.user.authorProfileId && (
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle className="text-base">Become an Author</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Start publishing and selling your own ebooks on ReadHive.
              </p>
              <BecomeAuthorButton />
            </CardContent>
          </Card>
        )}
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">My Books</h2>
        {purchases.length > 0 ? (
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div>
                    <Link href={`/books/${purchase.book.id}`} className="font-medium hover:underline">
                      {purchase.book.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      by {purchase.book.author.user.name}
                    </p>
                  </div>
                  {purchase.book.fileUrl ? (
                    <Button
                      render={
                        <a href={purchase.book.fileUrl} target="_blank" rel="noreferrer">
                          Download
                        </a>
                      }
                      size="sm"
                    />
                  ) : (
                    <Button size="sm" disabled>
                      File unavailable
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            You haven&apos;t purchased any books yet.{" "}
            <Link href="/shop" className="underline">
              Browse the shop
            </Link>
            .
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Favourites</h2>
        {favourites.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {favourites.map((fav) => (
              <BookCard key={fav.bookId} book={toBookCardData(fav.book)} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No favourites yet.</p>
        )}
      </section>
    </div>
  );
}
