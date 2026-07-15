import type { Metadata } from "next";
import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toBookCardData } from "@/lib/books";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Shop — ReadHive",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "title_asc", label: "A → Z" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const { q, category, sort, minPrice, maxPrice } = await searchParams;

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : sort === "title_asc"
          ? { title: "asc" as const }
          : { createdAt: "desc" as const };

  const minP = minPrice ? parseFloat(minPrice) : undefined;
  const maxP = maxPrice ? parseFloat(maxPrice) : undefined;

  const [books, categoryRows] = await Promise.all([
    prisma.book.findMany({
      where: {
        status: "APPROVED",
        ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
        ...(category ? { category } : {}),
        ...((minP !== undefined || maxP !== undefined)
          ? {
              price: {
                ...(minP !== undefined ? { gte: minP } : {}),
                ...(maxP !== undefined ? { lte: maxP } : {}),
              },
            }
          : {}),
      },
      include: { author: { include: { user: { select: { name: true } } } } },
      orderBy,
    }),
    prisma.book.findMany({
      where: { status: "APPROVED", category: { not: null } },
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
  ]);

  const hasFilters = !!(q || category || sort || minPrice || maxPrice);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      {/* Header */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
          Bookstore
        </p>
        <h1 className="text-4xl font-bold">Shop</h1>
        <p className="mt-1 text-muted-foreground">
          Browse {books.length} book{books.length !== 1 ? "s" : ""} from authors across ReadHive
        </p>
      </div>

      {/* Filter bar */}
      <form
        action="/shop"
        className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4 shadow-sm"
      >
        {/* Search */}
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Search</label>
          <Input name="q" placeholder="Search by title..." defaultValue={q} />
        </div>

        {/* Category */}
        <div className="min-w-[160px] space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Category</label>
          <select
            name="category"
            defaultValue={category ?? ""}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
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
        </div>

        {/* Price range */}
        <div className="min-w-[120px] space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Min price (₦)</label>
          <Input name="minPrice" type="number" min="0" step="1" placeholder="0" defaultValue={minPrice} className="w-full" />
        </div>
        <div className="min-w-[120px] space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Max price (₦)</label>
          <Input name="maxPrice" type="number" min="0" step="1" placeholder="Any" defaultValue={maxPrice} className="w-full" />
        </div>

        {/* Sort */}
        <div className="min-w-[180px] space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Sort by</label>
          <select
            name="sort"
            defaultValue={sort ?? "newest"}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button type="submit">Search</Button>
          {hasFilters && (
            <Button
              render={<Link href="/shop">Clear</Link>}
              variant="outline"
            />
          )}
        </div>
      </form>

      {/* Active filters summary */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Active filters:</span>
          {q && <span className="rounded-full bg-primary/10 px-3 py-0.5 text-primary">"{q}"</span>}
          {category && <span className="rounded-full bg-primary/10 px-3 py-0.5 text-primary">{category}</span>}
          {minPrice && <span className="rounded-full bg-primary/10 px-3 py-0.5 text-primary">From ₦{minPrice}</span>}
          {maxPrice && <span className="rounded-full bg-primary/10 px-3 py-0.5 text-primary">Up to ₦{maxPrice}</span>}
          {sort && sort !== "newest" && (
            <span className="rounded-full bg-primary/10 px-3 py-0.5 text-primary">
              {SORT_OPTIONS.find((o) => o.value === sort)?.label}
            </span>
          )}
        </div>
      )}

      {/* Results */}
      {books.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {books.map((book, i) => (
            <div
              key={book.id}
              className="animate-scale-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <BookCard book={toBookCardData(book)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="text-5xl">📭</span>
          <p className="text-lg font-medium">No books found</p>
          <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
          <Button render={<Link href="/shop">Clear all filters</Link>} variant="outline" />
        </div>
      )}
    </div>
  );
}
