"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
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

async function uploadFile(file: File, kind: "cover" | "ebook"): Promise<string> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type, kind }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Upload failed");

  await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  return data.publicUrl as string;
}

export function BookForm({ initialValues }: { initialValues?: BookFormValues }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>(initialValues?.coverImageUrl ?? "");
  const [coverUrl, setCoverUrl] = useState<string>(initialValues?.coverImageUrl ?? "");
  const [fileUrl, setFileUrl] = useState<string>(initialValues?.fileUrl ?? "");
  const [coverUploading, setCoverUploading] = useState(false);
  const [ebookUploading, setEbookUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const ebookInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialValues?.id;

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    setCoverUploading(true);
    try {
      const url = await uploadFile(file, "cover");
      setCoverUrl(url);
      toast.success("Cover image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cover upload failed");
      setCoverPreview(coverUrl);
    } finally {
      setCoverUploading(false);
    }
  };

  const handleEbookChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEbookUploading(true);
    try {
      const url = await uploadFile(file, "ebook");
      setFileUrl(url);
      toast.success("Ebook file uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ebook upload failed");
    } finally {
      setEbookUploading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      category: formData.get("category"),
      coverImageUrl: coverUrl,
      fileUrl: fileUrl,
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

  const isUploading = coverUploading || ebookUploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <Label htmlFor="price">Price (₦ Naira)</Label>
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

      {/* Cover image upload */}
      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div className="flex items-start gap-4">
          <div
            className="flex h-32 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-input bg-muted text-center text-xs text-muted-foreground transition-colors hover:border-primary"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
            ) : (
              <span className="px-2">Click to upload</span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => coverInputRef.current?.click()}
              disabled={coverUploading}
            >
              {coverUploading ? "Uploading..." : "Choose image"}
            </Button>
            {coverUrl && (
              <p className="break-all text-xs text-muted-foreground">{coverUrl}</p>
            )}
          </div>
        </div>
      </div>

      {/* Ebook file upload */}
      <div className="space-y-2">
        <Label>Ebook File</Label>
        <div className="flex items-center gap-4">
          <input
            ref={ebookInputRef}
            type="file"
            accept=".pdf,.epub,.mobi"
            className="hidden"
            onChange={handleEbookChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => ebookInputRef.current?.click()}
            disabled={ebookUploading}
          >
            {ebookUploading ? "Uploading..." : fileUrl ? "Replace file" : "Upload PDF / EPUB"}
          </Button>
          {fileUrl && (
            <span className="text-sm text-muted-foreground">
              ✓ File uploaded
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Supported formats: PDF, EPUB, MOBI</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isPending || isUploading}>
        {isPending ? "Saving..." : isEditing ? "Save changes" : "Submit for approval"}
      </Button>
    </form>
  );
}
