import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const [
      totalMessages,
      totalContacts,
      totalRules,
      activeRules,
      todayMessages,
      weekMessages,
      monthMessages,
      incomingCount,
      outgoingCount,
      autoRepliedCount,
      syncedToSheetsCount,
    ] = await Promise.all([
      prisma.message.count(),
      prisma.contact.count(),
      prisma.autoReplyRule.count(),
      prisma.autoReplyRule.count({ where: { isActive: true } }),
      prisma.message.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.message.count({
        where: { createdAt: { gte: weekAgo } },
      }),
      prisma.message.count({
        where: { createdAt: { gte: monthAgo } },
      }),
      prisma.message.count({
        where: { direction: "INCOMING" },
      }),
      prisma.message.count({
        where: { direction: "OUTGOING" },
      }),
      prisma.message.count({
        where: { ruleId: { not: null } },
      }),
      prisma.message.count({
        where: { syncedToSheets: true },
      }),
    ]);

    const responseRate =
      incomingCount > 0
        ? Math.round((outgoingCount / incomingCount) * 100)
        : 0;

    return NextResponse.json({
      totalMessages,
      totalContacts,
      totalRules,
      activeRules,
      todayMessages,
      weekMessages,
      monthMessages,
      incomingCount,
      outgoingCount,
      autoRepliedCount,
      syncedToSheetsCount,
      responseRate,
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
