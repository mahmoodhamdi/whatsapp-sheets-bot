"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface RuleFormProps {
  rule?: {
    id: string;
    name: string;
    trigger: string;
    triggerType: string;
    response: string;
    priority: number;
    isActive: boolean;
  };
}

export function RuleForm({ rule }: RuleFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: rule?.name || "",
    trigger: rule?.trigger || "",
    triggerType: rule?.triggerType || "CONTAINS",
    response: rule?.response || "",
    priority: rule?.priority || 0,
    isActive: rule?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = rule ? `/api/rules/${rule.id}` : "/api/rules";
      const method = rule ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save rule");
      }

      toast.success(rule ? t("rules.updated") : t("rules.created"));
      router.push("/dashboard/rules");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("errors.general"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{rule ? t("rules.edit") : t("rules.create")}</CardTitle>
          <CardDescription>
            {rule
              ? "Update the auto-reply rule settings"
              : "Create a new auto-reply rule for incoming messages"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t("rules.name")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="triggerType">{t("rules.triggerType")}</Label>
              <Select
                value={formData.triggerType}
                onValueChange={(value) =>
                  setFormData({ ...formData, triggerType: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger data-testid="trigger-type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXACT">{t("rules.types.exact")}</SelectItem>
                  <SelectItem value="CONTAINS">
                    {t("rules.types.contains")}
                  </SelectItem>
                  <SelectItem value="STARTS_WITH">
                    {t("rules.types.startsWith")}
                  </SelectItem>
                  <SelectItem value="REGEX">{t("rules.types.regex")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trigger">{t("rules.trigger")}</Label>
            <Input
              id="trigger"
              value={formData.trigger}
              onChange={(e) =>
                setFormData({ ...formData, trigger: e.target.value })
              }
              placeholder={
                formData.triggerType === "REGEX"
                  ? "e.g., price|cost|\\d+\\s*SAR"
                  : "e.g., hello, hi, مرحبا"
              }
              required
              disabled={isLoading}
              className="font-mono"
            />
            {formData.triggerType === "REGEX" && (
              <p className="text-xs text-muted-foreground">
                Use | for alternatives (OR). Example: سعر|كم|تكلفة
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="response">{t("rules.response")}</Label>
            <Textarea
              id="response"
              value={formData.response}
              onChange={(e) =>
                setFormData({ ...formData, response: e.target.value })
              }
              rows={4}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">{t("rules.priority")}</Label>
              <Input
                id="priority"
                type="number"
                min={0}
                max={100}
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: parseInt(e.target.value) || 0,
                  })
                }
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Higher priority rules are checked first (0-100)
              </p>
            </div>
            <div className="space-y-2">
              <Label>{t("rules.active")}</Label>
              <div className="flex items-center gap-2 pt-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground">
                  {formData.isActive ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {t("common.save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
