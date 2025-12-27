import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-green-600 mb-4">404</h1>

        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">{t("pageNotFound")}</h2>
        <p className="text-muted-foreground mb-6">{t("pageNotFoundDescription")}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="gap-2 bg-green-600 hover:bg-green-700">
            <Link href="/">
              <Home className="h-4 w-4" />
              {t("goHome")}
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="javascript:history.back()">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t("goBack")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
