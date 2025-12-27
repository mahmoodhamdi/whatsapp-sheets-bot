import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default async function DashboardNotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <FileQuestion className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <span className="text-4xl font-bold text-green-600">404</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div>
            <h2 className="text-lg font-semibold">{t("pageNotFound")}</h2>
            <p className="text-muted-foreground mt-1">
              {t("dashboardPageNotFoundDescription")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <Button asChild className="gap-2 bg-green-600 hover:bg-green-700">
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                {t("backToDashboard")}
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link href="javascript:history.back()">
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                {t("goBack")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
