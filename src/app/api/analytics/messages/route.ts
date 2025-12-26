import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasFeature } from "@/lib/features";

type Period = "day" | "week" | "month" | "year";

function getPeriodDays(period: Period): number {
  switch (period) {
    case "day":
      return 1;
    case "week":
      return 7;
    case "month":
      return 30;
    case "year":
      return 365;
    default:
      return 7;
  }
}

export async function GET(request: NextRequest) {
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
        message: "Message analytics requires Professional plan or higher",
      },
      { status: 403 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const period = (searchParams.get("period") || "week") as Period;
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    let startDate: Date;
    let endDate: Date;

    if (fromParam && toParam) {
      startDate = new Date(fromParam);
      endDate = new Date(toParam);
    } else {
      const days = getPeriodDays(period);
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const messages = await prisma.message.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        direction: true,
        createdAt: true,
      },
    });

    // Group by date
    const grouped: Record<string, { incoming: number; outgoing: number }> = {};

    // Initialize all dates in range
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      grouped[dateStr] = { incoming: 0, outgoing: 0 };
    }

    // Count messages per day
    for (const msg of messages) {
      const dateStr = msg.createdAt.toISOString().split("T")[0];
      if (grouped[dateStr]) {
        if (msg.direction === "INCOMING") {
          grouped[dateStr].incoming++;
        } else {
          grouped[dateStr].outgoing++;
        }
      }
    }

    // Convert to array with totals
    const data = Object.entries(grouped)
      .map(([date, counts]) => ({
        date,
        incoming: counts.incoming,
        outgoing: counts.outgoing,
        total: counts.incoming + counts.outgoing,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate summary
    const totalIncoming = data.reduce((sum, d) => sum + d.incoming, 0);
    const totalOutgoing = data.reduce((sum, d) => sum + d.outgoing, 0);
    const daysWithData = data.filter((d) => d.total > 0).length;
    const avgPerDay =
      daysWithData > 0
        ? Math.round((totalIncoming + totalOutgoing) / daysWithData)
        : 0;

    // Find peak day
    let peakDay = "";
    let peakCount = 0;
    for (const d of data) {
      if (d.total > peakCount) {
        peakCount = d.total;
        peakDay = d.date;
      }
    }

    return NextResponse.json({
      data,
      summary: {
        totalIncoming,
        totalOutgoing,
        avgPerDay,
        peakDay,
        peakCount,
      },
    });
  } catch (error) {
    console.error("Analytics messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch message analytics" },
      { status: 500 }
    );
  }
}
