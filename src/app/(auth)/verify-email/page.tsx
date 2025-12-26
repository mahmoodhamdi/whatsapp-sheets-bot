"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const t = useTranslations("auth.verifyEmail");
  const locale = useLocale();
  const router = useRouter();
  const { data: session, update, status } = useSession();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const hasSentInitialEmail = useRef(false);

  const sendVerificationEmail = useCallback(async () => {
    setIsResending(true);
    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });

      if (response.ok) {
        setResendCooldown(60); // 60 second cooldown
        toast.success(t("resendSuccess"));
      } else {
        const data = await response.json();
        if (data.error !== "Email already verified") {
          toast.error(data.error);
        }
      }
    } catch {
      console.error("Failed to send verification email");
    } finally {
      setIsResending(false);
    }
  }, [locale, t]);

  // Send initial verification email on mount
  useEffect(() => {
    if (status === "authenticated" && !hasSentInitialEmail.current) {
      hasSentInitialEmail.current = true;
      // Only send if not already verified
      if (!session?.user?.emailVerified) {
        sendVerificationEmail();
      }
    }
  }, [status, session?.user?.emailVerified, sendVerificationEmail]);

  // Redirect if already verified
  useEffect(() => {
    if (session?.user?.emailVerified) {
      router.push("/dashboard");
    }
  }, [session?.user?.emailVerified, router]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (code.length !== 6) return;

    setIsVerifying(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        setIsVerified(true);
        toast.success(t("success"));
        // Update session to get new emailVerified status
        await update();
        // Wait a moment then redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        const data = await response.json();
        toast.error(data.error || t("error"));
      }
    } catch {
      toast.error(t("error"));
    } finally {
      setIsVerifying(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  // Not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          {isVerified ? (
            <CheckCircle className="h-7 w-7 text-green-600" />
          ) : (
            <Mail className="h-7 w-7 text-green-600" />
          )}
        </div>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>
          {t("subtitle")} <strong>{session?.user?.email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isVerified ? (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-medium">{t("success")}</p>
            <p className="text-sm text-muted-foreground">
              Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <>
            <p className="text-center text-sm text-muted-foreground">
              {t("instruction")}
            </p>

            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="text-center text-2xl tracking-[0.5em] font-mono"
              disabled={isVerifying}
              autoFocus
            />

            <Button
              onClick={handleVerify}
              disabled={code.length !== 6 || isVerifying}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{t("resend")}</p>
              <Button
                variant="link"
                onClick={sendVerificationEmail}
                disabled={resendCooldown > 0 || isResending}
                className="text-green-600"
              >
                {isResending ? (
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                ) : null}
                {resendCooldown > 0
                  ? `${t("resendLink")} (${resendCooldown}s)`
                  : t("resendLink")}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
