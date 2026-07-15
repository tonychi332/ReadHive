import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  await prisma.platformSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, commissionRate: 0.4 },
  });

  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const admin = await prisma.user.upsert({
    where: { email: "tonychinonso19@gmail.com" },
    update: {},
    create: {
      name: "Anthony Leonard",
      email: "tonychinonso19@gmail.com",
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
    },
  });

  const authorPassword = process.env.SEED_AUTHOR_PASSWORD ?? "ChangeMe123!";
  const authorUser = await prisma.user.upsert({
    where: { email: "demo.author@readhive.test" },
    update: {},
    create: {
      name: "Demo Author",
      email: "demo.author@readhive.test",
      passwordHash: await bcrypt.hash(authorPassword, 10),
      role: "USER",
      authorProfile: {
        create: {
          bio: "Demo author account used for local development and testing.",
        },
      },
    },
    include: { authorProfile: true },
  });

  const authorProfileId =
    authorUser.authorProfile?.id ??
    (await prisma.authorProfile.findUniqueOrThrow({ where: { userId: authorUser.id } })).id;

  const sampleBooks = [
    {
      title: "The Hive Mind",
      description: "A short story collection exploring collective intelligence and creativity.",
      price: 9.99,
      category: "Fiction",
      status: "APPROVED" as const,
    },
    {
      title: "Digital Publishing 101",
      description: "A practical guide for new authors publishing their first ebook.",
      price: 14.99,
      category: "Non-Fiction",
      status: "APPROVED" as const,
    },
    {
      title: "Notes from a Nigerian Startup",
      description: "Lessons learned building a digital business from Lagos to the world.",
      price: 12.5,
      category: "Business",
      status: "PENDING" as const,
    },
  ];

  for (const book of sampleBooks) {
    const existing = await prisma.book.findFirst({
      where: { title: book.title, authorId: authorProfileId },
    });
    if (!existing) {
      await prisma.book.create({
        data: { ...book, authorId: authorProfileId },
      });
    }
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${admin.email} / ${adminPassword}`);
  console.log(`Demo author login: ${authorUser.email} / ${authorPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
