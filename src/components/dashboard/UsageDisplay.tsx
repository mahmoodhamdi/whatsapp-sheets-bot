"use client";

import { useTranslations } from "next-intl";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  MessageSquare,
  Bot,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface UsageDisplayProps {
  messagesUsed: number;
  messagesLimit: number;
  rulesUsed: number;
  rulesLimit: number;
  periodStart?: Date | string;
  periodEnd?: Date | string;
  showCard?: boolean;
  showWarnings?: boolean;
}

export function UsageDisplay({
  messagesUsed,
  messagesLimit,
  rulesUsed,
  rulesLimit,
  periodStart,
  periodEnd,
  showCard = false,
  showWarnings = true,
}: UsageDisplayProps) {
  const t = useTranslations("usage");

  const isUnlimitedMessages = messagesLimit === -1;
  const isUnlimitedRules = rulesLimit === -1;

  const messagesPercent = isUnlimitedMessages
    ? 0
    : Math.min(100, (messagesUsed / messagesLimit) * 100);
  const rulesPercent = isUnlimitedRules
    ? 0
    : Math.min(100, (rulesUsed / rulesLimit) * 100);

  const isNearMessageLimit = messagesPercent >= 80 && messagesPercent < 100;
  const isAtMessageLimit = messagesPercent >= 100;
  const isNearRuleLimit = rulesPercent >= 80 && rulesPercent < 100;
  const isAtRuleLimit = rulesPercent >= 100;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  const content = (
    <div className="space-y-6">
      {/* Warnings */}
      {showWarnings && (
        <>
          {isNearMessageLimit && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 dark:text-amber-200">
                {t("nearLimit")}
              </AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                {t("nearLimitDescription", {
                  used: messagesUsed,
                  limit: messagesLimit,
                })}
              </AlertDescription>
            </Alert>
          )}

          {isAtMessageLimit && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t("atLimit")}</AlertTitle>
              <AlertDescription>
                {t("atLimitDescription")}
                <Button asChild size="sm" variant="outline" className="ms-2">
                  <Link href="/pricing">{t("upgrade")}</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Messages Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("messages")}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {isUnlimitedMessages
              ? t("unlimited")
              : `${messagesUsed.toLocaleString()} / ${messagesLimit.toLocaleString()}`}
          </span>
        </div>
        {!isUnlimitedMessages && (
          <Progress
            value={messagesPercent}
            className={`h-2 ${
              isAtMessageLimit
                ? "[&>div]:bg-destructive"
                : isNearMessageLimit
                ? "[&>div]:bg-amber-500"
                : ""
            }`}
          />
        )}
        {isUnlimitedMessages && (
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <Zap className="h-3 w-3" />
            <span>{t("unlimitedPlan")}</span>
          </div>
        )}
      </div>

      {/* Rules Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("rules")}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {isUnlimitedRules
              ? t("unlimited")
              : `${rulesUsed} / ${rulesLimit}`}
          </span>
        </div>
        {!isUnlimitedRules && (
          <Progress
            value={rulesPercent}
            className={`h-2 ${
              isAtRuleLimit
                ? "[&>div]:bg-destructive"
                : isNearRuleLimit
                ? "[&>div]:bg-amber-500"
                : ""
            }`}
          />
        )}
        {isUnlimitedRules && (
          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <Zap className="h-3 w-3" />
            <span>{t("unlimitedPlan")}</span>
          </div>
        )}
      </div>

      {/* Period Info */}
      {periodStart && periodEnd && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <TrendingUp className="h-3 w-3" />
          <span>
            {t("billingPeriod", {
              start: formatDate(periodStart),
              end: formatDate(periodEnd),
            })}
          </span>
        </div>
      )}
    </div>
  );

  if (showCard) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return content;
}

/**
 * Compact inline usage indicator
 */
interface UsageIndicatorProps {
  used: number;
  limit: number;
  label: string;
  icon?: React.ReactNode;
}

export function UsageIndicator({
  used,
  limit,
  label,
  icon,
}: UsageIndicatorProps) {
  const t = useTranslations("usage");
  const isUnlimited = limit === -1;
  const percent = isUnlimited ? 0 : Math.min(100, (used / limit) * 100);
  const isNearLimit = percent >= 80;

  return (
    <div className="flex items-center gap-3">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-sm">
          <span className="truncate">{label}</span>
          <span
            className={`font-medium ${isNearLimit && !isUnlimited ? "text-amber-600" : ""}`}
          >
            {isUnlimited ? t("unlimited") : `${used}/${limit}`}
          </span>
        </div>
        {!isUnlimited && (
          <Progress
            value={percent}
            className={`h-1.5 mt-1 ${isNearLimit ? "[&>div]:bg-amber-500" : ""}`}
          />
        )}
      </div>
    </div>
  );
}
