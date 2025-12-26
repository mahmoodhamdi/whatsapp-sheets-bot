import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkConnection } from "@/lib/google-sheets/client";
import { hasFeature } from "@/lib/features";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user has sheets_sync feature
  const hasSheetsAccess = await hasFeature(session.user.id, "sheets_sync");
  if (!hasSheetsAccess) {
    return NextResponse.json(
      {
        error: "Feature not available",
        code: "FEATURE_NOT_AVAILABLE",
        requiredPlan: "Starter",
      },
      { status: 403 }
    );
  }

  try {
    const connected = await checkConnection();
    return NextResponse.json({ connected });
  } catch (error) {
    console.error("Sheets status error:", error);
    return NextResponse.json({ connected: false });
  }
}
