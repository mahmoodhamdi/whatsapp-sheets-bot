/**
 * Script to sync Stripe price IDs with database
 *
 * Run with: npx tsx scripts/sync-stripe-prices.ts
 *
 * Before running:
 * 1. Create products in Stripe Dashboard
 * 2. Add price IDs to .env file
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface PriceMapping {
  monthly?: string;
  yearly?: string;
}

const priceMapping: Record<string, PriceMapping> = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    yearly: process.env.STRIPE_PRICE_STARTER_YEARLY,
  },
  professional: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  enterprise: {
    monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY,
  },
};

async function syncStripePrices() {
  console.log("Syncing Stripe prices to database...\n");

  let updated = 0;
  let skipped = 0;

  for (const [slug, prices] of Object.entries(priceMapping)) {
    // Skip if no prices configured
    if (!prices.monthly && !prices.yearly) {
      console.log(`⏭️  Skipping ${slug}: No price IDs configured`);
      skipped++;
      continue;
    }

    try {
      await prisma.plan.update({
        where: { slug },
        data: {
          stripePriceIdMonthly: prices.monthly || null,
          stripePriceIdYearly: prices.yearly || null,
        },
      });

      console.log(`✅ Updated ${slug} plan:`);
      if (prices.monthly) console.log(`   Monthly: ${prices.monthly}`);
      if (prices.yearly) console.log(`   Yearly: ${prices.yearly}`);
      updated++;
    } catch (error) {
      console.error(`❌ Failed to update ${slug}:`, error);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updated} plans`);
  console.log(`   Skipped: ${skipped} plans`);
  console.log("\nSync complete!");
}

async function listPlans() {
  console.log("\nCurrent plans in database:\n");

  const plans = await prisma.plan.findMany({
    orderBy: { sortOrder: "asc" },
  });

  for (const plan of plans) {
    console.log(`${plan.name} (${plan.slug}):`);
    console.log(`  Monthly Price ID: ${plan.stripePriceIdMonthly || "Not set"}`);
    console.log(`  Yearly Price ID: ${plan.stripePriceIdYearly || "Not set"}`);
    console.log("");
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--list")) {
    await listPlans();
  } else {
    await syncStripePrices();
    await listPlans();
  }
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
