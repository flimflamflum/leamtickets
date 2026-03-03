import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

export const PLATFORM_FEE_PERCENT = 30;

/**
 * Creates a Stripe Connect onboarding link for a seller.
 */
export async function createConnectAccountLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string
): Promise<string> {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    return_url: returnUrl,
    refresh_url: refreshUrl,
    type: "account_onboarding",
  });
  return accountLink.url;
}

/**
 * Creates a new Stripe Express account for a seller.
 */
export async function createConnectAccount(email: string): Promise<string> {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_profile: {
      url: process.env.NEXT_PUBLIC_APP_URL,
    },
  });
  return account.id;
}

/**
 * Creates a Stripe Checkout Session for a ticket purchase.
 * Automatically splits payment: 70% to seller, 30% platform fee.
 */
export async function createCheckoutSession({
  ticketId,
  eventName,
  venue,
  ticketType,
  resalePriceInPence,
  imageUrl,
  sellerStripeAccountId,
  successUrl,
  cancelUrl,
  buyerEmail,
}: {
  ticketId: string;
  eventName: string;
  venue: string;
  ticketType: string;
  resalePriceInPence: number;
  imageUrl: string;
  sellerStripeAccountId: string;
  successUrl: string;
  cancelUrl: string;
  buyerEmail?: string;
}) {
  const platformFeeAmount = Math.round(resalePriceInPence * (PLATFORM_FEE_PERCENT / 100));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: buyerEmail,
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: `${eventName} – ${venue}`,
            description: ticketType,
            images: [imageUrl],
          },
          unit_amount: resalePriceInPence,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: platformFeeAmount,
      transfer_data: {
        destination: sellerStripeAccountId,
      },
    },
    metadata: {
      ticketId,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}
