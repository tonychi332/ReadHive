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

  const booksPublished = authorProfile.books.filter((book) => book.status === "APPROVED").length;
  const totalSales = authorProfile.books.reduce((sum, book) => sum + book._count.purchases, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Author Dashboard</h1>
          <p className="text-muted-foreground">Manage your books and earnings</p>
        </div>
        <Button render={<Link href="/dashboard/author/upload">Upload a book</Link>} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Wallet balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${authorProfile.walletBalance.toNumber().toFixed(2)}
            </p>
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
                  <TableCell>${book.price.toNumber().toFixed(2)}</TableCell>
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

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Withdrawal Requests</h2>
        {authorProfile.withdrawalRequests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authorProfile.withdrawalRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>${request.amount.toNumber().toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={withdrawalStatusVariant[request.status]}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.createdAt.toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">No withdrawal requests yet.</p>
        )}
      </section>
    </div>
  );
}
