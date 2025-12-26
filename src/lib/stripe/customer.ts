import { getStripe, isStripeConfigured } from "./index";
import { prisma } from "@/lib/prisma";

/**
 * Create or get existing Stripe customer for a user
 */
export async function createOrGetStripeCustomer(
  userId: string
): Promise<string | null> {
  // Check if Stripe is configured
  if (!isStripeConfigured()) {
    console.warn("Stripe is not configured, skipping customer creation");
    return null;
  }

  const stripe = getStripe();

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, stripeCustomerId: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Return existing customer ID if already set
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user.id,
    },
  });

  // Save customer ID to database
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/**
 * Get Stripe customer by ID
 */
export async function getStripeCustomer(customerId: string) {
  if (!isStripeConfigured()) {
    return null;
  }

  const stripe = getStripe();
  return stripe.customers.retrieve(customerId);
}

/**
 * Update Stripe customer details
 */
export async function updateStripeCustomer(
  customerId: string,
  data: { email?: string; name?: string }
) {
  if (!isStripeConfigured()) {
    return null;
  }

  const stripe = getStripe();
  return stripe.customers.update(customerId, data);
}

/**
 * Delete Stripe customer
 */
export async function deleteStripeCustomer(customerId: string) {
  if (!isStripeConfigured()) {
    return null;
  }

  const stripe = getStripe();
  return stripe.customers.del(customerId);
}

/**
 * Get or create customer ID for checkout
 */
export async function getCustomerIdForCheckout(
  userId: string
): Promise<string> {
  const customerId = await createOrGetStripeCustomer(userId);

  if (!customerId) {
    throw new Error("Failed to create Stripe customer");
  }

  return customerId;
}
