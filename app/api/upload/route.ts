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
  if (!session?.user?.authorProfileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { filename, contentType, kind } = parsed.data;
  const key = `${kind}/${session.user.authorProfileId}/${Date.now()}-${filename}`;

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
