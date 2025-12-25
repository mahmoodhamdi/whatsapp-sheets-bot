import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addQRListener, getStatus } from "@/lib/whatsapp/client";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return current QR if available
  const status = await getStatus();

  // Use Server-Sent Events for real-time QR updates
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial status
      const data = `data: ${JSON.stringify({ qr: status.qr, connected: status.connected })}\n\n`;
      controller.enqueue(encoder.encode(data));

      // Listen for QR updates
      const unsubscribe = addQRListener((qr) => {
        try {
          const eventData = `data: ${JSON.stringify({ qr, connected: !qr })}\n\n`;
          controller.enqueue(encoder.encode(eventData));
        } catch {
          // Stream might be closed
        }
      });

      // Cleanup after 5 minutes
      setTimeout(() => {
        unsubscribe();
        controller.close();
      }, 300000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
