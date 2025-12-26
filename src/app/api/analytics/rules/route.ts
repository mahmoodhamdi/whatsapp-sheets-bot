import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasFeature } from "@/lib/features";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user has analytics feature
  const hasAnalyticsAccess = await hasFeature(session.user.id, "analytics");
  if (!hasAnalyticsAccess) {
    return NextResponse.json(
      {
        error: "Feature not available",
        code: "FEATURE_NOT_AVAILABLE",
        requiredPlan: "Professional",
        message: "Rules analytics requires Professional plan or higher",
      },
      { status: 403 }
    );
  }

  try {
    // Get all rules with message counts and last message
    const rules = await prisma.autoReplyRule.findMany({
      include: {
        messages: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { priority: "desc" },
    });

    // Calculate stats for each rule
    const rulesWithStats = rules.map((rule) => {
      const totalMatches = rule.messages.length;
      const sentCount = rule.messages.filter((m) => m.status === "SENT").length;
      const failedCount = rule.messages.filter(
        (m) => m.status === "FAILED"
      ).length;
      const successRate =
        sentCount + failedCount > 0
          ? Math.round((sentCount / (sentCount + failedCount)) * 100)
          : 100; // 100% if no failures

      const lastMessage = rule.messages[0];

      return {
        id: rule.id,
        name: rule.name,
        triggerType: rule.triggerType,
        isActive: rule.isActive,
        totalMatches,
        lastUsed: lastMessage?.createdAt.toISOString() || null,
        successRate,
      };
    });

    // Top 5 rules by matches
    const topRules = [...rulesWithStats]
      .sort((a, b) => b.totalMatches - a.totalMatches)
      .slice(0, 5)
      .filter((r) => r.totalMatches > 0)
      .map((r) => ({
        id: r.id,
        name: r.name,
        matches: r.totalMatches,
      }));

    // Rules with no matches
    const unusedRules = rules
      .filter((r) => r.messages.length === 0)
      .map((r) => ({
        id: r.id,
        name: r.name,
        createdAt: r.createdAt.toISOString(),
      }));

    return NextResponse.json({
      rules: rulesWithStats,
      topRules,
      unusedRules,
    });
  } catch (error) {
    console.error("Analytics rules error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rules analytics" },
      { status: 500 }
    );
  }
}
