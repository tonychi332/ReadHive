import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — ReadHive",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <h1 className="text-3xl font-bold">Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
        <p className="leading-relaxed text-muted-foreground">
          By creating an account or using ReadHive, you agree to be bound by these
          Terms & Conditions. If you do not agree, please do not use the platform.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2. Accounts</h2>
        <p className="leading-relaxed text-muted-foreground">
          You must provide accurate information when registering and are
          responsible for maintaining the confidentiality of your account
          credentials and for all activity under your account.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3. Buying Books</h2>
        <p className="leading-relaxed text-muted-foreground">
          When you purchase a book, you receive a personal, non-transferable
          licence to download and read that book. Purchased books are tied to
          your account and may not be redistributed, resold, or shared.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. Selling Books</h2>
        <p className="leading-relaxed text-muted-foreground">
          Authors who upload books to ReadHive must own the rights to the content
          they publish. Submitted books are reviewed by our team before being
          listed and may be removed if they violate these Terms or our Copyright
          Policy. Revenue from each sale is split 60% to the author and 40% to
          ReadHive, as described in the Author Agreement.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5. Prohibited Conduct</h2>
        <p className="leading-relaxed text-muted-foreground">
          You may not upload fraudulent, plagiarized, or illegal content, attempt
          to circumvent payment or download restrictions, or use the platform for
          any unlawful purpose.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">6. Changes to These Terms</h2>
        <p className="leading-relaxed text-muted-foreground">
          We may update these Terms from time to time. Continued use of ReadHive
          after changes are posted constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">7. Contact</h2>
        <p className="leading-relaxed text-muted-foreground">
          Questions about these Terms can be sent to{" "}
          <a href="mailto:tonychinonso19@gmail.com" className="hover:underline">
            tonychinonso19@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
