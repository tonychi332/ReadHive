import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact — ReadHive",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="mt-2 text-muted-foreground">
          Have a question about ReadHive, your account, or a book you&apos;ve
          published? Reach out using the details below.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Get in touch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Email:</span>{" "}
            <a href="mailto:tonychinonso19@gmail.com" className="hover:underline">
              tonychinonso19@gmail.com
            </a>
          </p>
          <p>
            <span className="font-medium">Phone:</span>{" "}
            <a href="tel:+2348136485690" className="hover:underline">
              +234 813 648 5690
            </a>
          </p>
          <p>
            <span className="font-medium">Location:</span> Nigeria
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
