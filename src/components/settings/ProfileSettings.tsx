"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Save, User, Mail } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2).max(50),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export function ProfileSettings() {
  const t = useTranslations("accountSettings.profile");
  const tErrors = useTranslations("errors");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          reset({ name: data.name });
        }
      } catch {
        toast.error(tErrors("general"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [reset, tErrors]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updated = await response.json();
        setProfile((prev) => prev && { ...prev, name: updated.name });
        reset({ name: updated.name });
        toast.success(t("updateSuccess"));
      } else {
        const error = await response.json();
        toast.error(error.error || tErrors("general"));
      }
    } catch {
      toast.error(tErrors("general"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder={t("namePlaceholder")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{t("nameError")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">{t("emailNote")}</p>
          </div>

          <Button type="submit" disabled={isSaving || !isDirty}>
            {isSaving ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="me-2 h-4 w-4" />
            )}
            {t("save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
