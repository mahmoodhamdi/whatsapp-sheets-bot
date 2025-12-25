import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let settings = await prisma.settings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: { id: "default" },
    });
  }

  return NextResponse.json(settings);
}

const updateSettingsSchema = z.object({
  businessName: z.string().min(1).max(100).optional(),
  defaultReply: z.string().max(1000).optional(),
  googleSheetsId: z.string().nullable().optional(),
  workingHours: z
    .object({
      start: z.string(),
      end: z.string(),
      days: z.array(z.string()),
    })
    .nullable()
    .optional(),
});

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = updateSettingsSchema.parse(body);

    // Build update object properly for Prisma
    const updateData: Prisma.SettingsUpdateInput = {};
    if (data.businessName !== undefined) updateData.businessName = data.businessName;
    if (data.defaultReply !== undefined) updateData.defaultReply = data.defaultReply;
    if (data.googleSheetsId !== undefined) updateData.googleSheetsId = data.googleSheetsId;
    if (data.workingHours !== undefined) {
      updateData.workingHours = data.workingHours === null
        ? Prisma.JsonNull
        : data.workingHours;
    }

    // Build create object
    const createData: Prisma.SettingsCreateInput = { id: "default" };
    if (data.businessName !== undefined) createData.businessName = data.businessName;
    if (data.defaultReply !== undefined) createData.defaultReply = data.defaultReply;
    if (data.googleSheetsId !== undefined) createData.googleSheetsId = data.googleSheetsId;
    if (data.workingHours !== undefined) {
      createData.workingHours = data.workingHours === null
        ? Prisma.JsonNull
        : data.workingHours;
    }

    const settings = await prisma.settings.upsert({
      where: { id: "default" },
      update: updateData,
      create: createData,
    });

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
