"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type BookFormValues = {
  id?: string;
  title: string;
  description: string;
  price: string;
  category: string;
  coverImageUrl: string;
  fileUrl: string;
};

export function BookForm({ initialValues }: { initialValues?: BookFormValues }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!initialValues?.id;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      category: formData.get("category"),
      coverImageUrl: formData.get("coverImageUrl"),
      fileUrl: formData.get("fileUrl"),
    };

    startTransition(async () => {
      const res = await fetch(
        isEditing ? `/api/books/${initialValues!.id}` : "/api/books",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      toast.success(
        isEditing ? "Book updated — pending re-approval." : "Book submitted for approval.",
      );
      router.push("/dashboard/author");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={initialValues?.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialValues?.description}
          rows={5}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialValues?.price}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            defaultValue={initialValues?.category}
            placeholder="e.g. Fiction"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="coverImageUrl">Cover image URL</Label>
        <Input
          id="coverImageUrl"
          name="coverImageUrl"
          type="url"
          defaultValue={initialValues?.coverImageUrl}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fileUrl">Ebook file URL</Label>
        <Input
          id="fileUrl"
          name="fileUrl"
          type="url"
          defaultValue={initialValues?.fileUrl}
          placeholder="https://..."
        />
        <p className="text-xs text-muted-foreground">
          Link to a downloadable file (PDF, EPUB). Direct file uploads are coming soon.
        </p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : isEditing ? "Save changes" : "Submit for approval"}
      </Button>
    </form>
  );
}
