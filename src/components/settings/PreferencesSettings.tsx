"use client";

import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Moon, Sun, Monitor, Settings2 } from "lucide-react";
import { locales, localeNames, type Locale } from "@/i18n/config";

export function PreferencesSettings() {
  const t = useTranslations("accountSettings.preferences");
  const router = useRouter();
  const currentLocale = useLocale();
  const { theme, setTheme } = useTheme();

  const switchLocale = (locale: Locale) => {
    document.cookie = `locale=${locale};path=/;max-age=31536000`;
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Language Setting */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t("language")}
          </Label>
          <Select value={currentLocale} onValueChange={(value) => switchLocale(value as Locale)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locales.map((locale) => (
                <SelectItem key={locale} value={locale}>
                  {localeNames[locale]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{t("languageNote")}</p>
        </div>

        {/* Theme Setting */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            {t("theme")}
          </Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  {t("themeLight")}
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  {t("themeDark")}
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  {t("themeSystem")}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{t("themeNote")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
