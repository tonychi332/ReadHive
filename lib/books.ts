import type { BookCardData } from "@/components/book-card";
import { prisma } from "./prisma";

const bookCardInclude = {
  author: { include: { user: { select: { name: true } } } },
} as const;

type BookWithAuthor = {
  id: string;
  title: string;
  price: { toNumber: () => number };
  category: string | null;
  coverImageUrl: string | null;
  author: { user: { name: string } };
};

export function toBookCardData(book: BookWithAuthor): BookCardData {
  return {
    id: book.id,
    title: book.title,
    price: book.price.toNumber(),
    category: book.category,
    coverImageUrl: book.coverImageUrl,
    author: book.author,
  };
}

export async function getFeaturedBooks(limit = 8) {
  const books = await prisma.book.findMany({
    where: { status: "APPROVED" },
    include: bookCardInclude,
    orderBy: { purchases: { _count: "desc" } },
    take: limit,
  });
  return books.map(toBookCardData);
}

export async function getNewArrivals(limit = 8) {
  const books = await prisma.book.findMany({
    where: { status: "APPROVED" },
    include: bookCardInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return books.map(toBookCardData);
}
