import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const plans = [
  {
    name: "Free",
    slug: "free",
    description: "For trying out and small projects",
    monthlyPrice: 0,
    yearlyPrice: 0,
    messagesPerMonth: 50,
    rulesLimit: 1,
    features: ["basic_support"],
    sortOrder: 0,
  },
  {
    name: "Starter",
    slug: "starter",
    description: "For small businesses",
    monthlyPrice: 900, // $9 in cents
    yearlyPrice: 8640, // $86.40 (20% off)
    messagesPerMonth: 500,
    rulesLimit: 10,
    features: ["basic_support", "sheets_sync"],
    sortOrder: 1,
  },
  {
    name: "Professional",
    slug: "professional",
    description: "For medium businesses",
    monthlyPrice: 2900, // $29
    yearlyPrice: 27840, // $278.40
    messagesPerMonth: 5000,
    rulesLimit: -1, // Unlimited
    features: ["priority_support", "sheets_sync", "analytics", "api_access"],
    sortOrder: 2,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    description: "For large companies",
    monthlyPrice: 9900, // $99
    yearlyPrice: 95040, // $950.40
    messagesPerMonth: -1, // Unlimited
    rulesLimit: -1, // Unlimited
    features: [
      "dedicated_support",
      "sheets_sync",
      "analytics",
      "api_access",
      "custom_integrations",
      "sla",
    ],
    sortOrder: 3,
  },
];

export async function seedPlans() {
  console.log("Seeding plans...");

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        messagesPerMonth: plan.messagesPerMonth,
        rulesLimit: plan.rulesLimit,
        features: plan.features,
        sortOrder: plan.sortOrder,
      },
      create: plan,
    });
    console.log(`  Created/Updated plan: ${plan.name}`);
  }

  console.log("Plans seeded successfully!");
}

// Allow running standalone
if (require.main === module) {
  seedPlans()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
