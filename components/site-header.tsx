import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/authors", label: "Authors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function BookHiveLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Hexagon background */}
      <path
        d="M16 2L28.124 9V23L16 30L3.876 23V9L16 2Z"
        fill="currentColor"
        className="text-primary"
        opacity="0.12"
      />
      <path
        d="M16 2L28.124 9V23L16 30L3.876 23V9L16 2Z"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Open book pages */}
      <path
        d="M16 10 C13 10 10 11 10 11 L10 21 C10 21 13 20 16 20"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M16 10 C19 10 22 11 22 11 L22 21 C22 21 19 20 16 20"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line
        x1="16" y1="10" x2="16" y2="20"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          <BookHiveLogo />
          <span>
            Read<span className="text-primary">Hive</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Button render={<Link href="/dashboard">Dashboard</Link>} variant="ghost" size="sm" />
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button variant="outline" size="sm" type="submit">
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button render={<Link href="/login">Log in</Link>} variant="ghost" size="sm" />
              <Button render={<Link href="/register">Sign up</Link>} size="sm" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
