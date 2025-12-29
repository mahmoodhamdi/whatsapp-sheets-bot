import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Update admin to have verified email
  const user = await prisma.user.update({
    where: { email: "admin@example.com" },
    data: { emailVerified: true },
  });

  console.log("Updated user:", {
    email: user.email,
    emailVerified: user.emailVerified,
    name: user.name,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
