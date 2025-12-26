import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasFeature } from "@/lib/features";
import { SheetsSettingsContent } from "./SheetsSettingsContent";
import { FeatureGate } from "@/components/subscription/FeatureGate";

export default async function SheetsSettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const hasSheetsAccess = await hasFeature(session.user.id, "sheets_sync");

  return (
    <FeatureGate
      feature="sheets_sync"
      hasAccess={hasSheetsAccess}
      requiredPlan="Starter"
    >
      <SheetsSettingsContent />
    </FeatureGate>
  );
}
