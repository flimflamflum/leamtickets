import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface TicketSoldEmailProps {
  sellerEmail: string;
  sellerName?: string | null;
  eventName: string;
  venue: string;
  ticketType: string;
  resalePrice: number;
  platformFee: number;
  sellerPayout: number;
  buyerEmail: string;
}

export async function sendTicketSoldEmail({
  sellerEmail,
  sellerName,
  eventName,
  venue,
  ticketType,
  resalePrice,
  platformFee,
  sellerPayout,
  buyerEmail,
}: TicketSoldEmailProps) {
  const name = sellerName ?? "Seller";

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: sellerEmail,
    subject: `Your ticket for ${eventName} has sold! 🎉`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff;">
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">Your ticket sold!</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">Hi ${name}, great news — someone purchased your ticket.</p>
        
        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #111827;">${eventName} @ ${venue}</p>
          <p style="margin: 0; color: #6b7280;">${ticketType}</p>
        </div>

        <div style="border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280;">Sale price</span>
            <span style="color: #111827;">£${resalePrice.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280;">Platform fee (30%)</span>
            <span style="color: #ef4444;">−£${platformFee.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #e5e7eb; font-weight: 700;">
            <span style="color: #111827;">Your payout</span>
            <span style="color: #16a34a;">£${sellerPayout.toFixed(2)}</span>
          </div>
        </div>

        <p style="color: #6b7280; font-size: 14px;">Your payout will be transferred to your Stripe account within 2–5 business days.</p>
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
  ticketType: string;
  amountPaid: number;
}

export async function sendPurchaseConfirmationEmail({
  buyerEmail,
  buyerName,
  eventName,
  venue,
  ticketType,
  amountPaid,
}: PurchaseConfirmationEmailProps) {
  const name = buyerName ?? "there";

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: buyerEmail,
    subject: `Purchase confirmed: ${eventName}`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff;">
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">Purchase confirmed!</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">Hi ${name}, your ticket purchase is confirmed. The seller will be in touch.</p>
        
        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #111827;">${eventName} @ ${venue}</p>
          <p style="margin: 0 0 8px 0; color: #6b7280;">${ticketType}</p>
          <p style="margin: 0; font-weight: 700; color: #111827;">£${amountPaid.toFixed(2)}</p>
        </div>

        <p style="color: #6b7280; font-size: 14px;">Keep this email as proof of purchase. If you have any issues, contact us at support@leamtickets.com.</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">LeamTickets is not affiliated with Smack, Neon, or the University of Warwick.</p>
      </div>
    `,
  });
}
