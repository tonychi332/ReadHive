import type { DefaultSession } from "next-auth";
import type { Role } from "@/lib/generated/prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
    authorProfileId: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      authorProfileId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    authorProfileId: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: Role;
    authorProfileId: string | null;
  }
}
