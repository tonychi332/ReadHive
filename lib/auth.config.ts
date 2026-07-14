import type { NextAuthConfig } from "next-auth";

// Edge-safe config shared between middleware and the full auth setup.
// Must not import anything that depends on Prisma/pg.
export default {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.authorProfileId = user.authorProfileId;
      }
      if (trigger === "update" && session?.authorProfileId) {
        token.authorProfileId = session.authorProfileId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role;
        session.user.authorProfileId = token.authorProfileId;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
