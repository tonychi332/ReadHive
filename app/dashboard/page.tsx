import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (session?.user?.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (session?.user?.authorProfileId) {
    redirect("/dashboard/author");
  }

  redirect("/dashboard/reader");
}
