"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RotateCcw, ArrowLeft } from "lucide-react";
import { trackError } from "@/lib/analytics";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error("Dashboard error:", error);
    trackError("dashboard_error", error.message);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle>{t("somethingWrong")}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{t("dashboardErrorDescription")}</p>

          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <Button onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              {t("tryAgain")}
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                {t("backToDashboard")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
