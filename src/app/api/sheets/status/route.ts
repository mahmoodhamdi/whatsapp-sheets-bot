import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkConnection } from "@/lib/google-sheets/client";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connected = await checkConnection();
    return NextResponse.json({ connected });
  } catch (error) {
    console.error("Sheets status error:", error);
    return NextResponse.json({ connected: false });
  }
}
