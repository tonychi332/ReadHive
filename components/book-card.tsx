import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export type BookCardData = {
  id: string;
  title: string;
  price: number;
  category: string | null;
  coverImageUrl: string | null;
  author: { user: { name: string } };
};

export function BookCard({ book }: { book: BookCardData }) {
  return (
    <Link href={`/books/${book.id}`} className="group block">
      <div className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
        {book.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">{book.title}</div>
        )}
      </div>
      <div className="mt-2 space-y-1">
        <p className="line-clamp-2 font-medium leading-tight">{book.title}</p>
        <p className="text-sm text-muted-foreground">{book.author.user.name}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold">${book.price.toFixed(2)}</span>
          {book.category && <Badge variant="secondary">{book.category}</Badge>}
        </div>
      </div>
    </Link>
  );
}
