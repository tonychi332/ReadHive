import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copyright Policy — ReadHive",
};

export default function CopyrightPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <h1 className="text-3xl font-bold">Copyright Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Author Responsibility</h2>
        <p className="leading-relaxed text-muted-foreground">
          By uploading a book to ReadHive, you confirm that you own the copyright
          to the work, or that you have the necessary rights and permissions to
          publish and sell it on this platform.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2. Review Process</h2>
        <p className="leading-relaxed text-muted-foreground">
          All books submitted to ReadHive are reviewed by our team before being
          made available in the shop. Books found to be plagiarized, fake, or
          infringing on someone else&apos;s copyright will be rejected or removed.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3. Reporting Infringement</h2>
        <p className="leading-relaxed text-muted-foreground">
          If you believe a book on ReadHive infringes your copyright, please
          contact us at{" "}
          <a href="mailto:tonychinonso19@gmail.com" className="hover:underline">
            tonychinonso19@gmail.com
          </a>{" "}
          with details of the work and the listing in question. We will review
          the report and may remove the listing while we investigate.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. Repeat Infringers</h2>
        <p className="leading-relaxed text-muted-foreground">
          Authors found to repeatedly upload infringing content may have their
          books removed and their account suspended.
        </p>
      </section>
    </div>
  );
}
