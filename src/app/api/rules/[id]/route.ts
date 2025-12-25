import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TriggerType } from "@prisma/client";

const updateRuleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  trigger: z.string().min(1).optional(),
  triggerType: z.enum(["EXACT", "CONTAINS", "STARTS_WITH", "REGEX"]).optional(),
  response: z.string().min(1).optional(),
  priority: z.number().int().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const rule = await prisma.autoReplyRule.findUnique({
    where: { id },
    include: {
      _count: {
        select: { messages: true },
      },
    },
  });

  if (!rule) {
    return NextResponse.json({ error: "Rule not found" }, { status: 404 });
  }

  return NextResponse.json(rule);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const data = updateRuleSchema.parse(body);

    // Validate regex if type is REGEX
    if (data.triggerType === "REGEX" && data.trigger) {
      try {
        new RegExp(data.trigger);
      } catch {
        return NextResponse.json(
          { error: "Invalid regex pattern" },
          { status: 400 }
        );
      }
    }

    const rule = await prisma.autoReplyRule.update({
      where: { id },
      data: {
        ...data,
        triggerType: data.triggerType as TriggerType | undefined,
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Update rule error:", error);
    return NextResponse.json(
      { error: "Failed to update rule" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.autoReplyRule.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Rule not found" }, { status: 404 });
  }
}
