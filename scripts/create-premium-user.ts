import { PrismaClient, Role, SubscriptionStatus, BillingInterval } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Get the Enterprise plan
  const enterprisePlan = await prisma.plan.findUnique({
    where: { slug: "enterprise" },
  });

  if (!enterprisePlan) {
    console.error("Enterprise plan not found! Run db:seed first.");
    return;
  }

  // Create premium user
  const password = await bcrypt.hash("premium123", 10);

  const user = await prisma.user.upsert({
    where: { email: "premium@example.com" },
    update: {
      emailVerified: true,
    },
    create: {
      email: "premium@example.com",
      password: password,
      name: "Premium User",
      role: Role.USER,
      emailVerified: true,
    },
  });

  console.log("Created user:", user.email);

  // Create subscription
  const now = new Date();
  const periodEnd = new Date();
  periodEnd.setFullYear(periodEnd.getFullYear() + 1); // 1 year subscription

  const subscription = await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      planId: enterprisePlan.id,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
    create: {
      userId: user.id,
      planId: enterprisePlan.id,
      status: SubscriptionStatus.ACTIVE,
      billingInterval: BillingInterval.YEARLY,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
  });

  console.log("Created subscription:", {
    plan: enterprisePlan.name,
    status: subscription.status,
    features: enterprisePlan.features,
    messagesPerMonth: enterprisePlan.messagesPerMonth,
    rulesLimit: enterprisePlan.rulesLimit,
  });

  console.log("\n✅ Premium account ready!");
  console.log("Email: premium@example.com");
  console.log("Password: premium123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
