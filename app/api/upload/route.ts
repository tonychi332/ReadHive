import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { createUploadUrl } from "@/lib/storage";

const schema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  kind: z.enum(["cover", "ebook"]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const ownerSegment = session.user.authorProfileId ?? session.user.id;

  // Authors must have an author profile; admins can upload without one
  if (!session.user.authorProfileId && !isAdmin) {
    return NextResponse.json({ error: "You need an author profile to upload files." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { filename, contentType, kind } = parsed.data;
  const key = `${kind}/${ownerSegment}/${Date.now()}-${filename}`;

  try {
    const result = await createUploadUrl(key, contentType);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 503 },
    );
  }
}
