"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CreditCard,
  ExternalLink,
  Loader2,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  trackSubscriptionCancelled,
  trackUpgradePromptClicked,
} from "@/lib/analytics";

interface BillingSettingsProps {
  subscription: {
    id: string;
    plan: {
      id: string;
      name: string;
      slug: string;
      messagesPerMonth: number;
      rulesLimit: number;
      features: string[];
    };
    status: string;
    billingInterval: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    canceledAt: string | null;
    stripeSubscriptionId: string | null;
  } | null;
  usage: {
    messagesCount: number;
    rulesCount: number;
    periodStart: string;
    periodEnd: string;
    limits: {
      messagesPerMonth: number;
      rulesLimit: number;
      isUnlimitedMessages: boolean;
      isUnlimitedRules: boolean;
    };
  };
}

export function BillingSettings({ subscription, usage }: BillingSettingsProps) {
  const t = useTranslations("billing");
  const router = useRouter();
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isResumeLoading, setIsResumeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const planName = subscription?.plan.name ?? t("freePlan");
  const status = subscription?.status ?? "FREE";
  const isActive = status === "ACTIVE" || status === "TRIALING";
  const isPastDue = status === "PAST_DUE";
  const isCanceled = subscription?.cancelAtPeriodEnd;
  const hasPaidPlan =
    subscription?.plan.slug !== "free" && subscription?.stripeSubscriptionId;

  const messagesUsed = usage.messagesCount;
  const messagesLimit = usage.limits.messagesPerMonth;
  const isUnlimitedMessages = usage.limits.isUnlimitedMessages;
  const messagesPercent = isUnlimitedMessages
    ? 0
    : Math.min((messagesUsed / messagesLimit) * 100, 100);
  const isNearLimit = messagesPercent >= 80;

  const openPortal = async () => {
    setIsPortalLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to open billing portal");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsPortalLoading(false);
    }
  };

  const handleCancel = async () => {
    setShowCancelDialog(false);
    setIsCancelLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      // Track subscription cancellation
      trackSubscriptionCancelled(subscription?.plan.slug ?? "unknown");

      router.refresh();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsCancelLoading(false);
    }
  };

  const handleResume = async () => {
    setIsResumeLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/subscription/resume", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resume subscription");
      }

      router.refresh();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsResumeLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = () => {
    if (isCanceled) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          {t("status.canceling")}
        </Badge>
      );
    }
    if (isPastDue) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          {t("status.pastDue")}
        </Badge>
      );
    }
    if (isActive) {
      return (
        <Badge
          variant="default"
          className="gap-1 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-3 w-3" />
          {t("status.active")}
        </Badge>
      );
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("currentPlan")}</CardTitle>
            {getStatusBadge()}
          </div>
          <CardDescription>{t("currentPlanDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold">{planName}</span>
              {subscription?.billingInterval && (
                <span className="text-muted-foreground ms-2">
                  ({t(`interval.${subscription.billingInterval.toLowerCase()}`)})
                </span>
              )}
            </div>
            {!hasPaidPlan && (
              <Button
                onClick={() => {
                  trackUpgradePromptClicked("billing_page");
                  router.push("/pricing");
                }}
                className="gap-2"
              >
                {t("upgrade")}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {subscription?.currentPeriodEnd && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {isCanceled
                ? t("endsOn", { date: formatDate(subscription.currentPeriodEnd) })
                : t("renewsOn", {
                    date: formatDate(subscription.currentPeriodEnd),
                  })}
            </div>
          )}

          {isCanceled && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                {t("canceledNotice")}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleResume}
                disabled={isResumeLoading}
              >
                {isResumeLoading && (
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                )}
                {t("resumeSubscription")}
              </Button>
            </div>
          )}

          {isPastDue && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 text-sm">
                {t("pastDueNotice")}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={openPortal}
                disabled={isPortalLoading}
              >
                {isPortalLoading && (
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                )}
                {t("updatePayment")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle>{t("usage")}</CardTitle>
          <CardDescription>{t("usageDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Messages Usage */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{t("messages")}</span>
              <span
                className={cn(
                  isNearLimit && !isUnlimitedMessages && "text-yellow-600"
                )}
              >
                {isUnlimitedMessages
                  ? t("unlimited")
                  : `${messagesUsed.toLocaleString()} / ${messagesLimit.toLocaleString()}`}
              </span>
            </div>
            {!isUnlimitedMessages && (
              <Progress
                value={messagesPercent}
                className={cn(isNearLimit && "[&>div]:bg-yellow-500")}
              />
            )}
            {isNearLimit && !isUnlimitedMessages && (
              <p className="text-xs text-yellow-600 mt-1">
                {t("nearLimitWarning")}
              </p>
            )}
          </div>

          {/* Rules Usage */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{t("rules")}</span>
              <span>
                {usage.limits.isUnlimitedRules
                  ? t("unlimited")
                  : `${usage.rulesCount} / ${usage.limits.rulesLimit}`}
              </span>
            </div>
            {!usage.limits.isUnlimitedRules && (
              <Progress
                value={(usage.rulesCount / usage.limits.rulesLimit) * 100}
              />
            )}
          </div>

          {/* Period Info */}
          <div className="text-xs text-muted-foreground">
            {t("billingPeriod", {
              start: formatDate(usage.periodStart),
              end: formatDate(usage.periodEnd),
            })}
          </div>
        </CardContent>
      </Card>

      {/* Manage Billing */}
      {hasPaidPlan && (
        <Card>
          <CardHeader>
            <CardTitle>{t("manageBilling")}</CardTitle>
            <CardDescription>{t("manageBillingDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={openPortal}
                disabled={isPortalLoading}
                className="gap-2"
              >
                {isPortalLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                {t("openPortal")}
                <ExternalLink className="h-4 w-4" />
              </Button>

              {!isCanceled && (
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isCancelLoading}
                  className="text-destructive hover:text-destructive"
                >
                  {isCancelLoading && (
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  )}
                  {t("cancelSubscription")}
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground">{t("portalInfo")}</p>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Prompt for Free Users */}
      {!hasPaidPlan && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200">
              {t("upgradePrompt.title")}
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              {t("upgradePrompt.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                trackUpgradePromptClicked("billing_upgrade_card");
                router.push("/pricing");
              }}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {t("upgradePrompt.cta")}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("cancelSubscription")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("cancelConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("keepSubscription")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("confirmCancel")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
