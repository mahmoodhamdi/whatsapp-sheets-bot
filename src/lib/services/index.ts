// Plan service
export {
  getAllPlans,
  getPlanBySlug,
  getPlanByStripePriceId,
  getFreePlan,
  planHasFeature,
  getPlanLimits,
} from "./plan";

// Subscription service
export {
  getUserSubscription,
  createFreeSubscription,
  updateSubscriptionStatus,
  updateSubscriptionFromStripe,
  cancelSubscriptionAtPeriodEnd,
  reactivateSubscription,
  isSubscriptionActive,
  getSubscriptionLimits,
  userHasFeature,
  getSubscriptionByStripeId,
  deleteSubscription,
} from "./subscription";
export type { SubscriptionWithPlan } from "./subscription";

// Usage service
export {
  getCurrentUsage,
  incrementMessageCount,
  canSendMessage,
  canCreateRule,
  getMessageUsagePercentage,
  getRemainingMessages,
  resetUsageForPeriod,
  getUsageHistory,
} from "./usage";
export type { UsageData } from "./usage";
