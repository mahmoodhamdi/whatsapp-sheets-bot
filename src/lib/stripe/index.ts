import Stripe from "stripe";

// Stripe is optional - only initialize if key is provided
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Create stripe instance only if key is available
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    })
  : null;

/**
 * Get stripe instance (throws if not configured)
 */
export function getStripe(): Stripe {
  if (!stripe) {
    throw new Error(
      "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable."
    );
  }
  return stripe;
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return !!stripeSecretKey;
}

/**
 * Format amount for display (cents to dollars)
 */
export function formatAmount(
  amount: number,
  currency: string = "usd"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

/**
 * Format amount for Arabic display
 */
export function formatAmountAr(
  amount: number,
  currency: string = "sar"
): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

/**
 * Format amount based on locale
 */
export function formatAmountLocalized(
  amount: number,
  currency: string = "usd",
  locale: string = "en"
): string {
  if (locale === "ar") {
    return formatAmountAr(amount, currency === "usd" ? "sar" : currency);
  }
  return formatAmount(amount, currency);
}
