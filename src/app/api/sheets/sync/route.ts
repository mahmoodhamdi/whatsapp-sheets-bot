import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { syncAll } from "@/lib/google-sheets/sync";
import { hasFeature } from "@/lib/features";

export async function POST() {
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
        message: "Google Sheets sync requires Starter plan or higher",
      },
      { status: 403 }
    );
  }

  try {
    const result = await syncAll();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
