import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; mimeType: string } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const mimeType = match[1];
  const base64 = match[2];
  return {
    buffer: Buffer.from(base64, "base64"),
    mimeType,
  };
}

interface TicketSoldEmailProps {
  sellerEmail: string;
  sellerName?: string | null;
  eventName: string;
  venue: string;
  ticketType?: string | null;
  resalePrice: number;
}

export async function sendTicketSoldEmail({
  sellerEmail,
  sellerName,
  eventName,
  venue,
  ticketType,
  resalePrice,
}: TicketSoldEmailProps) {
  const name = sellerName ?? "Seller";

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: sellerEmail,
    subject: `Your ticket for ${eventName} has sold! 🎉`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff;">
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">Your ticket sold!</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">Hi ${name}, great news — someone claimed your ticket.</p>
        
        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #111827;">${eventName} @ ${venue}</p>
          ${ticketType ? `<p style="margin: 0; color: #6b7280;">${ticketType}</p>` : ""}
        </div>

        <div style="border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280;">Listed price</span>
            <span style="color: #111827; font-weight: 700;">£${resalePrice.toFixed(2)}</span>
          </div>
        </div>

        <p style="color: #6b7280; font-size: 14px;">The buyer has received the ticket via email. Thanks for using LeamTickets!</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">LeamTickets is not affiliated with Smack, Neon, or the University of Warwick.</p>
      </div>
    `,
  });
}

interface PurchaseConfirmationEmailProps {
  buyerEmail: string;
  buyerName?: string | null;
  eventName: string;
  venue: string;
  ticketType?: string | null;
  resalePrice: number;
  imageUrl: string;
}

async function getImageAttachment(
  imageUrl: string,
  eventName: string
): Promise<Array<{ filename: string; content: Buffer; contentType: string }>> {
  const parsed = dataUrlToBuffer(imageUrl);
  if (parsed) {
    const ext = parsed.mimeType.includes("png") ? "png" : parsed.mimeType.includes("webp") ? "webp" : "jpg";
    return [
      {
        filename: `ticket-${eventName.replace(/\s+/g, "-")}.${ext}`,
        content: parsed.buffer,
        contentType: parsed.mimeType,
      },
    ];
  }
  if (imageUrl.startsWith("http")) {
    try {
      const res = await fetch(imageUrl);
      const buffer = Buffer.from(await res.arrayBuffer());
      const contentType = res.headers.get("content-type") ?? "image/png";
      const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
      return [
        {
          filename: `ticket-${eventName.replace(/\s+/g, "-")}.${ext}`,
          content: buffer,
          contentType,
        },
      ];
    } catch {
      return [];
    }
  }
  return [];
}

export async function sendPurchaseConfirmationEmail({
  buyerEmail,
  buyerName,
  eventName,
  venue,
  ticketType,
  resalePrice,
  imageUrl,
}: PurchaseConfirmationEmailProps) {
  const name = buyerName ?? "there";

  const attachments = await getImageAttachment(imageUrl, eventName);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: buyerEmail,
    subject: `Your ticket: ${eventName}`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff;">
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">Your ticket is attached!</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">Hi ${name}, your ticket is confirmed. Please find it attached to this email.</p>
        
        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #111827;">${eventName} @ ${venue}</p>
          ${ticketType ? `<p style="margin: 0 0 8px 0; color: #6b7280;">${ticketType}</p>` : ""}
          <p style="margin: 0; font-weight: 700; color: #111827;">£${resalePrice.toFixed(2)}</p>
        </div>

        <p style="color: #6b7280; font-size: 14px;">Save the ticket image and show it at the venue. If you have any issues, reply to this email.</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">LeamTickets is not affiliated with Smack, Neon, or the University of Warwick.</p>
      </div>
    `,
    ...(attachments.length > 0 && { attachments }),
  });
}
