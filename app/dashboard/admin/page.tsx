import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminBookActions } from "@/components/admin-book-actions";
import { AdminWithdrawalActions } from "@/components/admin-withdrawal-actions";
import { CommissionRateForm } from "@/components/commission-rate-form";
import { Badge } from "@/components/ui/badge";
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
  title: "Admin Dashboard — ReadHive",
};

export default async function AdminDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard/reader");
  }

  const [pendingBooks, pendingWithdrawals, users, settings, revenueAgg, liveBookCount] =
    await Promise.all([
      prisma.book.findMany({
        where: { status: "PENDING" },
        include: { author: { include: { user: { select: { name: true } } } } },
        orderBy: { createdAt: "asc" },
      }),
      prisma.withdrawalRequest.findMany({
        where: { status: "PENDING" },
        include: { author: { include: { user: { select: { name: true, email: true } } } } },
        orderBy: { createdAt: "asc" },
      }),
      prisma.user.findMany({
        include: { authorProfile: { select: { id: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.platformSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
      prisma.purchase.aggregate({ _sum: { amount: true, platformEarnings: true } }),
      prisma.book.count({ where: { status: "APPROVED" } }),
    ]);

  const commissionPercent = settings.commissionRate.toNumber() * 100;

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage books, withdrawals, users, and platform settings</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₦{(revenueAgg._sum.amount?.toNumber() ?? 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Platform revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₦{(revenueAgg._sum.platformEarnings?.toNumber() ?? 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Live books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{liveBookCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending book approvals */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Pending Approvals
          {pendingBooks.length > 0 && (
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {pendingBooks.length}
            </span>
          )}
        </h2>
        {pendingBooks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author.user.name}</TableCell>
                  <TableCell>₦{book.price.toNumber().toFixed(2)}</TableCell>
                  <TableCell>
                    <AdminBookActions bookId={book.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">No books awaiting approval.</p>
        )}
      </section>

      {/* Pending withdrawal requests */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Withdrawal Requests
          {pendingWithdrawals.length > 0 && (
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {pendingWithdrawals.length}
            </span>
          )}
        </h2>
        {pendingWithdrawals.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingWithdrawals.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>
                    <div className="font-medium">{w.author.user.name}</div>
                    <div className="text-xs text-muted-foreground">{w.author.user.email}</div>
                  </TableCell>
                  <TableCell className="font-semibold">₦{w.amount.toNumber().toFixed(2)}</TableCell>
                  <TableCell>{w.bankName ?? "—"}</TableCell>
                  <TableCell className="font-mono text-sm">{w.accountNumber ?? "—"}</TableCell>
                  <TableCell>{w.accountName ?? "—"}</TableCell>
                  <TableCell>{w.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <AdminWithdrawalActions withdrawalId={w.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">No pending withdrawal requests.</p>
        )}
      </section>

      {/* Commission rate */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Commission Rate</h2>
        <CommissionRateForm initialRate={settings.commissionRate.toNumber()} />
        <p className="text-sm text-muted-foreground">
          The platform currently keeps {commissionPercent.toFixed(0)}% of each sale; authors keep{" "}
          {(100 - commissionPercent).toFixed(0)}%.
        </p>
      </section>

      {/* Users */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.authorProfile ? "Yes" : "No"}</TableCell>
                <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
