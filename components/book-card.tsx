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
    <Link
      href={`/books/${book.id}`}
      className="group block transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl bg-muted shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
        {book.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-amber-50 to-orange-100 p-4 text-center dark:from-amber-950/40 dark:to-orange-950/30">
            <span className="text-3xl">📚</span>
            <p className="text-xs font-medium text-muted-foreground">{book.title}</p>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1 px-0.5">
        <p className="line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-primary">
          {book.title}
        </p>
        <p className="text-sm text-muted-foreground">{book.author.user.name}</p>
        <div className="flex items-center justify-between pt-0.5">
          <span className="font-bold text-primary">${book.price.toFixed(2)}</span>
          {book.category && <Badge variant="secondary">{book.category}</Badge>}
        </div>
      </div>
    </Link>
  );
}
