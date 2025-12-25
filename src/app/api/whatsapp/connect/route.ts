import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectWhatsApp } from "@/lib/whatsapp/client";

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectWhatsApp();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Connect error:", error);
    return NextResponse.json(
      { error: "Failed to connect" },
      { status: 500 }
    );
  }
}
