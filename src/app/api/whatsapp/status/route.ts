import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStatus } from "@/lib/whatsapp/client";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await getStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("Status error:", error);
    return NextResponse.json(
      { error: "Failed to get status" },
      { status: 500 }
    );
  }
}
