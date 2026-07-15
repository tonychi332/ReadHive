import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { getFeaturedBooks, getNewArrivals } from "@/lib/books";

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([getFeaturedBooks(), getNewArrivals()]);

  return (
    <div className="space-y-20">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-background" />

        {/* Decorative floating shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="animate-float absolute -right-8 top-12 h-64 w-48 rounded-lg border border-primary/10 bg-primary/5 shadow-sm"
            style={{ transform: "rotate(12deg)" }}
          />
          <div
            className="animate-float delay-300 absolute right-24 top-4 h-48 w-36 rounded-lg border border-amber-300/30 bg-amber-100/40 shadow-sm dark:bg-amber-900/20"
            style={{ transform: "rotate(-6deg)" }}
          />
          <div
            className="animate-pulse-slow absolute -left-4 bottom-8 h-40 w-32 rounded-lg border border-primary/10 bg-primary/5"
            style={{ transform: "rotate(-10deg)" }}
          />
          <div className="animate-pulse-slow delay-400 absolute left-16 bottom-16 h-28 w-20 rounded-lg border border-amber-200/40 bg-amber-50/60 dark:bg-amber-900/10" />
        </div>

        {/* Hero content */}
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center">
          <p className="animate-fade-in mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            Your Digital Reading Companion
          </p>

          <h1 className="animate-fade-in-up delay-100 mx-auto max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Discover Books That{" "}
            <span className="shimmer-text">Move Your Soul</span>
          </h1>

          <p className="animate-fade-in-up delay-200 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A trusted digital library and online bookstore where authors share
            their work and readers find their next favourite story.
          </p>

          <div className="animate-fade-in-up delay-300 mt-10 flex flex-wrap justify-center gap-4">
            <Button render={<Link href="/shop">Browse Books</Link>} size="lg" className="px-8 text-base shadow-md" />
            <Button
              render={<Link href="/register">Become an Author</Link>}
              size="lg"
              variant="outline"
              className="px-8 text-base"
            />
          </div>

          {/* Stats row */}
          <div className="animate-fade-in delay-500 mt-16 flex flex-wrap justify-center gap-12 text-center">
            {[
              { label: "Books", value: "500+" },
              { label: "Authors", value: "120+" },
              { label: "Readers", value: "10K+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured books ───────────────────────────────── */}
      <section className="mx-auto max-w-6xl space-y-8 px-4">
        <div className="animate-slide-in-left flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
              Editor&apos;s picks
            </p>
            <h2 className="text-3xl font-bold">Featured Books</h2>
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
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16 dark:from-amber-950/20 dark:to-orange-950/10">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="animate-fade-in-up text-3xl font-bold">Why ReadHive?</h2>
          <p className="animate-fade-in-up delay-100 mt-3 text-muted-foreground">
            Built for authors and readers who love great stories.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: "📖",
                title: "Curated Library",
                desc: "Every book is reviewed before it goes live — quality you can trust.",
              },
              {
                icon: "✍️",
                title: "Author-First Revenue",
                desc: "Authors earn 60% of every sale. No hidden fees, no fine print.",
              },
              {
                icon: "⚡",
                title: "Instant Downloads",
                desc: "PDF, EPUB, MOBI — your books delivered the moment you pay.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="animate-scale-in rounded-2xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="animate-float mb-4 text-4xl" style={{ animationDelay: `${i * 0.5}s` }}>
                  {item.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New arrivals ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl space-y-8 px-4 pb-20">
        <div className="animate-slide-in-left flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
              Just dropped
            </p>
            <h2 className="text-3xl font-bold">New Arrivals</h2>
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
