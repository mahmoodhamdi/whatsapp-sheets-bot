import { getUserSubscription } from "@/lib/services/subscription";
import { getFreePlan, getPlanBySlug } from "@/lib/services/plan";

/**
 * Available feature flags
 * These correspond to features stored in the Plan.features JSON array
 */
export type Feature =
  | "basic_support"
  | "priority_support"
  | "dedicated_support"
  | "sheets_sync"
  | "analytics"
  | "api_access"
  | "custom_integrations"
  | "sla";

/**
 * Feature metadata for UI display
 */
export const FEATURE_METADATA: Record<
  Feature,
  { requiredPlan: string; translationKey: string }
> = {
  basic_support: { requiredPlan: "free", translationKey: "basicSupport" },
  priority_support: {
    requiredPlan: "professional",
    translationKey: "prioritySupport",
  },
  dedicated_support: {
    requiredPlan: "enterprise",
    translationKey: "dedicatedSupport",
  },
  sheets_sync: { requiredPlan: "starter", translationKey: "sheetsSync" },
  analytics: { requiredPlan: "professional", translationKey: "analytics" },
  api_access: { requiredPlan: "professional", translationKey: "apiAccess" },
  custom_integrations: {
    requiredPlan: "enterprise",
    translationKey: "customIntegrations",
  },
  sla: { requiredPlan: "enterprise", translationKey: "sla" },
};

/**
 * Plan display names for upgrade prompts
 */
export const PLAN_DISPLAY_NAMES: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
};

/**
 * Check if a user has access to a specific feature
 */
export async function hasFeature(
  userId: string,
  feature: Feature
): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    // User has no subscription, check free plan features
    const freePlan = await getFreePlan();
    const features = freePlan.features as string[];
    return features.includes(feature);
  }

  const features = subscription.plan.features as string[];
  return features.includes(feature);
}

/**
 * Check if a user can use a feature with detailed result
 */
export async function canUseFeature(
  userId: string,
  feature: Feature
): Promise<{
  allowed: boolean;
  reason?: string;
  requiredPlan?: string;
  currentPlan?: string;
  upgradeUrl: string;
}> {
  const subscription = await getUserSubscription(userId);

  let currentPlanSlug = "free";
  let currentFeatures: string[] = [];

  if (subscription) {
    currentPlanSlug = subscription.plan.slug;
    currentFeatures = subscription.plan.features as string[];
  } else {
    const freePlan = await getFreePlan();
    currentFeatures = freePlan.features as string[];
  }

  const allowed = currentFeatures.includes(feature);

  if (allowed) {
    return {
      allowed: true,
      currentPlan: PLAN_DISPLAY_NAMES[currentPlanSlug] || currentPlanSlug,
      upgradeUrl: "/pricing",
    };
  }

  const metadata = FEATURE_METADATA[feature];
  const requiredPlan = metadata?.requiredPlan || "professional";

  return {
    allowed: false,
    reason: "featureNotAvailable",
    requiredPlan: PLAN_DISPLAY_NAMES[requiredPlan] || requiredPlan,
    currentPlan: PLAN_DISPLAY_NAMES[currentPlanSlug] || currentPlanSlug,
    upgradeUrl: "/pricing",
  };
}

/**
 * Get all features available to a user
 */
export async function getUserFeatures(userId: string): Promise<Feature[]> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    const freePlan = await getFreePlan();
    return (freePlan.features as string[]) as Feature[];
  }

  return (subscription.plan.features as string[]) as Feature[];
}

/**
 * Get the minimum plan required for a feature
 */
export function getRequiredPlanForFeature(feature: Feature): string {
  return FEATURE_METADATA[feature]?.requiredPlan || "professional";
}

/**
 * Check if a plan has a specific feature (without database lookup)
 */
export async function planHasFeature(
  planSlug: string,
  feature: Feature
): Promise<boolean> {
  const plan = await getPlanBySlug(planSlug);
  if (!plan) return false;

  const features = plan.features as string[];
  return features.includes(feature);
}

/**
 * Server-side feature check for API routes
 * Throws an error if the feature is not available
 */
export async function requireFeature(
  userId: string,
  feature: Feature
): Promise<void> {
  const result = await canUseFeature(userId, feature);

  if (!result.allowed) {
    const error = new Error(
      `Feature "${feature}" requires ${result.requiredPlan} plan or higher`
    );
    (error as Error & { code: string }).code = "FEATURE_NOT_AVAILABLE";
    (error as Error & { requiredPlan: string }).requiredPlan =
      result.requiredPlan || "Professional";
    throw error;
  }
}

/**
 * Check multiple features at once
 */
export async function hasFeatures(
  userId: string,
  features: Feature[]
): Promise<Record<Feature, boolean>> {
  const userFeatures = await getUserFeatures(userId);
  const result: Record<string, boolean> = {};

  for (const feature of features) {
    result[feature] = userFeatures.includes(feature);
  }

  return result as Record<Feature, boolean>;
}
