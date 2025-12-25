import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSyncLogs } from "@/lib/google-sheets/sync";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await getSyncLogs();
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Get logs error:", error);
    return NextResponse.json(
      { error: "Failed to get logs" },
      { status: 500 }
    );
  }
}
