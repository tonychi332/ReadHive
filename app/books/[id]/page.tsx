import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PurchaseActions } from "./purchase-actions";

export default async function BookDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);

  const book = await prisma.book.findUnique({
    where: { id },
    include: { author: { include: { user: { select: { name: true } } } } },
  });

  if (!book || book.status !== "APPROVED") {
    notFound();
  }

  const session = await auth();
  let isOwned = false;
  let isFavourited = false;

  if (session?.user) {
    const [purchase, favourite] = await Promise.all([
      prisma.purchase.findUnique({
        where: { userId_bookId: { userId: session.user.id, bookId: book.id } },
      }),
      prisma.favourite.findUnique({
        where: { userId_bookId: { userId: session.user.id, bookId: book.id } },
      }),
    ]);
    isOwned = !!purchase;
    isFavourited = !!favourite;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="grid gap-8 sm:grid-cols-[280px_1fr]">
        <div className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
          {book.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={book.coverImageUrl} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <span className="p-4 text-center text-muted-foreground">{book.title}</span>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-muted-foreground">
              by{" "}
              <Link href={`/authors/${book.author.id}`} className="hover:underline">
                {book.author.user.name}
              </Link>
            </p>
          </div>
          {book.category && <Badge variant="secondary">{book.category}</Badge>}
          <p className="text-2xl font-semibold">₦{book.price.toNumber().toFixed(2)}</p>
          <p className="leading-relaxed text-muted-foreground">{book.description}</p>

          <PurchaseActions
            bookId={book.id}
            isLoggedIn={!!session?.user}
            isOwned={isOwned}
            isFavourited={isFavourited}
            fileUrl={book.fileUrl}
            paymentResult={sp.payment ?? null}
          />
        </div>
      </div>
    </div>
  );
}
