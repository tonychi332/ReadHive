import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — ReadHive",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <h1 className="text-3xl font-bold">About ReadHive</h1>
      <p className="leading-relaxed text-muted-foreground">
        ReadHive was founded by Anthony Leonard to help writers and authors publish
        their books digitally while allowing readers to easily buy and read books
        online. We created this platform to support knowledge sharing, creativity,
        and digital publishing for everyone, everywhere.
      </p>
      <h2 className="text-xl font-semibold">Our Goal</h2>
      <p className="leading-relaxed text-muted-foreground">
        Our goal is to build a trusted digital library and online bookstore that
        empowers authors to publish their work while helping readers access
        valuable books easily from anywhere.
      </p>
      <h2 className="text-xl font-semibold">For Authors</h2>
      <p className="leading-relaxed text-muted-foreground">
        Authors keep the majority of every sale &mdash; ReadHive operates on a 60/40
        revenue share, with 60% going directly to the author. Once approved, your
        books are listed in our shop and authors page, and you can track sales,
        earnings, and withdrawals from your author dashboard.
      </p>
      <h2 className="text-xl font-semibold">For Readers</h2>
      <p className="leading-relaxed text-muted-foreground">
        Create a free account to buy ebooks, build your personal library, download
        your purchases, and save your favourite titles for later.
      </p>
    </div>
  );
}
