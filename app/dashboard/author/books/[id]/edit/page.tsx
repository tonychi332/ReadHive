import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BookForm } from "@/components/book-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Edit Book — ReadHive",
};

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.authorProfileId) {
    redirect("/dashboard/reader");
  }

  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book || book.authorId !== session.user.authorProfileId) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold">Edit Book</h1>
        <p className="text-muted-foreground">
          Editing this book will reset its status to pending until an admin re-approves it.
        </p>
      </div>
      <BookForm
        initialValues={{
          id: book.id,
          title: book.title,
          description: book.description,
          price: book.price.toString(),
          category: book.category ?? "",
          coverImageUrl: book.coverImageUrl ?? "",
          fileUrl: book.fileUrl ?? "",
        }}
      />
    </div>
  );
}
