import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { messagesQuerySchema, parseQueryParams } from "@/lib/validations/api";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const queryResult = parseQueryParams(
    request.nextUrl.searchParams,
    messagesQuerySchema
  );

  if (!queryResult.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: queryResult.error.issues },
      { status: 400 }
    );
  }

  const { page, limit, direction, contactId, search } = queryResult.data;
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
