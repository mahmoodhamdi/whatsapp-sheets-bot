import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default async function LandingPage() {
  const t = await getTranslations("app");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="text-center px-4">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-green-600 flex items-center justify-center">
            <MessageSquare className="h-9 w-9 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t("name")}
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          {t("description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
            <Link href="/register">ابدأ مجاناً</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Landing page - Phase 2 will add full content
        </p>
      </div>
    </div>
  );
}
