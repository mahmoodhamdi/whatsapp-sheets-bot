import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { MessageSquare, Zap, BarChart3, Clock } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const t = await getTranslations("auth");

  return (
    <div className="min-h-screen flex">
      {/* Branding Side - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-700 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <MessageSquare className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold">{t("brand")}</span>
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="text-4xl font-bold leading-tight">
            {t("brandTagline")}
          </h1>
          <p className="text-green-100 text-lg">{t("brandDescription")}</p>

          {/* Features list */}
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-green-50">
                {t("brandFeatures.feature1")}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-green-50">
                {t("brandFeatures.feature2")}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-green-50">
                {t("brandFeatures.feature3")}
              </span>
            </li>
          </ul>
        </div>

        <div className="text-sm text-green-200">
          © {new Date().getFullYear()} WhatsApp Bot. All rights reserved.
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
