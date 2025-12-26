"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CheckoutButtonProps {
  planSlug: string;
  billingInterval: "monthly" | "yearly";
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export function CheckoutButton({
  planSlug,
  billingInterval,
  children,
  className,
  variant = "default",
}: CheckoutButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const t = useTranslations("subscription");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/pricing`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug, billingInterval }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch">
      <Button
        onClick={handleCheckout}
        disabled={isLoading || status === "loading"}
        className={className}
        variant={variant}
      >
        {isLoading ? (
          <>
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
            {t("processing")}
          </>
        ) : (
          children
        )}
      </Button>
      {error && (
        <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
