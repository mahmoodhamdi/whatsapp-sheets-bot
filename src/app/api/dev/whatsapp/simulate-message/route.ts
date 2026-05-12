import { NextRequest, NextResponse } from "next/server";
import { resolveMode } from "@/lib/whatsapp/adapter";
import { simulateIncomingMessage, mockAdapter } from "@/lib/whatsapp/mock-adapter";
import { z } from "zod";

const bodySchema = z.object({
  phone: z.string().min(5),
  text: z.string().min(1),
  pushName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  if (resolveMode() !== "mock") {
    return NextResponse.json(
      { error: "Dev simulator only available when WHATSAPP_MODE=mock" },
      { status: 403 },
    );
  }

  let body;
  try {
    body = bodySchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid body", details: err instanceof Error ? err.message : String(err) },
      { status: 400 },
    );
  }

  await mockAdapter.connect();
  const result = await simulateIncomingMessage(body.phone, body.text, body.pushName);
  return NextResponse.json({ ok: true, ...result });
}
