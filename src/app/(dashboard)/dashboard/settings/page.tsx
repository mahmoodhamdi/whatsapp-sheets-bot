"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Save, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Settings {
  businessName: string;
  defaultReply: string;
  whatsappConnected: boolean;
  googleSheetsId: string | null;
}

export default function SettingsPage() {
  const t = useTranslations();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch {
      toast.error(t("errors.general"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: settings.businessName,
          defaultReply: settings.defaultReply,
          googleSheetsId: settings.googleSheetsId,
        }),
      });

      if (res.ok) {
        toast.success(t("settings.saved"));
      } else {
        throw new Error();
      }
    } catch {
      toast.error(t("errors.general"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("settings.title")}</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.general")}</CardTitle>
            <CardDescription>{t("settings.generalDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">{t("settings.businessName")}</Label>
              <Input
                id="businessName"
                value={settings?.businessName || ""}
                onChange={(e) =>
                  setSettings((s) => s && { ...s, businessName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultReply">{t("settings.defaultReply")}</Label>
              <Textarea
                id="defaultReply"
                rows={4}
                value={settings?.defaultReply || ""}
                onChange={(e) =>
                  setSettings((s) => s && { ...s, defaultReply: e.target.value })
                }
                placeholder={t("settings.defaultReplyPlaceholder")}
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="me-2 h-4 w-4" />
              )}
              {t("settings.save")}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("settings.whatsapp")}</CardTitle>
                <Badge
                  variant={settings?.whatsappConnected ? "default" : "secondary"}
                >
                  {settings?.whatsappConnected ? (
                    <>
                      <Wifi className="me-1 h-3 w-3" />
                      {t("settings.connected")}
                    </>
                  ) : (
                    <>
                      <WifiOff className="me-1 h-3 w-3" />
                      {t("settings.disconnected")}
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <a href="/dashboard/settings/whatsapp">
                  {settings?.whatsappConnected
                    ? t("settings.disconnect")
                    : t("settings.connect")}
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settings.sheets")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sheetsId">{t("settings.sheetsId")}</Label>
                <Input
                  id="sheetsId"
                  value={settings?.googleSheetsId || ""}
                  onChange={(e) =>
                    setSettings((s) =>
                      s && { ...s, googleSheetsId: e.target.value || null }
                    )
                  }
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs..."
                />
              </div>
              <Button variant="outline" asChild className="w-full">
                <a href="/dashboard/settings/sheets">
                  {t("settings.configureSheets")}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
