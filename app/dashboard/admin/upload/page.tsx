import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookForm } from "@/components/book-form";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Upload a Book — Admin — ReadHive",
};

export default async function AdminUploadBookPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold">Upload a Book</h1>
        <p className="text-muted-foreground">
          Books uploaded by admin go live immediately — no approval queue.
        </p>
      </div>
      <BookForm />
    </div>
  );
}
