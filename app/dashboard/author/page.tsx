import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WithdrawalRequestForm } from "@/components/withdrawal-request-form";

export const metadata: Metadata = {
  title: "Author Dashboard — ReadHive",
};

const bookStatusVariant = {
  APPROVED: "default",
  PENDING: "secondary",
  REJECTED: "destructive",
} as const;

const withdrawalStatusVariant = {
  PAID: "default",
  PENDING: "secondary",
  REJECTED: "destructive",
} as const;

export default async function AuthorDashboardPage() {
  const session = await auth();
  if (!session?.user?.authorProfileId) {
    redirect("/dashboard/reader");
  }

  const authorProfile = await prisma.authorProfile.findUnique({
    where: { id: session.user.authorProfileId },
    include: {
      books: {
        include: { _count: { select: { purchases: true } } },
        orderBy: { createdAt: "desc" },
      },
      withdrawalRequests: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!authorProfile) {
    redirect("/dashboard/reader");
  }

  const booksPublished = authorProfile.books.filter((b) => b.status === "APPROVED").length;
  const totalSales = authorProfile.books.reduce((sum, b) => sum + b._count.purchases, 0);
  const walletBalance = authorProfile.walletBalance.toNumber();
  const hasPending = authorProfile.withdrawalRequests.some((r) => r.status === "PENDING");

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Author Dashboard</h1>
          <p className="text-muted-foreground">Manage your books and earnings</p>
        </div>
        <Button render={<Link href="/dashboard/author/upload">Upload a book</Link>} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Wallet balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₦{walletBalance.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Books published</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{booksPublished}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalSales}</p>
          </CardContent>
        </Card>
      </div>

      {/* Books */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">My Books</h2>
        {authorProfile.books.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authorProfile.books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>₦{book.price.toNumber().toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={bookStatusVariant[book.status]}>{book.status}</Badge>
                  </TableCell>
                  <TableCell>{book._count.purchases}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      render={<Link href={`/dashboard/author/books/${book.id}/edit`}>Edit</Link>}
                      variant="outline"
                      size="sm"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">
            You haven&apos;t uploaded any books yet.{" "}
            <Link href="/dashboard/author/upload" className="underline">
              Upload your first book
            </Link>
            .
          </p>
        )}
      </section>

      {/* Withdrawals */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Withdrawals</h2>

        <WithdrawalRequestForm walletBalance={walletBalance} hasPending={hasPending} />

        {authorProfile.withdrawalRequests.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authorProfile.withdrawalRequests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">₦{r.amount.toNumber().toFixed(2)}</TableCell>
                  <TableCell>{r.bankName ?? "—"}</TableCell>
                  <TableCell>{r.accountNumber ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={withdrawalStatusVariant[r.status]}>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.adminNote ?? "—"}</TableCell>
                  <TableCell>{r.createdAt.toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
