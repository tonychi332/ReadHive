import type { Metadata } from "next";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toBookCardData } from "@/lib/books";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Shop — ReadHive",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const [books, categoryRows] = await Promise.all([
    prisma.book.findMany({
      where: {
        status: "APPROVED",
        ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
        ...(category ? { category } : {}),
      },
      include: { author: { include: { user: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.findMany({
      where: { status: "APPROVED", category: { not: null } },
      distinct: ["category"],
      select: { category: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold">Shop</h1>
        <p className="text-muted-foreground">Browse books from authors across ReadHive</p>
      </div>

      <form className="flex flex-wrap gap-2" action="/shop">
        <Input
          name="q"
          placeholder="Search by title..."
          defaultValue={q}
          className="max-w-xs"
        />
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs"
        >
          <option value="">All categories</option>
          {categoryRows.map(
            (row) =>
              row.category && (
                <option key={row.category} value={row.category}>
                  {row.category}
                </option>
              ),
          )}
        </select>
        <Button type="submit">Search</Button>
      </form>

      {books.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={toBookCardData(book)} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No books found.</p>
      )}
    </div>
  );
}
