import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TriggerType } from "@prisma/client";
import { canCreateRule } from "@/lib/services/usage";

const createRuleSchema = z.object({
  name: z.string().min(1).max(100),
  trigger: z.string().min(1),
  triggerType: z.enum(["EXACT", "CONTAINS", "STARTS_WITH", "REGEX"]),
  response: z.string().min(1),
  priority: z.number().int().min(0).max(100).default(0),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const activeOnly = searchParams.get("activeOnly") === "true";

  const where = activeOnly ? { isActive: true } : {};

  const rules = await prisma.autoReplyRule.findMany({
    where,
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      trigger: true,
      triggerType: true,
      response: true,
      priority: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { messages: true },
      },
    },
  });

  return NextResponse.json(rules);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check rule limit
    const canCreate = await canCreateRule(session.user.id);
    if (!canCreate) {
      return NextResponse.json(
        {
          error: "Rule limit reached",
          code: "RULE_LIMIT_REACHED",
          message:
            "You have reached the maximum number of rules for your plan. Please upgrade to create more rules.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = createRuleSchema.parse(body);

    // Validate regex if type is REGEX
    if (data.triggerType === "REGEX") {
      try {
        new RegExp(data.trigger);
      } catch {
        return NextResponse.json(
          { error: "Invalid regex pattern" },
          { status: 400 }
        );
      }
    }

    const rule = await prisma.autoReplyRule.create({
      data: {
        ...data,
        triggerType: data.triggerType as TriggerType,
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Create rule error:", error);
    return NextResponse.json(
      { error: "Failed to create rule" },
      { status: 500 }
    );
  }
}
