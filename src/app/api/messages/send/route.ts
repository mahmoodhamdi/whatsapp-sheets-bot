import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isConnected, sendMessageRaw } from "@/lib/whatsapp/client";

const sendMessageSchema = z.object({
  phone: z.string().min(10),
  content: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { phone, content } = sendMessageSchema.parse(body);

    // Check WhatsApp connection
    if (!isConnected()) {
      return NextResponse.json(
        { error: "WhatsApp is not connected", code: "WHATSAPP_NOT_CONNECTED" },
        { status: 503 }
      );
    }

    // Find or create contact
    let contact = await prisma.contact.findUnique({ where: { phone } });

    if (!contact) {
      contact = await prisma.contact.create({
        data: { phone },
      });
    }

    // Create message record with PENDING status
    const message = await prisma.message.create({
      data: {
        contactId: contact.id,
        direction: "OUTGOING",
        content,
        status: "PENDING",
      },
      include: {
        contact: true,
      },
    });

    // Send via WhatsApp
    const sent = await sendMessageRaw(phone, content);

    // Update message status based on result
    const updatedMessage = await prisma.message.update({
      where: { id: message.id },
      data: { status: sent ? "SENT" : "FAILED" },
      include: {
        contact: true,
      },
    });

    // Update contact stats only if sent successfully
    if (sent) {
      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          lastContact: new Date(),
          messageCount: { increment: 1 },
        },
      });
    }

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send message via WhatsApp", message: updatedMessage },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: updatedMessage });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
