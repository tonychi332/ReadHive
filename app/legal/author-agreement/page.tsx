import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Author Agreement — ReadHive",
};

export default function AuthorAgreementPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <h1 className="text-3xl font-bold">Author Agreement</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Becoming an Author</h2>
        <p className="leading-relaxed text-muted-foreground">
          Any registered user may apply to become an author. Once your author
          profile is set up, you can upload books for review and, if approved,
          they will be listed for sale on ReadHive.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2. Revenue Share</h2>
        <p className="leading-relaxed text-muted-foreground">
          For every copy of your book sold, you receive 60% of the sale price and
          ReadHive retains 40% as a platform commission. The commission rate may
          be adjusted by ReadHive from time to time; any changes will apply to
          future sales.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3. Wallet & Withdrawals</h2>
        <p className="leading-relaxed text-muted-foreground">
          Your earnings accumulate in your author wallet as sales occur. You may
          request a withdrawal of your available wallet balance from your author
          dashboard. Withdrawal requests are reviewed and processed by ReadHive.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. Book Approval</h2>
        <p className="leading-relaxed text-muted-foreground">
          Books are reviewed before being listed. ReadHive may reject or remove
          books that violate our Terms & Conditions or Copyright Policy, or that
          are found to be fake, low-quality, or fraudulent.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5. Ownership</h2>
        <p className="leading-relaxed text-muted-foreground">
          You retain full ownership and copyright of the books you publish on
          ReadHive. By listing a book, you grant ReadHive a licence to host,
          display, and sell copies of it on the platform.
        </p>
      </section>
    </div>
  );
}
