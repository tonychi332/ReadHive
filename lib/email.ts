import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.EMAIL_FROM ?? "ReadHive <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "tonychinonso19@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://read-hive-nu.vercel.app";

function wrap(body: string) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a; background: #fffdf9;">
      <div style="border-bottom: 2px solid #d97706; padding-bottom: 16px; margin-bottom: 28px;">
        <span style="font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
          Read<span style="color: #d97706;">Hive</span>
        </span>
      </div>
      ${body}
      <div style="border-top: 1px solid #e5e0d8; margin-top: 40px; padding-top: 16px; font-size: 12px; color: #8a8070;">
        ReadHive — Digital Library &amp; Bookstore
      </div>
    </body>
    </html>
  `;
}

export async function sendBookSubmittedEmail(opts: {
  bookTitle: string;
  authorName: string;
  bookId: string;
}) {
  if (!resend) return;
  await resend.emails
    .send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `📚 New book submitted: "${opts.bookTitle}"`,
      html: wrap(`
        <h2 style="margin: 0 0 12px; font-size: 22px;">New Book Submission</h2>
        <p><strong>${opts.authorName}</strong> has submitted a book for your review.</p>
        <table style="border-collapse: collapse; margin: 20px 0; width: 100%;">
          <tr>
            <td style="padding: 8px 12px; background: #fef3c7; border-radius: 4px; font-size: 14px; color: #78350f;">
              <strong>Title:</strong> ${opts.bookTitle}
            </td>
          </tr>
        </table>
        <a href="${SITE_URL}/dashboard/admin"
           style="display: inline-block; padding: 12px 24px; background: #d97706; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
          Review in Admin Dashboard →
        </a>
      `),
    })
    .catch(console.error);
}

export async function sendBookStatusEmail(opts: {
  bookTitle: string;
  authorEmail: string;
  authorName: string;
  status: "APPROVED" | "REJECTED";
}) {
  if (!resend) return;
  const approved = opts.status === "APPROVED";

  await resend.emails
    .send({
      from: FROM,
      to: opts.authorEmail,
      subject: approved
        ? `✅ Your book "${opts.bookTitle}" is live on ReadHive!`
        : `Update on your book "${opts.bookTitle}"`,
      html: wrap(
        approved
          ? `
            <h2 style="margin: 0 0 12px; font-size: 22px; color: #15803d;">Your book is live! 🎉</h2>
            <p>Hi ${opts.authorName},</p>
            <p>Great news — <strong>${opts.bookTitle}</strong> has been approved and is now available for readers on ReadHive.</p>
            <p style="font-size: 14px; color: #6b5e4e;">Readers can discover and purchase your book right now. Every sale earns you 60% of the purchase price, credited to your author wallet.</p>
            <a href="${SITE_URL}/dashboard/author"
               style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #d97706; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
              View Author Dashboard →
            </a>
          `
          : `
            <h2 style="margin: 0 0 12px; font-size: 22px;">Book Update</h2>
            <p>Hi ${opts.authorName},</p>
            <p>Unfortunately, <strong>${opts.bookTitle}</strong> wasn't approved this time.</p>
            <p style="font-size: 14px; color: #6b5e4e;">Common reasons include incomplete descriptions, missing cover image, or content that doesn't meet our guidelines. You're welcome to edit and resubmit.</p>
            <a href="${SITE_URL}/dashboard/author"
               style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #d97706; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
              Edit &amp; Resubmit →
            </a>
          `
      ),
    })
    .catch(console.error);
}

export async function sendPurchaseReceiptEmail(opts: {
  buyerEmail: string;
  buyerName: string;
  bookTitle: string;
  bookId: string;
  amount: number;
  fileUrl: string | null;
}) {
  if (!resend) return;
  await resend.emails
    .send({
      from: FROM,
      to: opts.buyerEmail,
      subject: `🧾 Your ReadHive receipt: "${opts.bookTitle}"`,
      html: wrap(`
        <h2 style="margin: 0 0 12px; font-size: 22px;">Purchase Confirmed</h2>
        <p>Hi ${opts.buyerName}, thanks for your purchase!</p>
        <table style="border-collapse: collapse; margin: 20px 0; width: 100%; font-size: 14px;">
          <tr style="background: #fef3c7;">
            <td style="padding: 8px 12px;"><strong>Book</strong></td>
            <td style="padding: 8px 12px;">${opts.bookTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px;"><strong>Amount paid</strong></td>
            <td style="padding: 8px 12px;">₦${opts.amount.toFixed(2)}</td>
          </tr>
        </table>
        ${
          opts.fileUrl
            ? `<a href="${opts.fileUrl}" style="display: inline-block; margin-bottom: 12px; padding: 12px 24px; background: #d97706; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                Download your book →
              </a>`
            : ""
        }
        <br/>
        <a href="${SITE_URL}/books/${opts.bookId}"
           style="font-size: 13px; color: #d97706;">
          View book page →
        </a>
      `),
    })
    .catch(console.error);
}
