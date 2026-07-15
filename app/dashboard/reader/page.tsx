import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BecomeAuthorButton } from "@/components/become-author-button";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const totalSpent = purchases.reduce((sum, p) => sum + p.amount.toNumber(), 0);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Dashboard
          </p>
          <h1 className="text-4xl font-bold">My Library</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {session.user.name?.split(" ")[0]}
          </p>
        </div>
        {!session.user.authorProfileId && (
          <Card className="max-w-sm border-primary/20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-background">
            <CardHeader>
              <CardTitle className="text-base">✍️ Become an Author</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Start publishing and selling your own ebooks. Earn 60% of every sale.
              </p>
              <BecomeAuthorButton />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Books owned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{purchases.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Favourites</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{favourites.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₦{totalSpent.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Purchased books */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            My Books
            {purchases.length > 0 && (
              <span className="ml-2 text-base font-normal text-muted-foreground">
                ({purchases.length})
              </span>
            )}
          </h2>
          <Button render={<Link href="/shop">Browse more</Link>} variant="outline" size="sm" />
        </div>

        {purchases.length > 0 ? (
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 py-4">
                  {/* Cover thumbnail */}
                  <div className="h-16 w-12 shrink-0 overflow-hidden rounded-sm bg-muted">
                    {purchase.book.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={purchase.book.coverImageUrl}
                        alt={purchase.book.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 text-lg dark:from-amber-900/40 dark:to-orange-900/30">
                        📖
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/books/${purchase.book.id}`}
                      className="block truncate font-semibold hover:text-primary"
                    >
                      {purchase.book.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      by {purchase.book.author.user.name}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        Purchased {purchase.createdAt.toLocaleDateString()}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        ₦{purchase.amount.toNumber().toFixed(2)}
                      </Badge>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
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
                        Unavailable
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
            <span className="text-5xl">📚</span>
            <p className="text-lg font-medium">Your library is empty</p>
            <p className="text-sm text-muted-foreground">
              Browse the shop and purchase your first book.
            </p>
            <Button render={<Link href="/shop">Browse the shop</Link>} />
          </div>
        )}
      </section>

      {/* Favourites */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Favourites
          {favourites.length > 0 && (
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({favourites.length})
            </span>
          )}
        </h2>
        {favourites.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {favourites.map((fav) => (
              <BookCard key={fav.bookId} book={toBookCardData(fav.book)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
            <span className="text-4xl">🤍</span>
            <p className="text-muted-foreground">No favourites yet — heart a book to save it here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
