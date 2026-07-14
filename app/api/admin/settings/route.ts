import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ commissionRate: z.coerce.number().min(0).max(1) });

export async function GET() {
  const settings = await prisma.platformSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  return NextResponse.json({ commissionRate: settings.commissionRate.toNumber() });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const settings = await prisma.platformSettings.upsert({
    where: { id: 1 },
    update: { commissionRate: parsed.data.commissionRate },
    create: { id: 1, commissionRate: parsed.data.commissionRate },
  });

  return NextResponse.json({ commissionRate: settings.commissionRate.toNumber() });
}
