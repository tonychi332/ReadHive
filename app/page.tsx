import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { getFeaturedBooks, getNewArrivals } from "@/lib/books";

/* ── Floating 3-D book covers ───────────────────────────── */

const SHOWCASE_BOOKS = [
  {
    title: "The Midnight Garden",
    author: "Elena Voss",
    cover: "linear-gradient(155deg, #f59e0b 0%, #d97706 55%, #92400e 100%)",
    spine: "#78350f",
    rotate: "-14deg",
    top: "40px",
    left: "0px",
    delay: "0s",
    z: 10,
  },
  {
    title: "Stories from Lagos",
    author: "Amara Obi",
    cover: "linear-gradient(155deg, #818cf8 0%, #4f46e5 55%, #312e81 100%)",
    spine: "#1e1b4b",
    rotate: "2deg",
    top: "0px",
    left: "110px",
    delay: "0.55s",
    z: 20,
  },
  {
    title: "The Soul Reader",
    author: "Marcus Chen",
    cover: "linear-gradient(155deg, #f472b6 0%, #db2777 55%, #831843 100%)",
    spine: "#500724",
    rotate: "16deg",
    top: "28px",
    left: "220px",
    delay: "1.1s",
    z: 10,
  },
];

function FloatingBooks() {
  return (
    <div className="relative" style={{ width: "360px", height: "300px" }}>
      {/* ambient glow behind books */}
      <div
        className="absolute inset-0 blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, oklch(0.68 0.18 55) 0%, transparent 70%)",
        }}
      />

      {SHOWCASE_BOOKS.map((book) => (
        /* outer wrapper: static rotation */
        <div
          key={book.title}
          className="absolute"
          style={{
            width: "130px",
            height: "185px",
            top: book.top,
            left: book.left,
            transform: `rotate(${book.rotate})`,
            zIndex: book.z,
          }}
        >
          {/* inner: float animation (pure translateY, no conflict) */}
          <div className="animate-float h-full w-full" style={{ animationDelay: book.delay }}>
            {/* book cover */}
            <div
              className="h-full w-full rounded-r-sm"
              style={{
                background: book.cover,
                /* right offset shadow = spine thickness illusion */
                boxShadow: `6px 6px 0 ${book.spine}, 0 24px 48px rgba(0,0,0,0.22)`,
              }}
            >
              <div className="flex h-full flex-col justify-between p-4 text-white">
                <span
                  className="text-[9px] uppercase tracking-[0.18em] opacity-50 font-semibold"
                  style={{ fontFamily: "var(--font-lato), sans-serif" }}
                >
                  ReadHive
                </span>

                <span
                  className="text-sm font-semibold leading-snug"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "15px" }}
                >
                  {book.title}
                </span>

                <div>
                  <div className="mb-2 h-px bg-white/20" />
                  <span
                    className="text-[10px] opacity-50"
                    style={{ fontFamily: "var(--font-lato), sans-serif" }}
                  >
                    {book.author}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([getFeaturedBooks(), getNewArrivals()]);

  return (
    <div className="space-y-20">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        {/* warm gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/50 to-background dark:from-amber-950/25 dark:via-background dark:to-background" />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-24">
          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* ── Left: copy ── */}
            <div className="text-center lg:text-left">
              <p className="animate-fade-in mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Your Digital Reading Companion
              </p>

              <h1
                className="animate-fade-in-up delay-100 text-6xl font-light leading-[1.08] tracking-tight sm:text-7xl lg:text-8xl"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Discover Books<br />
                That{" "}
                <em className="font-semibold not-italic text-primary">
                  Move Your Soul
                </em>
              </h1>

              <p className="animate-fade-in-up delay-200 mx-auto mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground lg:mx-0">
                A trusted digital library where authors share their work and
                readers find their next favourite story.
              </p>

              <div className="animate-fade-in-up delay-300 mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Button
                  render={<Link href="/shop">Browse Books</Link>}
                  size="lg"
                  className="px-8 text-base shadow-lg shadow-primary/20"
                />
                <Button
                  render={<Link href="/register">Become an Author</Link>}
                  size="lg"
                  variant="outline"
                  className="px-8 text-base"
                />
              </div>

              {/* Stats */}
              <div className="animate-fade-in delay-500 mt-14 flex flex-wrap justify-center gap-10 lg:justify-start">
                {[
                  { label: "Books", value: "500+" },
                  { label: "Authors", value: "120+" },
                  { label: "Readers", value: "10K+" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p
                      className="text-4xl font-semibold text-primary"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: floating books ── */}
            <div className="animate-fade-in delay-300 hidden items-center justify-center lg:flex">
              <FloatingBooks />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured books ───────────────────────────────── */}
      <section className="mx-auto max-w-6xl space-y-8 px-4">
        <div className="animate-slide-in-left flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Editor&apos;s picks
            </p>
            <h2 className="text-4xl font-semibold" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
              Featured Books
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            View all
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {featured.map((book, i) => (
              <div
                key={book.id}
                className="animate-scale-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No books yet — check back soon!</p>
        )}
      </section>

      {/* ── Why ReadHive ─────────────────────────────────── */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-20 dark:from-amber-950/20 dark:to-background">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2
            className="animate-fade-in-up text-4xl font-semibold"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Why ReadHive?
          </h2>
          <p className="animate-fade-in-up delay-100 mx-auto mt-3 max-w-md text-muted-foreground">
            Built for authors and readers who love great stories.
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: "📖",
                title: "Curated Library",
                desc: "Every book is reviewed before it goes live — quality you can trust.",
              },
              {
                icon: "✍️",
                title: "Author-First Revenue",
                desc: "Authors keep 60% of every sale. No hidden fees, no fine print.",
              },
              {
                icon: "⚡",
                title: "Instant Downloads",
                desc: "PDF, EPUB, MOBI — delivered the moment you pay.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="animate-scale-in rounded-2xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div
                  className="animate-float mb-5 text-5xl"
                  style={{ animationDelay: `${i * 0.55}s` }}
                >
                  {item.icon}
                </div>
                <h3
                  className="mb-2 text-2xl font-semibold"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New arrivals ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl space-y-8 px-4 pb-20">
        <div className="animate-slide-in-left flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Just dropped
            </p>
            <h2 className="text-4xl font-semibold" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            View all
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {newArrivals.map((book, i) => (
              <div
                key={book.id}
                className="animate-scale-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No new arrivals yet — check back soon!</p>
        )}
      </section>
    </div>
  );
}
