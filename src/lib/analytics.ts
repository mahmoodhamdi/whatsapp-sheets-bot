/**
 * Analytics tracking library for Google Analytics
 *
 * Usage:
 *   import { trackEvent, trackPageView } from "@/lib/analytics";
 *
 *   // Track a custom event
 *   trackEvent("subscription_started", { plan: "professional" });
 *
 *   // Track a page view (usually automatic)
 *   trackPageView("/dashboard");
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Check if analytics is available
 */
function isAnalyticsAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/**
 * Track a page view
 */
export function trackPageView(url: string): void {
  if (!isAnalyticsAvailable()) return;

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return;

  window.gtag?.("config", measurementId, {
    page_path: url,
  });
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, unknown>
): void {
  if (!isAnalyticsAvailable()) return;

  window.gtag?.("event", eventName, parameters);
}

// ============================================
// Pre-defined event tracking functions
// ============================================

/**
 * Track user sign up
 */
export function trackSignUp(method: string = "credentials"): void {
  trackEvent("sign_up", { method });
}

/**
 * Track user login
 */
export function trackLogin(method: string = "credentials"): void {
  trackEvent("login", { method });
}

/**
 * Track subscription started
 */
export function trackSubscriptionStarted(
  plan: string,
  billingInterval: "monthly" | "yearly",
  value?: number
): void {
  trackEvent("subscription_started", {
    plan,
    billing_interval: billingInterval,
    value,
    currency: "USD",
  });
}

/**
 * Track subscription cancelled
 */
export function trackSubscriptionCancelled(plan: string, reason?: string): void {
  trackEvent("subscription_cancelled", {
    plan,
    reason,
  });
}

/**
 * Track subscription upgraded
 */
export function trackSubscriptionUpgraded(
  fromPlan: string,
  toPlan: string
): void {
  trackEvent("subscription_upgraded", {
    from_plan: fromPlan,
    to_plan: toPlan,
  });
}

/**
 * Track rule created
 */
export function trackRuleCreated(triggerType: string): void {
  trackEvent("rule_created", {
    trigger_type: triggerType,
  });
}

/**
 * Track rule deleted
 */
export function trackRuleDeleted(): void {
  trackEvent("rule_deleted");
}

/**
 * Track message sent
 */
export function trackMessageSent(isAutoReply: boolean): void {
  trackEvent("message_sent", {
    is_auto_reply: isAutoReply,
  });
}

/**
 * Track WhatsApp connected
 */
export function trackWhatsAppConnected(): void {
  trackEvent("whatsapp_connected");
}

/**
 * Track WhatsApp disconnected
 */
export function trackWhatsAppDisconnected(): void {
  trackEvent("whatsapp_disconnected");
}

/**
 * Track Google Sheets synced
 */
export function trackSheetsSynced(recordCount: number): void {
  trackEvent("sheets_synced", {
    record_count: recordCount,
  });
}

/**
 * Track feature usage
 */
export function trackFeatureUsed(featureName: string): void {
  trackEvent("feature_used", {
    feature_name: featureName,
  });
}

/**
 * Track upgrade prompt shown
 */
export function trackUpgradePromptShown(location: string): void {
  trackEvent("upgrade_prompt_shown", {
    location,
  });
}

/**
 * Track upgrade prompt clicked
 */
export function trackUpgradePromptClicked(location: string): void {
  trackEvent("upgrade_prompt_clicked", {
    location,
  });
}

/**
 * Track error occurred
 */
export function trackError(errorType: string, errorMessage?: string): void {
  trackEvent("error_occurred", {
    error_type: errorType,
    error_message: errorMessage,
  });
}
