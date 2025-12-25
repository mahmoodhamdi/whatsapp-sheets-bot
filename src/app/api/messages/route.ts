import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Direction } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const direction = searchParams.get("direction") as Direction | null;
  const contactId = searchParams.get("contactId");
  const search = searchParams.get("search") || "";

  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (direction) {
    where.direction = direction;
  }

  if (contactId) {
    where.contactId = contactId;
  }

  if (search) {
    where.content = { contains: search };
  }

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        contact: {
          select: { id: true, phone: true, name: true },
        },
        rule: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.message.count({ where }),
  ]);

  return NextResponse.json({
    messages,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
