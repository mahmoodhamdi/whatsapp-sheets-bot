import { PrismaClient, Direction, MessageStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Creating test data...\n");

  // Verify seed data integrity
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });
  console.log(`Plans: ${plans.length} (expected 4)`);
  for (const p of plans) {
    console.log(`  - ${p.name} (${p.slug}): $${p.monthlyPrice / 100}/mo, ${p.messagesPerMonth} msg/mo, ${p.rulesLimit} rules`);
  }

  const rules = await prisma.autoReplyRule.findMany();
  console.log(`\nRules: ${rules.length} (expected 4)`);

  const settings = await prisma.settings.findUnique({ where: { id: "default" } });
  console.log(`Settings: ${settings ? "OK" : "MISSING"}`);

  const users = await prisma.user.findMany({ select: { email: true, role: true, emailVerified: true } });
  console.log(`\nUsers: ${users.length}`);
  for (const u of users) {
    console.log(`  - ${u.email} (${u.role}, verified: ${u.emailVerified})`);
  }

  // Create sample contacts
  const contactsData = [
    { phone: "+966501234567", name: "Ahmed Ali" },
    { phone: "+966509876543", name: "Sara Mohammed" },
    { phone: "+201012345678", name: "Mohamed Hassan" },
    { phone: "+201098765432", name: "Fatima Ibrahim" },
    { phone: "+966551112222", name: "Khalid Omar" },
    { phone: "+201155556666", name: "Nour Ahmed" },
    { phone: "+966507778888", name: "Layla Saeed" },
    { phone: "+201033334444", name: null },
  ];

  const contacts = [];
  for (const c of contactsData) {
    const contact = await prisma.contact.upsert({
      where: { phone: c.phone },
      update: { name: c.name },
      create: { phone: c.phone, name: c.name },
    });
    contacts.push(contact);
  }
  console.log(`\nContacts created: ${contacts.length}`);

  // Create sample messages
  const messagesData = [
    { contactIdx: 0, direction: Direction.INCOMING, content: "مرحبا", status: MessageStatus.RECEIVED },
    { contactIdx: 0, direction: Direction.OUTGOING, content: "أهلاً وسهلاً بك! كيف يمكنني مساعدتك؟", status: MessageStatus.SENT, ruleIdx: 0 },
    { contactIdx: 1, direction: Direction.INCOMING, content: "كم سعر المنتج؟", status: MessageStatus.RECEIVED },
    { contactIdx: 1, direction: Direction.OUTGOING, content: "شكراً لاستفسارك عن الأسعار.", status: MessageStatus.SENT, ruleIdx: 1 },
    { contactIdx: 2, direction: Direction.INCOMING, content: "السلام عليكم", status: MessageStatus.RECEIVED },
    { contactIdx: 2, direction: Direction.OUTGOING, content: "أهلاً وسهلاً بك!", status: MessageStatus.SENT, ruleIdx: 0 },
    { contactIdx: 3, direction: Direction.INCOMING, content: "فين الموقع؟", status: MessageStatus.RECEIVED },
    { contactIdx: 3, direction: Direction.OUTGOING, content: "يمكنك زيارتنا في موقعنا.", status: MessageStatus.SENT, ruleIdx: 3 },
    { contactIdx: 4, direction: Direction.INCOMING, content: "ايه مواعيد العمل؟", status: MessageStatus.RECEIVED },
    { contactIdx: 4, direction: Direction.OUTGOING, content: "ساعات العمل من 9 صباحاً حتى 5 مساءً.", status: MessageStatus.SENT, ruleIdx: 2 },
    { contactIdx: 5, direction: Direction.INCOMING, content: "Hello", status: MessageStatus.RECEIVED },
    { contactIdx: 5, direction: Direction.OUTGOING, content: "شكراً لتواصلك معنا!", status: MessageStatus.SENT },
    { contactIdx: 6, direction: Direction.INCOMING, content: "عندكم خصم؟", status: MessageStatus.RECEIVED },
    { contactIdx: 0, direction: Direction.INCOMING, content: "شكرا", status: MessageStatus.RECEIVED },
    { contactIdx: 1, direction: Direction.INCOMING, content: "طيب وين العنوان؟", status: MessageStatus.RECEIVED },
    { contactIdx: 7, direction: Direction.INCOMING, content: "مرحبا هل يوجد احد؟", status: MessageStatus.RECEIVED },
  ];

  let msgCount = 0;
  for (const m of messagesData) {
    await prisma.message.create({
      data: {
        contactId: contacts[m.contactIdx].id,
        direction: m.direction,
        content: m.content,
        status: m.status,
        ruleId: m.ruleIdx !== undefined ? rules[m.ruleIdx]?.id : undefined,
      },
    });
    msgCount++;
  }
  console.log(`Messages created: ${msgCount}`);

  // Update contact message counts
  for (const contact of contacts) {
    const count = await prisma.message.count({ where: { contactId: contact.id } });
    await prisma.contact.update({
      where: { id: contact.id },
      data: { messageCount: count, lastContact: new Date() },
    });
  }

  // Verify data integrity
  const totalContacts = await prisma.contact.count();
  const totalMessages = await prisma.message.count();
  const incomingMessages = await prisma.message.count({ where: { direction: "INCOMING" } });
  const outgoingMessages = await prisma.message.count({ where: { direction: "OUTGOING" } });

  console.log(`\n--- Data Summary ---`);
  console.log(`Total contacts: ${totalContacts}`);
  console.log(`Total messages: ${totalMessages}`);
  console.log(`  Incoming: ${incomingMessages}`);
  console.log(`  Outgoing: ${outgoingMessages}`);
  console.log(`Plans: ${plans.length}`);
  console.log(`Rules: ${rules.length}`);
  console.log(`\n✅ Test data creation complete!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
