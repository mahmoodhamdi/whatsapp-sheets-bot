import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  contactsQuerySchema,
  parseQueryParams,
} from "@/lib/validations/api";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const queryResult = parseQueryParams(
    request.nextUrl.searchParams,
    contactsQuerySchema
  );

  if (!queryResult.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: queryResult.error.issues },
      { status: 400 }
    );
  }

  const { page, limit, search } = queryResult.data;
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { phone: { contains: search } },
          { name: { contains: search } },
        ],
      }
    : {};

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip,
      take: limit,
      orderBy: { lastContact: "desc" },
      select: {
        id: true,
        phone: true,
        name: true,
        messageCount: true,
        lastContact: true,
        createdAt: true,
      },
    }),
    prisma.contact.count({ where }),
  ]);

  return NextResponse.json({
    contacts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
