import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export class UserExistsError extends Error {}

export async function createUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new UserExistsError("An account with this email already exists.");
  }

  return prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 10) },
  });
}
