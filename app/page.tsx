import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { getFeaturedBooks, getNewArrivals } from "@/lib/books";

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([getFeaturedBooks(), getNewArrivals()]);

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-12">
      <section className="space-y-4 py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Discover, read, and publish ebooks on ReadHive
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          A trusted digital library and online bookstore where authors share their
          work and readers find their next favourite book.
        </p>
        <div className="flex justify-center gap-4">
          <Button render={<Link href="/shop">Browse Books</Link>} size="lg" />
          <Button
            render={<Link href="/register">Become an Author</Link>}
            size="lg"
            variant="outline"
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Books</h2>
          <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {featured.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No books available yet. Check back soon!</p>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">New Arrivals</h2>
          <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {newArrivals.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No books available yet. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
