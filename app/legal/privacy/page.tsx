import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ReadHive",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p className="leading-relaxed text-muted-foreground">
          We collect information you provide directly, such as your name, email
          address, and password when you register, as well as information about
          the books you upload, purchase, or favourite. If you become an author
          and request a withdrawal, we may collect payment details needed to pay
          you.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
        <p className="leading-relaxed text-muted-foreground">
          We use your information to operate ReadHive, including managing your
          account, processing purchases, calculating author earnings, paying out
          withdrawals, and communicating with you about your account or orders.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3. Sharing of Information</h2>
        <p className="leading-relaxed text-muted-foreground">
          We do not sell your personal information. We may share information with
          service providers who help us run the platform (such as hosting,
          storage, and payment processing) and as required by law.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4. Data Security</h2>
        <p className="leading-relaxed text-muted-foreground">
          We take reasonable steps to protect your information, including storing
          passwords in hashed form. However, no method of transmission or storage
          is completely secure.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5. Your Choices</h2>
        <p className="leading-relaxed text-muted-foreground">
          You can update your account information at any time. To request
          deletion of your account or data, contact us using the details below.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">6. Contact</h2>
        <p className="leading-relaxed text-muted-foreground">
          For privacy-related questions, contact{" "}
          <a href="mailto:tonychinonso19@gmail.com" className="hover:underline">
            tonychinonso19@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
