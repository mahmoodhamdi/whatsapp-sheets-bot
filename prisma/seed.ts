import { PrismaClient, Role, TriggerType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    10
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@example.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      password: adminPassword,
      name: process.env.ADMIN_NAME || "Admin User",
      role: Role.ADMIN,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create default settings
  const settings = await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      whatsappConnected: false,
      defaultReply:
        process.env.DEFAULT_REPLY ||
        "شكراً لتواصلك معنا! سنرد عليك قريباً.",
      businessName: process.env.DEFAULT_BUSINESS_NAME || "My Business",
      workingHours: {
        start: "09:00",
        end: "17:00",
        days: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
      },
    },
  });
  console.log(`Created default settings: ${settings.businessName}`);

  // Create sample auto-reply rules
  const rules = [
    {
      name: "Greeting Response",
      trigger: "مرحبا|السلام|هلا|اهلا",
      triggerType: TriggerType.REGEX,
      response: "أهلاً وسهلاً بك! كيف يمكنني مساعدتك؟",
      priority: 10,
      isActive: true,
    },
    {
      name: "Price Inquiry",
      trigger: "سعر|كم|اسعار|تكلفة",
      triggerType: TriggerType.REGEX,
      response:
        "شكراً لاستفسارك عن الأسعار. يمكنك الاطلاع على قائمة أسعارنا أو التواصل مع فريق المبيعات.",
      priority: 9,
      isActive: true,
    },
    {
      name: "Working Hours",
      trigger: "مواعيد|ساعات|متى|وقت",
      triggerType: TriggerType.REGEX,
      response:
        "ساعات العمل لدينا من الأحد إلى الخميس، من 9 صباحاً حتى 5 مساءً.",
      priority: 8,
      isActive: true,
    },
    {
      name: "Location Inquiry",
      trigger: "عنوان|موقع|فين|وين|مكان",
      triggerType: TriggerType.REGEX,
      response: "يمكنك زيارتنا في موقعنا. للحصول على الاتجاهات، يرجى الضغط هنا.",
      priority: 7,
      isActive: true,
    },
  ];

  for (const rule of rules) {
    const created = await prisma.autoReplyRule.upsert({
      where: { id: rule.name.toLowerCase().replace(/\s/g, "-") },
      update: rule,
      create: {
        id: rule.name.toLowerCase().replace(/\s/g, "-"),
        ...rule,
      },
    });
    console.log(`Created rule: ${created.name}`);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
