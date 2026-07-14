import Link from "next/link";

const legalLinks = [
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/copyright", label: "Copyright Policy" },
  { href: "/legal/author-agreement", label: "Author Agreement" },
];

const exploreLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/authors", label: "Authors" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">ReadHive</p>
          <p className="mt-2 text-muted-foreground">
            A trusted digital library and online bookstore empowering authors to
            publish their work and helping readers access valuable books from
            anywhere.
          </p>
        </div>
        <div>
          <p className="mb-2 font-semibold">Explore</p>
          <ul className="space-y-1">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold">Legal</p>
          <ul className="space-y-1">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} ReadHive, founded by Anthony Leonard. All rights reserved.
      </div>
    </footer>
  );
}
